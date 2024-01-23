import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import credentials from "next-auth/providers/credentials"

import { LoginSchema } from "@/schemas"
import { db } from "@/lib/db"

export default {
    providers: [credentials({
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
    })],
} satisfies NextAuthConfig