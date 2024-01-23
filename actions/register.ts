"use server"

import * as z from "zod"

import { RegisterSchema } from "@/schemas"

interface RegisterReturn {
    type: "error" | "success"
    message: string
}

export const register = async (values: z.infer<typeof RegisterSchema>): Promise<RegisterReturn> => {
    const validatedFields = await RegisterSchema.safeParseAsync(values)

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