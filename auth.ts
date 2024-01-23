import NextAuth, { Session } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import authConfig from "./auth.config"
import { JWT } from "next-auth/jwt"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    callbacks: {
        async session({ session, token }: { session: Session, token?: JWT }) {
            if (token && token.sub && session.user && token.role) {
                session.user.id = token.sub
                session.user.role = token.role
            }

            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token

            const userExists = await db.user.findUnique({
                where: { id: token.sub }
            })

            if (!userExists) return token

            token.role = userExists.role

            return token
        }
    },
    ...authConfig,
})