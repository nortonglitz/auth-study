import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

type UserAddedProps = {
    role?: UserRole
    isTwoFactorEnabled: boolean
}


declare module "next-auth" {
    interface Session {
        user: UserAddedProps & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT extends UserAddedProps { }
}