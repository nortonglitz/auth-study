"use server"

import * as z from "zod"
import { db } from "@/lib/db"
import { ResetSchema } from "@/schemas"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"
import { FeedbackParamsProps } from "@/components/form-feedback"

export const reset = async (values: z.infer<typeof ResetSchema>): Promise<FeedbackParamsProps> => {
    const validatedFields = await ResetSchema.safeParseAsync(values)

    if (!validatedFields.success) {
        return {
            type: "error",
            message: "Invalid email."
        }
    }

    const { email } = validatedFields.data

    const userExists = await db.user.findUnique({
        where: { email: email }
    })

    if (!userExists) {
        return {
            type: "error",
            message: "Email not found."
        }
    }

    const { isNewToken, passwordResetToken: { token } } = await generatePasswordResetToken(email)

    if (isNewToken) {
        await sendPasswordResetEmail(email, token)
    }

    return {
        type: "success",
        message: "Reset email sent."
    }
}