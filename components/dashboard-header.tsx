"use client"

import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-red-500 text-white text-[10px] rounded-full">
            1
          </Badge>
        </Button>
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
