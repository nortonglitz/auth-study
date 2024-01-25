import * as z from "zod"

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum 6 characters."
    })
})

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, {
        message: "Password is required."
    }),
    code: z.optional(z.string())
})

export const ResetSchema = z.object({
    email: z.string().email()
})

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, {
        message: "Minimum 6 characters."
    }),
    name: z.string().min(1, {
        message: "Name is required."
    })
})

