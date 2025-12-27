"use client"

import { useState, useEffect } from "react"
import { User } from "@/lib/auth"

export function useUser() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Helper to read cookie
        const getCookie = (name: string) => {
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
            if (match) return decodeURIComponent(match[2])
            return null
        }

        const userCookie = getCookie("auth-user")
        if (userCookie) {
            try {
                const userData = JSON.parse(userCookie)
                setUser(userData)
            } catch (e) {
                console.error("Failed to parse auth user cookie", e)
            }
        }
        setLoading(false)
    }, [])

    const can = (permission: string) => {
        if (!user) return false
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return true
        return user.permissions?.includes(permission) || false
    }

    return { user, loading, can }
}
