import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Send an email with a token to get it verified.
 * __This function does not check if user already has e-mail verified.__
 * @param email E-mail needed to be verified
 * @param token Genereted token by `generateVerificationToken` function
 */

export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your e-mail",
        html: `<p><a href="${confirmLink}">Click here</a> to confirm e-mail.</p>`
    })

}