import NextAuth, { AuthError, Session } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import authConfig from "./auth.config"
import { JWT } from "next-auth/jwt"

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    callbacks: {
        async signIn({ user, account }) {
            if (!account) return false

            // Allow OAuth without email verification
            if (account.type === "credentials") {
                const userExists = await db.user.findUnique({
                    where: { id: user.id }
                })

                // Prevent sign in without email verification
                if (!userExists || !userExists.emailVerified) {
                    const error = new AuthError("E-mail not verified.")
                    error.name = "CredentialsEmailNotVerified"
                    error.type = "AuthorizedCallbackError"

                    throw error
                }

                if (userExists.isTwoFactorEnabled) {
                    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
                        where: { userId: userExists.id }
                    })

                    if (!twoFactorConfirmation) {
                        const error = new AuthError("2FA not confirmed.")
                        error.name = "Credentials2FANotConfirmed"
                        error.type = "AuthorizedCallbackError"

                        throw error
                    }

                    await db.twoFactorConfirmation.delete({
                        where: { id: twoFactorConfirmation.id }
                    })
                }

            }

            return true
        },
        async session({ session, token }: { session: Session, token?: JWT }) {
            if (token && session.user) {
                session.user.id = token.sub
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled
                session.user.email = token.email
                session.user.name = token.name
                session.user.role = token.role
                session.user.isOAuth = token.isOAuth
            }

            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token

            const userExists = await db.user.findUnique({
                where: { id: token.sub }
            })

            if (!userExists) return token

            const accountExists = await db.account.findFirst({
                where: { id: userExists.id }
            })

            token.isOAuth = !!accountExists
            token.role = userExists.role
            token.name = userExists.name
            token.email = userExists.email
            token.isTwoFactorEnabled = userExists.isTwoFactorEnabled


            return token
        }
    },
    ...authConfig,
})