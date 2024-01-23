import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";


declare module "next-auth" {
    interface Session {
        user: {
            role?: UserRole
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: UserRole
    }
}