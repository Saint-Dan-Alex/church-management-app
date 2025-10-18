"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth"

export function DashboardHeader() {
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-[#2A3BB7] bg-[#3B4FE4]">
      <div>
        <h2 className="text-lg font-semibold text-white">Espace Administration</h2>
        <p className="text-sm text-blue-100">Gestion de l'église</p>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-[#2A3BB7]">
        <LogOut className="h-4 w-4 mr-2" />
        Déconnexion
      </Button>
    </div>
  )
}
