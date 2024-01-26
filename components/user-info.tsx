import { Session } from "next-auth"
import { Card, CardContent, CardHeader } from "./ui/card"

interface FieldProps {
    label: string
    value?: string | null
}

const Field = ({
    label,
    value
}: FieldProps) => {
    return (
        <div
            className="
                flex 
                flex-row 
                items-center
                justify-between
                rounded-lg
                border
                p-3
                shadow-sm
            "
        >
            <p className="text-sm font-medium">{label}</p>
            <p
                className={`
                    truncate
                    text-xs
                    max-w-[180px]
                    font-mono
                    p-1
                    ${["ON", "OFF"].includes(String(value)) ? "text-primary-foreground" : ""}
                    ${value === 'ON' ? "bg-emerald-500" : value === "OFF" ? "bg-red-500" : "bg-slate-100"}
                    rounded-md
                `}
            >
                {value || "N/A"}
            </p>
        </div>
    )
}

interface UserInfoProps {
    user?: Session["user"]
    label: string
}

export const UserInfo = ({
    user,
    label
}: UserInfoProps) => {
    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader>
                <p className="text-2xl font-semibold text-center mb-5">
                    {label}
                </p>
                <CardContent className="space-y-4">
                    <Field label="ID" value={user?.id} />
                    <Field label="Name" value={user?.name} />
                    <Field label="E-mail" value={user?.email} />
                    <Field label="Role" value={user?.role} />
                    <Field label="2FA" value={user?.isTwoFactorEnabled ? "ON" : "OFF"} />
                </CardContent>
            </CardHeader>
        </Card>
    )
}
