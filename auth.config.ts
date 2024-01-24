import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

import { LoginSchema } from "@/schemas"
import { db } from "@/lib/db"

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = await LoginSchema.safeParseAsync(credentials)

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data

                    const userExists = await db.user.findUnique({ where: { email: email } })

                    if (!userExists || !userExists.password) return null

                    const passwordsMatch = await bcrypt.compare(password, userExists.password)

                    if (passwordsMatch) return userExists
                }

                return null
            }
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET
        })
    ],
} satisfies NextAuthConfig