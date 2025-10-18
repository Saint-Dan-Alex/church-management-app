"use client"
import {
  LayoutDashboard,
  Users,
  Baby,
  Church,
  Calendar,
  FileText,
  Video,
  ImageIcon,
  Settings,
  LogOut,
  ChevronDown,
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

const menuItems = [
  {
    title: "Tableau de Bord",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Moniteurs",
    url: "/monitors",
    icon: Users,
  },
  {
    title: "Enfants",
    url: "/children",
    icon: Baby,
  },
  {
    title: "Cultes",
    url: "/worship",
    icon: Church,
  },
  {
    title: "Activités",
    url: "/activities",
    icon: Calendar,
  },
  {
    title: "Blog",
    url: "/blog",
    icon: FileText,
  },
  {
    title: "Vidéothèque",
    url: "/videos",
    icon: Video,
  },
  {
    title: "Photothèque",
    url: "/photos",
    icon: ImageIcon,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="bg-[#3B4FE4] border-r border-[#2A3BB7]">
      <SidebarHeader className="border-b border-[#2A3BB7] bg-[#3B4FE4]">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#3B4FE4]">
            <Church className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Gestion Église</span>
            <span className="text-xs text-blue-100">Gloire à Dieu</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-100">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={pathname === item.url ? "bg-white text-[#3B4FE4]" : "text-white hover:bg-[#2A3BB7]"}
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
      <SidebarFooter className="border-t border-[#2A3BB7] bg-[#3B4FE4]">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full text-white hover:bg-[#2A3BB7]">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-white text-[#3B4FE4] text-xs">AD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium text-white">Admin</span>
                    <span className="text-xs text-blue-100">admin@eglise.com</span>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
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
