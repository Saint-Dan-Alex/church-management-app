"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CotisationsList } from "@/components/caisse/cotisations-list"
import { AddCotisationDialog } from "@/components/caisse/add-cotisation-dialog"
import { RapportCotisations } from "@/components/caisse/rapport-cotisations"
import { SortiesList } from "@/components/caisse/sorties-list"
import { AddSortieDialog } from "@/components/caisse/add-sortie-dialog"
import { BilanFinancier } from "@/components/caisse/bilan-financier"

export default function CaissePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchQuerySorties, setSearchQuerySorties] = useState("")
  const [statutFilter, setStatutFilter] = useState("all")
  const [categorieFilter, setCategorieFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAddSortieDialogOpen, setIsAddSortieDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("entrees")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Caisse</h1>
          <p className="text-muted-foreground">Gestion des entrées, sorties et bilan financier</p>
        </div>
        {activeTab === "entrees" && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Cotisation
          </Button>
        )}
        {activeTab === "sorties" && (
          <Button onClick={() => setIsAddSortieDialogOpen(true)} variant="destructive">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Sortie
          </Button>
        )}
      </div>

      <Tabs defaultValue="entrees" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="entrees">
            Entrées (Cotisations)
          </TabsTrigger>
          <TabsTrigger value="sorties">
            Sorties (Dépenses)
          </TabsTrigger>
          <TabsTrigger value="bilan">
            Bilan Financier
          </TabsTrigger>
          <TabsTrigger value="rapports">
            Rapports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entrees" className="space-y-4">
          <div className="flex gap-2">
            <Button variant={statutFilter === "all" ? "default" : "outline"} onClick={() => setStatutFilter("all")}>Toutes</Button>
            <Button variant={statutFilter === "Payé" ? "default" : "outline"} onClick={() => setStatutFilter("Payé")}>Payées</Button>
            <Button variant={statutFilter === "En attente" ? "default" : "outline"} onClick={() => setStatutFilter("En attente")}>En attente</Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un moniteur ou une période..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <CotisationsList searchQuery={searchQuery} statutFilter={statutFilter} />
        </TabsContent>

        <TabsContent value="sorties" className="space-y-4">
          <div className="flex gap-2">
            <Button variant={categorieFilter === "all" ? "default" : "outline"} onClick={() => setCategorieFilter("all")}>Toutes</Button>
            <Button variant={categorieFilter === "Matériel" ? "default" : "outline"} onClick={() => setCategorieFilter("Matériel")}>Matériel</Button>
            <Button variant={categorieFilter === "Transport" ? "default" : "outline"} onClick={() => setCategorieFilter("Transport")}>Transport</Button>
            <Button variant={categorieFilter === "Événement" ? "default" : "outline"} onClick={() => setCategorieFilter("Événement")}>Événement</Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher une sortie..."
              value={searchQuerySorties}
              onChange={(e) => setSearchQuerySorties(e.target.value)}
              className="pl-9"
            />
          </div>
          <SortiesList searchQuery={searchQuerySorties} categorieFilter={categorieFilter} />
        </TabsContent>

        <TabsContent value="bilan">
          <BilanFinancier />
        </TabsContent>

        <TabsContent value="rapports">
          <RapportCotisations />
        </TabsContent>
      </Tabs>

      <AddCotisationDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      <AddSortieDialog open={isAddSortieDialogOpen} onOpenChange={setIsAddSortieDialogOpen} />
    </div>
  )
}
