"use server"

import { db } from "@/lib/db"
import { FeedbackParamsProps } from "@/components/form-feedback"

export const newVerification = async (token: string): Promise<FeedbackParamsProps> => {

    const today = new Date()

    const tokenExists = await db.verificationToken.findUnique({
        where: { token: token }
    })

    if (!tokenExists) {
        return {
            type: "error",
            message: "Token does not exists."
        }
    }

    const hasExpired = tokenExists.expires_at.getTime() < today.getTime()

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

    await db.user.update({
        where: { id: userExists.id },
        data: {
            emailVerified: new Date(),
            email: tokenExists.email
        }
    })

    await db.verificationToken.delete({
        where: { id: tokenExists.id }
    })

    return {
        type: "success",
        message: "Email verified."
    }
}