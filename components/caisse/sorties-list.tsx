"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash, Calendar, TrendingDown, DollarSign, FileText, Loader2 } from "lucide-react"
import { sortiesService, type Sortie } from "@/lib/services/sorties.service"
import { useToast } from "@/hooks/use-toast"

interface SortiesListProps {
  searchQuery: string
  categorieFilter: string
  refreshKey?: number
}

export function SortiesList({ searchQuery, categorieFilter, refreshKey }: SortiesListProps) {
  const { toast } = useToast()
  const [sorties, setSorties] = useState<Sortie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [internalRefreshKey, setInternalRefreshKey] = useState(0)

  useEffect(() => {
    loadSorties()
  }, [categorieFilter, refreshKey, internalRefreshKey])

  const loadSorties = async () => {
    try {
      setLoading(true)
      setError(null)
      const response: any = await sortiesService.getAll({
        categorie: categorieFilter !== "all" ? categorieFilter : undefined
      })
      const data = response.data || response
      setSorties(Array.isArray(data) ? data : [])
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur de chargement des sorties'
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredSorties = sorties.filter((sortie) => {
    const matchesSearch =
      (sortie.libelle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sortie.beneficiaire || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sortie.category?.name || "").toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const handleEdit = (sortie: Sortie) => {
    toast({
      title: "Modifier la sortie",
      description: `${sortie.libelle} - ${sortie.montant} ${sortie.devise}`,
    })
  }

  const handleDelete = async (sortie: Sortie) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer cette sortie "${sortie.libelle}" ?`)) {
      try {
        await sortiesService.delete(sortie.id)
        toast({
          title: "Sortie supprimée",
          description: "La sortie a été supprimée avec succès.",
        })
        loadSorties()
      } catch (err: any) {
        toast({
          title: "Erreur",
          description: err.message || "Impossible de supprimer la sortie",
          variant: "destructive"
        })
      }
    }
  }

  // Calcul des totaux par devise
  const totalCDF = filteredSorties
    .filter((s) => s.devise === "CDF")
    .reduce((sum, s) => sum + Number(s.montant), 0)

  const totalUSD = filteredSorties
    .filter((s) => s.devise === "USD")
    .reduce((sum, s) => sum + Number(s.montant), 0)

  // Statistiques par catégorie
  const statsParCategorie = filteredSorties.reduce((acc, s) => {
    const catName = s.category?.name || 'Non catégorisé'
    if (!acc[catName]) {
      acc[catName] = { montant: 0, nombre: 0 }
    }
    acc[catName].montant += Number(s.montant) || 0
    acc[catName].nombre++
    return acc
  }, {} as Record<string, { montant: number; nombre: number }>)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Chargement des sorties...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadSorties} variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total CDF</p>
                <p className="text-2xl font-bold text-red-600">{totalCDF.toLocaleString()} CDF</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total USD</p>
                <p className="text-2xl font-bold text-blue-600">{totalUSD.toLocaleString()} USD</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nombre de sorties</p>
                <p className="text-2xl font-bold text-purple-600">{filteredSorties.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques par catégorie */}
      {Object.keys(statsParCategorie).length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Répartition par catégorie</h3>
            <div className="grid gap-2 md:grid-cols-2">
              {Object.entries(statsParCategorie).map(([categorie, stats]) => (
                <div key={categorie} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{categorie}</Badge>
                    <span className="text-sm text-gray-600">({stats.nombre})</span>
                  </div>
                  <span className="font-semibold">{stats.montant.toLocaleString()} CDF</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des sorties */}
      <div className="space-y-3">
        {filteredSorties.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">Aucune sortie trouvée</p>
            </CardContent>
          </Card>
        ) : (
          filteredSorties.map((sortie) => (
            <Card key={sortie.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="font-semibold">{sortie.libelle}</span>
                      <Badge variant="outline">
                        {sortie.category?.name || 'Non catégorisé'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {sortie.date_sortie
                            ? new Date(sortie.date_sortie).toLocaleDateString("fr-FR")
                            : '-'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-semibold text-red-600">
                          {Number(sortie.montant).toLocaleString()} {sortie.devise}
                        </span>
                      </div>
                      {sortie.beneficiaire && (
                        <div>Bénéficiaire: {sortie.beneficiaire}</div>
                      )}
                      {sortie.reference && (
                        <div>Réf: {sortie.reference}</div>
                      )}
                    </div>

                    {sortie.remarque && (
                      <p className="text-xs text-gray-500">Remarque: {sortie.remarque}</p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(sortie)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(sortie)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
