"use client"

import { useCurrentUser } from "@/hooks/useCurrentUser"

const SettingsPage = () => {

    const user = useCurrentUser()

    return (
        <div className="bg-white p-10 rounded-xl">
            {JSON.stringify(user)}
        </div>
    )
}

export default SettingsPage