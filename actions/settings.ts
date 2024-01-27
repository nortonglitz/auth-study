"use server"

import * as z from "zod"

import { db } from "@/lib/db"
import { SettingsSchema } from "@/schemas"
import { currentUser } from "@/lib/auth"
import { FeedbackParamsProps } from "@/components/form-feedback"

export const settings = async (
    values: z.infer<typeof SettingsSchema>
): Promise<FeedbackParamsProps> => {
    try {
        const user = await currentUser()

        if (!user) {
            return {
                type: "error",
                message: "Unauthorized"
            }
        }

        const dbUser = await db.user.findUnique({
            where: { id: user.id }
        })

        if (!dbUser) {
            return {
                type: "error",
                message: "Unauthorized"
            }
        }

        if (user.isOAuth) {
            values.email = undefined
            values.password = undefined
            values.newPassword = undefined
            values.isTwoFactorEnabled = undefined
        }

        if (values.newPassword !== values.newPassword) {
            return {
                type: "error",
                message: "Passwords does not match."
            }
        }

        await db.user.update({
            where: { id: dbUser.id },
            data: {
                ...values
            }
        })

        return {
            type: "success",
            message: "Data updated."
        }

    } catch (err) {

        return {
            type: "error",
            message: "Something went wrong."
        }

    }

}