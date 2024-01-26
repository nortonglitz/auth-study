"use client"

import { admin } from "@/actions/admin"
import { RoleGate } from "@/components/auth/role-gate"
import { FormFeedback } from "@/components/form-feedback"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"

const AdminPage = () => {

    const onServerActionClick = async () => {
        const { type, message } = await admin()

        if (type === "error") {
            toast.error(message)
        } else {
            toast.success(message)
        }

    }

    const onApiRouteClick = async () => {
        const res = await fetch("/api/admin")
        if (res.ok) {
            toast.success("Allowed API Route.")
        } else {
            toast.error("Forbidden API Route.")
        }

    }

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p>🔑 Admin</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRoles={[UserRole.ADMIN]}>
                    <FormFeedback
                        feedback={{
                            type: "success",
                            message: "You are allowed to see this content."
                        }}
                    />
                </RoleGate>
                <div
                    className="
                        flex
                        flex-row
                        items-center
                        justify-between
                        rounded-lg
                        border
                        p-3
                        shadow-md
                    "
                >
                    <p>Admin-only API Route</p>
                    <Button onClick={onApiRouteClick}>
                        Click to test
                    </Button>
                </div>
                <div
                    className="
                        flex
                        flex-row
                        items-center
                        justify-between
                        rounded-lg
                        border
                        p-3
                        shadow-md
                    "
                >
                    <p>Admin-only Server Action</p>
                    <Button onClick={onServerActionClick}>
                        Click to test
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default AdminPage
