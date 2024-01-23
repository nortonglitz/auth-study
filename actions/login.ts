"use server"

import * as z from "zod"

import { signIn } from "@/auth"
import { LoginSchema } from "@/schemas"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { AuthError } from "next-auth"

interface LoginReturn {
    type: "error" | "success"
    message: string
}

export const login = async (values: z.infer<typeof LoginSchema>): Promise<LoginReturn> => {
    const validatedFields = await LoginSchema.safeParseAsync(values)

    if (!validatedFields.success) {
        return {
            type: "error",
            message: "Invalid fields."
        }
    }

    const { email, password } = validatedFields.data

    try {

        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })

        return {
            type: "success",
            message: "Logged in."
        }

    } catch (error) {

        if (error instanceof AuthError) {
            if (error.type === "CredentialsSignin") {
                return {
                    type: "error",
                    message: "Invalid credentials."
                }
            }

            return {
                type: "error",
                message: "Something went wrong."
            }
        }

        throw error
    }
}