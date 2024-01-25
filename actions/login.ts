"use server"

import * as z from "zod"

import { db } from "@/lib/db"

import { signIn } from "@/auth"
import { LoginSchema } from "@/schemas"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { AuthError } from "next-auth"
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens"
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail"
import { FeedbackParamsProps } from "@/components/form-feedback"

type LoginReturnProps = {
    twoFactor?: boolean
} & FeedbackParamsProps

export const login = async (values: z.infer<typeof LoginSchema>): Promise<LoginReturnProps> => {
    const validatedFields = await LoginSchema.safeParseAsync(values)
    const now = new Date()

    if (!validatedFields.success) {
        return {
            type: "error",
            message: "Invalid fields."
        }
    }

    const { email, password, code } = validatedFields.data

    const userExists = await db.user.findFirst({
        where: { email: email }
    })

    if (!userExists || !userExists.email || !userExists.password) {
        return {
            type: "error",
            message: "Invalid credentials."
        }
    }

    /* EMAIL VERIFICATION */

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
            message: "Please verify link in your e-mail inbox."
        }
    }


    /* TWO FACTOR AUTHENTICATION */

    if (userExists.isTwoFactorEnabled) {
        if (code) {
            const twoFactorToken = await db.twoFactorToken.findFirst({
                where: { email: email }
            })

            if (!twoFactorToken) {
                return {
                    type: "error",
                    message: "Code is not available. Try login again."
                }
            }

            const hasExpired = now.getTime() > new Date(twoFactorToken.expires_at).getTime()

            if (hasExpired) {
                return {
                    type: "error",
                    message: "Code has expired."
                }
            }

            if (twoFactorToken.token !== code) {
                return {
                    type: "error",
                    message: "Invalid code."
                }
            }

            await db.twoFactorToken.delete({
                where: { id: twoFactorToken.id }
            })

            const confirmationExists = await db.twoFactorConfirmation.findUnique({
                where: { userId: userExists.id }
            })

            if (confirmationExists) {
                await db.twoFactorConfirmation.delete({
                    where: { id: confirmationExists.id }
                })
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: userExists.id
                }
            })
        } else {
            const { isNewToken, twoFactorToken: { token } } = await generateTwoFactorToken(userExists.email)

            if (isNewToken) {
                await sendTwoFactorTokenEmail(userExists.email, token)

                return {
                    twoFactor: true,
                    type: "success",
                    message: "Confirmation code e-mail sent."
                }
            }

            return {
                twoFactor: true,
                type: "warning",
                message: "Please verify code in your e-mail inbox."
            }
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