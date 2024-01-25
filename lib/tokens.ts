import crypto from "crypto"
import { db } from "./db"
import { v4 as uuidv4 } from "uuid"

/**
 * Generate a new token to enable 2FA, or return old token if has not expired.
 * @param email E-mail needed to generate 2FA token
 * @returns Token generated and a boolean if it was genereted a new one or not.
 */

export const generateTwoFactorToken = async (email: string) => {
    const now = new Date()
    // You can use underscore to make easier to read the number
    const token = crypto.randomInt(100_000, 1_000_000).toString()
    const expiresAt = new Date(now.getTime() + 3600 * 1000)

    const tokenExists = await db.twoFactorToken.findFirst({
        where: { email: email }
    })

    // Create a new token if does not exists

    if (!tokenExists) {
        const twoFactorToken = await db.twoFactorToken.create({
            data: {
                email,
                token,
                expires_at: expiresAt
            }
        })

        return {
            isNewToken: true,
            twoFactorToken
        }
    }

    // Check if has not expired yet

    if (tokenExists.expires_at.getTime() > now.getTime()) {
        return {
            isNewToken: false,
            twoFactorToken: tokenExists
        }
    }

    // If has expired, update using new expires date and token

    const updatedTwoFactorToken = await db.twoFactorToken.update({
        where: {
            id: tokenExists.id
        },
        data: {
            expires_at: expiresAt,
            token: token
        }
    })

    return {
        isNewToken: true,
        twoFactorToken: updatedTwoFactorToken
    }
}

/**
 * Generate a new token to reset password, or return old token if has not expired.
 * @param email E-mail needed to reset password.
 * @returns Token generated and a boolean if it was genereted a new one or not.
 */

export const generatePasswordResetToken = async (email: string) => {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 3600 * 1000)
    const token = uuidv4()

    const tokenExists = await db.passwordResetToken.findFirst({
        where: { email: email }
    })

    // Create a new token if does not exists

    if (!tokenExists) {
        const passwordResetToken = await db.passwordResetToken.create({
            data: {
                email,
                token,
                expires_at: expiresAt
            }
        })

        return {
            isNewToken: true,
            passwordResetToken
        }
    }

    // Check if has not expired yet

    if (tokenExists.expires_at.getTime() > now.getTime()) {
        return {
            isNewToken: false,
            passwordResetToken: tokenExists
        }
    }

    // If has expired, update using new expires date and token

    const updatedVerficationToken = await db.passwordResetToken.update({
        where: {
            id: tokenExists.id
        },
        data: {
            expires_at: expiresAt,
            token: token
        }
    })

    return {
        isNewToken: true,
        passwordResetToken: updatedVerficationToken
    }

}

/**
 * Generate a new token to validate an e-mail, or return old token if has not expired.
 * __Verify if the user has e-mail verified before calling this function.__
 * @param email E-mail needed to be verified.
 * @returns Token generated and a boolean if it was genereted a new one or not.
 */

export const generateVerificationToken = async (email: string) => {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 3600 * 1000)
    const token = uuidv4()

    const tokenExists = await db.verificationToken.findFirst({
        where: { email: email }
    })

    // Create a new token if does not exists

    if (!tokenExists) {
        const verificationToken = await db.verificationToken.create({
            data: {
                email,
                token,
                expires_at: expiresAt
            }
        })

        return {
            isNewToken: true,
            verificationToken
        }
    }

    // Check if has not expired yet

    if (tokenExists.expires_at.getTime() > now.getTime()) {
        return {
            isNewToken: false,
            verificationToken: tokenExists
        }
    }

    // If has expired, update using new expires date and token

    const updatedVerficationToken = await db.verificationToken.update({
        where: {
            id: tokenExists.id
        },
        data: {
            expires_at: expiresAt,
            token: token
        }
    })

    return {
        isNewToken: true,
        verificationToken: updatedVerficationToken
    }

}