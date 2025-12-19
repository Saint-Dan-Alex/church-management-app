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
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          aside, nav, header, .sidebar-trigger { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: none !important; }
          .print\\:hidden { display: none !important; }
          body { background: white !important; }
        }
      `}} />
      <div className="print:hidden">
        <AppSidebar />
      </div>
      <SidebarInset className="print:m-0 print:p-0 print:w-full print:block">
        <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden print:bg-white print:h-auto print:overflow-visible">
          <DashboardHeader />
          <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-hidden print:p-0 print:overflow-visible">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
