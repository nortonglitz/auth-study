"use server"

import * as z from "zod"
import { db } from "@/lib/db"

import { RegisterSchema } from "@/schemas"
import bcrypt from "bcryptjs"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"

interface RegisterReturn {
    type: "error" | "success" | "warning"
    message: string
}

export const register = async (values: z.infer<typeof RegisterSchema>): Promise<RegisterReturn> => {
    try {
        const validatedFields = await RegisterSchema.safeParseAsync(values)

        if (!validatedFields.success) {
            return {
                type: "error",
                message: "Invalid fields."
            }
        }

        const { email, name, password } = validatedFields.data

        const userExists = await db.user.findUnique({ where: { email: email } })

        if (userExists) {
            return {
                type: "error",
                message: "Email already taken."
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await db.user.create({
            data: {
                email: email,
                name: name,
                password: hashedPassword
            }
        })

        const { isNewToken, verificationToken: { token } } = await generateVerificationToken(email)

        if (isNewToken) {
            sendVerificationEmail(email, token)
        }

        return {
            type: "success",
            message: "Confirmation email sent."
        }

    } catch (err: any) {

        return {
            type: "error",
            message: "Internal error."
        }

    }

}