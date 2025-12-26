"use client"

import { useState, useEffect } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { NotificationBell } from "@/components/notifications/notification-bell"

export function DashboardHeader() {
  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)

    if (cookies['auth-user']) {
      try {
        const userData = JSON.parse(decodeURIComponent(cookies['auth-user']))
        setUser({ name: userData.name || 'Utilisateur' })
      } catch (e) {
        console.error('Error parsing auth-user cookie', e)
      }
    }
  }, [])

  const displayName = user?.name || 'Admin'
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A'

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white shadow-sm print:hidden">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Tableau de bord</h1>
      </div>
      <div className="flex items-center gap-3">
        {/* Notifications Bell avec compteur en temps réel */}
        <NotificationBell />

        <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-full">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-white text-blue-600 text-xs font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{displayName}</span>
        </div>
      </div>
    </div>
  )
}
