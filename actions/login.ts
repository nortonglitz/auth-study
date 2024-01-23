"use server"

import * as z from "zod"

import { LoginSchema } from "@/schemas"

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

    return {
        type: "success",
        message: "Email sent"
    }
}