"use client"

import { ReactNode } from "react"
import { useUser } from "@/hooks/use-user"

interface PermissionGuardProps {
    children: ReactNode
    permission: string
    fallback?: ReactNode
}

export function PermissionGuard({ children, permission, fallback = null }: PermissionGuardProps) {
    const { can, LOADING } = useUser() as any // type casting for now or update hook

    // While loading, we might want to hide or show nothing. 
    // Ideally useUser should return loading status.

    if (can && !can(permission)) {
        return <>{fallback}</>
    }

    // If loading or can is not ready, we generally wait or just show if not strict?
    // UseUser returns loading.

    return <>{children}</>
}
