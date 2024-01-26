"use client"

import { useCurrentUser } from "@/hooks/useCurrentUser"
import { UserRole } from "@prisma/client"
import { FormFeedback } from "../form-feedback"

interface RoleGateProps {
    children: React.ReactNode
    allowedRoles: UserRole[]
}

export const RoleGate = ({
    allowedRoles,
    children
}: RoleGateProps) => {

    const user = useCurrentUser()

    if (!user || !user.role || !allowedRoles.includes(user.role)) {
        return (
            <FormFeedback
                feedback={{
                    message: "You are not allowed to see this content.",
                    type: "error"
                }}
            />
        )
    }

    return children
}