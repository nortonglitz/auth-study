import { db } from "./db"
import { v4 as uuidv4 } from "uuid"

/**
 * Generate a new token to validate an e-mail, or return old token if has not expired.
 * __Verify if the user has e-mail verified before calling this function.__
 * @param email E-mail needed to be verified.
 * @returns Token generated
 */

export const generateVerificationToken = async (email: string) => {
    const today = new Date()
    const expiresAt = new Date(today.getTime() + 3600 * 1000)
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
            newToken: true,
            verificationToken
        }
    }

    // Check if has not expired yet

    if (tokenExists.expires_at.getTime() > today.getTime()) {
        return {
            newToken: false,
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
        newToken: true,
        verificationToken: updatedVerficationToken
    }

}