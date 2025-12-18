"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Download } from "lucide-react"
import { AddTeachingDialog } from "@/components/teachings/add-teaching-dialog"
import { TeachingList } from "@/components/teachings/teaching-list"

export default function TeachingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Fonction appelée après création réussie d'un enseignement
  const handleTeachingCreated = () => {
    setRefreshKey(prev => prev + 1) // Incrémente pour forcer le rechargement de TeachingList
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header responsive */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Enseignements</h1>
          <p className="text-sm sm:text-base text-gray-600">Gestion des enseignements et leçons</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
            <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Exporter</span>
            <span className="xs:hidden">Export</span>
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
            <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Nouvel Enseignement</span>
            <span className="sm:hidden">Nouveau</span>
          </Button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un enseignement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      <TeachingList searchQuery={searchQuery} refreshKey={refreshKey} />
      <AddTeachingDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleTeachingCreated}
      />
    </div>
  )
}
