"use server"

import { currentUser } from "@/lib/auth"
import { UserRole } from "@prisma/client"

export const admin = async () => {
    const user = await currentUser()

    if (!(user?.role === UserRole.ADMIN)) {
        return {
            type: "error",
            message: "Forbidden Server Action."
        }
    }

    return {
        type: "success",
        message: "Allowed Server Action."
    }
}