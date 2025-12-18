"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Download, Filter } from "lucide-react"
import { ChildrenList } from "@/components/children/children-list"
import { AddChildDialog } from "@/components/children/add-child-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChildrenStats } from "@/components/children/children-stats"

export default function ChildrenPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedChild, setSelectedChild] = useState<string | null>(null)

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Chargement...</div>}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Enfants</h1>
            <p className="text-muted-foreground">Gestion des enfants et fiches d'information</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un Enfant
            </Button>
          </div>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Liste des Enfants</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un enfant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <ChildrenList searchQuery={searchQuery} onSelectChild={setSelectedChild} />
          </TabsContent>

          <TabsContent value="stats">
            <ChildrenStats />
          </TabsContent>
        </Tabs>

        <AddChildDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      </div>
    </Suspense>
  )
}
