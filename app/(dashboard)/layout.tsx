import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
          <DashboardHeader />
          <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-hidden">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
