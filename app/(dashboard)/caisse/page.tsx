"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CotisationsList } from "@/components/caisse/cotisations-list"
import { AddCotisationDialog } from "@/components/caisse/add-cotisation-dialog"

export default function CaissePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statutFilter, setStatutFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Caisse</h1>
          <p className="text-muted-foreground">Gestion des cotisations des moniteurs</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Cotisation
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setStatutFilter("all")}>
            Toutes
          </TabsTrigger>
          <TabsTrigger value="Payé" onClick={() => setStatutFilter("Payé")}>
            Payées
          </TabsTrigger>
          <TabsTrigger value="En attente" onClick={() => setStatutFilter("En attente")}>
            En attente
          </TabsTrigger>
          <TabsTrigger value="Retard" onClick={() => setStatutFilter("Retard")}>
            En retard
          </TabsTrigger>
        </TabsList>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un moniteur ou une période..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <TabsContent value="all">
          <CotisationsList searchQuery={searchQuery} statutFilter={statutFilter} />
        </TabsContent>

        <TabsContent value="Payé">
          <CotisationsList searchQuery={searchQuery} statutFilter="Payé" />
        </TabsContent>

        <TabsContent value="En attente">
          <CotisationsList searchQuery={searchQuery} statutFilter="En attente" />
        </TabsContent>

        <TabsContent value="Retard">
          <CotisationsList searchQuery={searchQuery} statutFilter="Retard" />
        </TabsContent>
      </Tabs>

      <AddCotisationDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}
