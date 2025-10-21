"use client"
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
    title: "Salles",
    url: "/salles",
    icon: Building2,
  },
  {
    title: "Activités",
    url: "/activities",
    icon: Calendar,
  },
  {
    title: "Enseignements",
    url: "/teachings",
    icon: BookOpen,
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
  {
    title: "Utilisateurs",
    url: "/users",
    icon: Shield,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="bg-blue-600 border-r border-blue-500">
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
              {menuItems.map((item) => (
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
                    <AvatarFallback className="bg-white text-blue-600 text-xs font-semibold">N</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium text-white">Admin</span>
                    <span className="text-xs text-blue-200">admin@eglise.com</span>
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
