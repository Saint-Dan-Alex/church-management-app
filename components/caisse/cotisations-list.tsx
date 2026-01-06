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
import { MoreVertical, Edit, Trash, Calendar, User, DollarSign, Tag } from "lucide-react"
import { EditCotisationDialog } from "./edit-cotisation-dialog"
import { cotisationsService, type Cotisation } from "@/lib/services/cotisations.service"
import { toast } from "sonner"
import { useUser } from "@/hooks/use-user"

interface CotisationsListProps {
  searchQuery?: string
  statutFilter?: string
  refreshKey?: number
}

export function CotisationsList({ searchQuery = "", statutFilter = "all", refreshKey }: CotisationsListProps) {
  const { can } = useUser()
  const [cotisations, setCotisations] = useState<Cotisation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCotisation, setSelectedCotisation] = useState<Cotisation | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [internalRefreshKey, setInternalRefreshKey] = useState(0)

  useEffect(() => {
    const fetchCotisations = async () => {
      try {
        setLoading(true)
        // On récupère tout et on filtre côté client pour l'instant
        const response: any = await cotisationsService.getAll()
        const data = response.data || response
        setCotisations(Array.isArray(data) ? data : [])
      } catch (err) {
        setError("Erreur lors du chargement des cotisations")
        console.error("Erreur:", err)
        setCotisations([])
      } finally {
        setLoading(false)
      }
    }

    fetchCotisations()
  }, [refreshKey, internalRefreshKey])

  const reloadCotisations = () => {
    setInternalRefreshKey(prev => prev + 1)
  }

  const filteredCotisations = Array.isArray(cotisations) ? cotisations.filter((cotisation) => {
    const matchesSearch =
      (cotisation.membre_nom || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cotisation.mois || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cotisation.type?.name || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatut = statutFilter === "all" ||
      (statutFilter === "Payé" && (cotisation.statut === "Payé" || cotisation.statut === "Paid" || !cotisation.statut)) || // Assume paid if no status? Or check specific logic
      (statutFilter === "En attente" && (cotisation.statut === "En attente" || cotisation.statut === "Pending"))

    return matchesSearch && matchesStatut
  }) : []

  const handleEdit = (cotisation: Cotisation) => {
    setSelectedCotisation(cotisation)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (cotisation: Cotisation) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la cotisation de "${cotisation.membre_nom}" ?`)) {
      try {
        await cotisationsService.delete(cotisation.id)
        setCotisations(prev => prev.filter(c => c.id !== cotisation.id))
        toast.success(`Cotisation supprimée avec succès`)
      } catch (err) {
        toast.error("Erreur lors de la suppression")
        console.error("Erreur:", err)
      }
    }
  }

  if (loading) {
    return (
      <div className="col-span-full text-center py-12">
        <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-3 animate-pulse" />
        <p className="text-gray-500">Chargement des cotisations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="col-span-full text-center py-12">
        <DollarSign className="h-12 w-12 mx-auto text-red-400 mb-3" />
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  // Calcul des totaux par devise
  const totalCDF = filteredCotisations
    .filter((c) => c.devise === "CDF")
    .reduce((sum, c) => sum + Number(c.montant), 0)

  const totalUSD = filteredCotisations
    .filter((c) => c.devise === "USD")
    .reduce((sum, c) => sum + Number(c.montant), 0)

  return (
    <div className="space-y-4">
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total CDF</p>
                <p className="text-2xl font-bold text-green-600">{totalCDF.toLocaleString()} CDF</p>
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
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nombre de cotisations</p>
                <p className="text-2xl font-bold">{filteredCotisations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des cotisations */}
      <div className="space-y-3">
        {filteredCotisations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">Aucune cotisation trouvée</p>
            </CardContent>
          </Card>
        ) : (
          filteredCotisations.map((cotisation) => (
            <Card key={cotisation.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold">{cotisation.membre_nom}</span>
                      <Badge variant="outline">
                        {cotisation.type?.name || 'Non défini'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{cotisation.mois} {cotisation.annee}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-semibold">
                          {Number(cotisation.montant).toLocaleString()} {cotisation.devise}
                        </span>
                      </div>
                      {cotisation.date_cotisation && (
                        <div>
                          Date: {new Date(cotisation.date_cotisation).toLocaleDateString("fr-FR")}
                        </div>
                      )}
                      {cotisation.mode_paiement && (
                        <div>Mode: {cotisation.mode_paiement}</div>
                      )}
                    </div>

                    {cotisation.remarque && (
                      <p className="text-xs text-gray-500">Remarque: {cotisation.remarque}</p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {can("paiements.update") && (
                        <DropdownMenuItem onClick={() => handleEdit(cotisation)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                      )}
                      {can("paiements.delete") && (
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(cotisation)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <EditCotisationDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        cotisation={selectedCotisation}
        onSuccess={reloadCotisations}
      />
    </div>
  )
}
