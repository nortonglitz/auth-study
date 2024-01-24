"use server"

import * as z from "zod"

import { db } from "@/lib/db"

import { signIn } from "@/auth"
import { LoginSchema } from "@/schemas"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { AuthError } from "next-auth"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"

interface LoginReturn {
    type: "error" | "success" | "warning"
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

    const userExists = await db.user.findFirst({
        where: { email: email }
    })

    if (!userExists || !userExists.email || !userExists.password) {
        return {
            type: "error",
            message: "Invalid credentials."
        }
    }

    if (!userExists.emailVerified) {
        const { isNewToken, verificationToken: { token } } = await generateVerificationToken(userExists.email)

        if (isNewToken) {
            await sendVerificationEmail(email, token)

            return {
                type: "success",
                message: "Verification e-mail sent."
            }
        }

        return {
            type: "warning",
            message: "Please verify your e-mail inbox."
        }
    }

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