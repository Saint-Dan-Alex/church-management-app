"use client"
import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  Users,
  Baby,
  Church,
  Building2,
  Calendar,
  FileText,
  Video,
  ImageIcon,
  BookOpen,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  Wallet,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUser } from "@/hooks/use-user"

type MenuItem = {
  title: string
  url: string
  icon: any
  permission?: string
}

const menuItems: MenuItem[] = [
  {
    title: "Tableau de Bord",
    url: "/dashboard",
    icon: LayoutDashboard,
    permission: "dashboard.view",
  },
  {
    title: "Moniteurs",
    url: "/monitors",
    icon: Users,
    permission: "moniteurs.read",
  },
  {
    title: "Enfants",
    url: "/children",
    icon: Baby,
    permission: "enfants.read",
  },
  {
    title: "Cultes",
    url: "/worship",
    icon: Church,
    permission: "presences.read", // Assuming Cultes relates to attendance/presences
  },
  {
    title: "Salles",
    url: "/salles",
    icon: Building2,
    permission: "salles.read",
  },
  {
    title: "Activités",
    url: "/activities",
    icon: Calendar,
    permission: "activites.read",
  },
  {
    title: "Enseignements",
    url: "/teachings",
    icon: BookOpen,
    permission: "blog.read", // Using blog permission for teachings as fallback
  },
  {
    title: "Blog",
    url: "/blog",
    icon: FileText,
    permission: "blog.read",
  },
  {
    title: "Vidéothèque",
    url: "/videos",
    icon: Video,
    permission: "videos.read",
  },
  {
    title: "Photothèque",
    url: "/photos",
    icon: ImageIcon,
    permission: "photos.read",
  },
  {
    title: "Caisse",
    url: "/caisse",
    icon: Wallet,
    permission: "caisse.read",
  },
  {
    title: "Utilisateurs",
    url: "/users",
    icon: Shield,
    permission: "users.read",
  },
  {
    title: "Paramètres",
    url: "/settings",
    icon: Settings,
    permission: "roles.manage",
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, can } = useUser()

  const displayName = user?.name || 'Utilisateur'
  const displayEmail = user?.email || ''
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A'

  const filteredMenuItems = menuItems.filter(item => {
    // Items without permission are visible to everyone
    if (!item.permission) return true
    return can(item.permission)
  })

  return (
    <Sidebar className="bg-blue-600 border-r border-blue-500 print:hidden">
      <SidebarHeader className="border-b border-blue-500 bg-blue-600">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-600">
            <Church className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white">Pro</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-blue-600">
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-200 uppercase text-[11px] font-semibold tracking-wider px-3">MENU</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={pathname === item.url ? "bg-blue-700 text-white font-medium" : "text-white hover:bg-blue-700"}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-blue-500 bg-blue-600">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full text-white hover:bg-blue-700">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-white text-blue-600 text-xs font-semibold">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium text-white">{displayName}</span>
                    <span className="text-xs text-blue-200">{displayEmail}</span>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer w-full flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>

                  <div className="flex w-full items-center" onClick={async () => {
                    const { logout } = await import("@/lib/auth")
                    await logout()
                    window.location.href = "/login"
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
