"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { NotificationBell } from "@/components/notifications/notification-bell"

export function DashboardHeader() {
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
            <AvatarFallback className="bg-white text-blue-600 text-xs font-semibold">A</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Admin</span>
        </div>
      </div>
    </div>
  )
}
