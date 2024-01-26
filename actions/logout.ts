"use server"

import { signOut } from "@/auth"

export const logout = async () => {
    // Do somo server stuff
    await signOut()
}