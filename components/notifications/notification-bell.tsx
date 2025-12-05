"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { notificationsService } from "@/lib/services"
import { NotificationsList } from "./notifications-list"

export function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        loadUnreadCount()
        // Rafraîchir toutes les 30 secondes
        const interval = setInterval(loadUnreadCount, 30000)
        return () => clearInterval(interval)
    }, [])

    const loadUnreadCount = async () => {
        try {
            const { count } = await notificationsService.getUnreadCount()
            setUnreadCount(count)
        } catch (error) {
            console.error('Erreur de chargement du compteur:', error)
        }
    }

    const handleNotificationRead = () => {
        loadUnreadCount()
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
                            variant="destructive"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 p-0">
                <NotificationsList
                    onNotificationRead={handleNotificationRead}
                    onClose={() => setIsOpen(false)}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
