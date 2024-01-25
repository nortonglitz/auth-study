"use server"

import * as z from "zod"
import bcrypt from "bcryptjs"
import { NewPasswordSchema } from "@/schemas"
import { FeedbackParamsProps } from "@/components/form-feedback"
import { db } from "@/lib/db"

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token?: string | null
): Promise<FeedbackParamsProps> => {

    const today = new Date()

    if (!token) {
        return {
            type: "error",
            message: "Missing token."
        }
    }

    const validatedFields = await NewPasswordSchema.safeParseAsync(values)

    if (!validatedFields.success) {
        return {
            type: "error",
            message: "Invalid fields."
        }
    }

    const { password } = validatedFields.data

    const tokenExists = await db.passwordResetToken.findUnique({
        where: { token: token }
    })

    if (!tokenExists) {
        return {
            type: "error",
            message: "Invalid token."
        }
    }

    const hasExpired = new Date(tokenExists.expires_at).getTime() < today.getTime()

    if (hasExpired) {
        return {
            type: "error",
            message: "Token has expired."
        }
    }

    const userExists = await db.user.findUnique({
        where: { email: tokenExists.email }
    })

    if (!userExists) {
        return {
            type: "error",
            message: "Email does not exists."
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.user.update({
        where: { id: userExists.id },
        data: {
            password: hashedPassword
        }
    })

    await db.passwordResetToken.delete({
        where: { id: tokenExists.id }
    })

    return {
        type: "success",
        message: "Password changed."
    }
}