"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, FileText, BarChart3 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { WorshipReportList } from "@/components/worship/worship-report-list"
import { AddWorshipReportDialog } from "@/components/worship/add-worship-report-dialog"

export default function WorshipPage() {
  const router = useRouter()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  const handleReportAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-900">Rapports de Culte</h1>
          <p className="text-gray-600">Gestion des rapports dominicaux par salle</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Rapport
        </Button>
      </div>

      {/* Statistiques rapides et navigation vers rapports */}
      <div className="grid gap-4 md:grid-cols-2">
        <Button
          variant="outline"
          className="h-24 flex-col gap-2"
          onClick={() => router.push("/worship/reports/global")}
        >
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <div className="text-center">
            <div className="font-semibold">Rapport Global</div>
            <div className="text-xs text-gray-500">Statistiques toutes salles confondues</div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-24 flex-col gap-2"
          onClick={() => router.push("/worship/reports/by-room")}
        >
          <FileText className="h-6 w-6 text-green-600" />
          <div className="text-center">
            <div className="font-semibold">Rapports par Salle</div>
            <div className="text-xs text-gray-500">Statistiques détaillées par salle</div>
          </div>
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Rechercher par salle, date..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Liste des rapports */}
      <WorshipReportList key={refreshKey} searchQuery={searchQuery} />

      <AddWorshipReportDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleReportAdded}
      />
    </div>
  )
}
