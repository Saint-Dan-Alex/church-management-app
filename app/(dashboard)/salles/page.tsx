"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SalleList } from "@/components/salles/salle-list"
import { AddSalleDialog } from "@/components/salles/add-salle-dialog"
import { PermissionGuard } from "@/components/auth/permission-guard"

export default function SallesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-900">Salles</h1>
          <p className="text-gray-600">Gestion des salles et affectation des moniteurs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <PermissionGuard permission="salles.create">
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Salle
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Rechercher une salle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Liste des salles */}
      <SalleList searchQuery={searchQuery} refreshTrigger={refreshTrigger} />

      <AddSalleDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => setRefreshTrigger(prev => prev + 1)}
      />
    </div>
  )
}
