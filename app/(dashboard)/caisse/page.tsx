"use client"

import { useState, useEffect } from "react"
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
import { sortiesService, type SortieCategory } from "@/lib/services/sorties.service"

export default function CaissePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchQuerySorties, setSearchQuerySorties] = useState("")
  const [statutFilter, setStatutFilter] = useState("all")
  const [categorieFilter, setCategorieFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAddSortieDialogOpen, setIsAddSortieDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("entrees")
  const [refreshKey, setRefreshKey] = useState(0)
  const [categories, setCategories] = useState<SortieCategory[]>([])

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await sortiesService.getCategories()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erreur chargement catégories:", error)
    }
  }

  const refreshCotisations = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Caisse</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Gestion des entrées, sorties et bilan financier</p>
        </div>
        {activeTab === "entrees" && (
          <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto text-xs sm:text-sm">
            <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Nouvelle Cotisation</span>
            <span className="sm:hidden">Ajouter Cotisation</span>
          </Button>
        )}
        {activeTab === "sorties" && (
          <Button onClick={() => setIsAddSortieDialogOpen(true)} variant="destructive" className="w-full sm:w-auto text-xs sm:text-sm">
            <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Nouvelle Sortie</span>
            <span className="sm:hidden">Ajouter Sortie</span>
          </Button>
        )}
      </div>

      <Tabs defaultValue="entrees" className="space-y-4" onValueChange={setActiveTab}>
        <div className="overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide print:hidden">
          <TabsList className="inline-flex min-w-max">
            <TabsTrigger value="entrees" className="text-xs sm:text-sm px-2 sm:px-3">
              Entrées (Cotisations)
            </TabsTrigger>
            <TabsTrigger value="sorties" className="text-xs sm:text-sm px-2 sm:px-3">
              Sorties (Dépenses)
            </TabsTrigger>
            <TabsTrigger value="bilan" className="text-xs sm:text-sm px-2 sm:px-3">
              Bilan Financier
            </TabsTrigger>
            <TabsTrigger value="rapports" className="text-xs sm:text-sm px-2 sm:px-3">
              Rapports
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="entrees" className="space-y-4">
          <div className="overflow-x-auto pb-2 -mx-1 px-1">
            <div className="flex gap-2 min-w-max">
              <Button size="sm" variant={statutFilter === "all" ? "default" : "outline"} onClick={() => setStatutFilter("all")}>Toutes</Button>
              <Button size="sm" variant={statutFilter === "Payé" ? "default" : "outline"} onClick={() => setStatutFilter("Payé")}>Payées</Button>
              <Button size="sm" variant={statutFilter === "En attente" ? "default" : "outline"} onClick={() => setStatutFilter("En attente")}>En attente</Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un moniteur ou une période..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          <CotisationsList searchQuery={searchQuery} statutFilter={statutFilter} refreshKey={refreshKey} />
        </TabsContent>

        <TabsContent value="sorties" className="space-y-4">
          <div className="overflow-x-auto pb-2 -mx-1 px-1">
            <div className="flex gap-2 min-w-max">
              <Button
                size="sm"
                variant={categorieFilter === "all" ? "default" : "outline"}
                onClick={() => setCategorieFilter("all")}
              >
                Toutes
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  size="sm"
                  variant={categorieFilter === category.id ? "default" : "outline"}
                  onClick={() => setCategorieFilter(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher une sortie..."
              value={searchQuerySorties}
              onChange={(e) => setSearchQuerySorties(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          <SortiesList searchQuery={searchQuerySorties} categorieFilter={categorieFilter} refreshKey={refreshKey} />
        </TabsContent>

        <TabsContent value="bilan">
          <BilanFinancier />
        </TabsContent>

        <TabsContent value="rapports">
          <RapportCotisations />
        </TabsContent>
      </Tabs>

      <AddCotisationDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSuccess={refreshCotisations} />
      <AddSortieDialog open={isAddSortieDialogOpen} onOpenChange={setIsAddSortieDialogOpen} onSuccess={refreshCotisations} />
    </div>
  )
}
