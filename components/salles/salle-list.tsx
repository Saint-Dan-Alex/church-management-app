"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash, Eye, Users, Crown, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditSalleDialog } from "./edit-salle-dialog"
import { sallesService, type Salle } from "@/lib/services/salles.service"
import { toast } from "sonner"

interface SalleListProps {
  searchQuery?: string
  refreshTrigger?: number
}

export function SalleList({ searchQuery = "", refreshTrigger = 0 }: SalleListProps) {
  const router = useRouter()
  const [salles, setSalles] = useState<Salle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSalles = async () => {
      try {
        setLoading(true)
        const response: any = await sallesService.getAll()
        console.log("Salles API Response:", response);

        let data = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response && Array.isArray(response.data)) {
          // Cas de la pagination Laravel (objet avec propriété data)
          data = response.data;
        } else if (response && response.data && Array.isArray(response.data.data)) {
          // Cas où axios enveloppe déjà dans data, et Laravel renvoie aussi une propriété data
          data = response.data.data;
        }

        console.log("Processed Salles Data:", data);
        setSalles(data)
      } catch (err) {
        setError("Erreur lors du chargement des salles")
        console.error("Erreur:", err)
        setSalles([])
      } finally {
        setLoading(false)
      }
    }

    fetchSalles()
  }, [refreshTrigger])

  const filteredSalles = Array.isArray(salles) ? salles.filter((salle) => {
    const matchesSearch =
      salle.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salle.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salle.responsable_nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salle.adjoint_nom?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  }) : []

  /* State for editing dialog */
  const [selectedSalle, setSelectedSalle] = useState<Salle | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleView = (salle: Salle) => {
    router.push(`/salles/${salle.id}`)
  }

  const handleEdit = (salle: Salle) => {
    setSelectedSalle(salle)
    setIsEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    // Optionally refresh the list or update local state
    // For simplicity, we can reload or let the parent/swr handle it.
    // Here we'll just trigger a reload of the component's data logic if we were using a refetchable hook
    // But since we use simple useEffect, we can just reload the page or re-fetch.
    // A clean way is to re-call fetchSalles. Since fetchSalles is inside useEffect, we can separate it.
    window.location.reload() // Simple but effective for now, or implement a refresh callback prop
  }

  const handleDelete = async (salle: Salle) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${salle.nom}" ?`)) {
      try {
        await sallesService.delete(salle.id)
        setSalles(salles.filter(s => s.id !== salle.id))
        toast.success(`Salle "${salle.nom}" supprimée avec succès`)
      } catch (err) {
        toast.error("Erreur lors de la suppression")
        console.error("Erreur:", err)
      }
    }
  }

  if (loading) {
    return (
      <div className="col-span-full text-center py-12">
        <Users className="h-12 w-12 mx-auto text-gray-400 mb-3 animate-pulse" />
        <p className="text-gray-500">Chargement des salles...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="col-span-full text-center py-12">
        <Users className="h-12 w-12 mx-auto text-red-400 mb-3" />
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredSalles.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">Aucune salle trouvée</p>
        </div>
      ) : (
        filteredSalles.map((salle) => (
          <Card key={salle.id} className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{salle.nom}</h3>
                  <p className="text-sm text-gray-600 mb-3">{salle.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      Capacité: {salle.capacite} personnes
                    </Badge>
                    <Badge
                      className={`text-xs ${salle.actif ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                      {salle.actif ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(salle)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(salle)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(salle)}
                      className="text-red-600"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {(salle.responsable_nom || salle.adjoint_nom) && (
                <div className="border-t pt-3">
                  <div className="text-xs text-gray-500 mb-2">Responsables:</div>
                  <div className="space-y-1">
                    {salle.responsable_nom && (
                      <div className="flex items-center gap-2 text-xs">
                        <Crown className="h-3 w-3 text-yellow-500" />
                        <span>{salle.responsable_nom}</span>
                        <Badge variant="outline" className="text-xs">Responsable</Badge>
                      </div>
                    )}
                    {salle.adjoint_nom && (
                      <div className="flex items-center gap-2 text-xs">
                        <Shield className="h-3 w-3 text-blue-500" />
                        <span>{salle.adjoint_nom}</span>
                        <Badge variant="outline" className="text-xs">Adjoint</Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {salle.moniteurs && salle.moniteurs.length > 0 && (
                <div className="border-t pt-3 mt-3">
                  <div className="text-xs text-gray-500 mb-2">
                    Moniteurs ({salle.moniteurs.length}):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {salle.moniteurs.slice(0, 3).map((moniteur: any) => (
                      <Badge key={moniteur.id} variant="outline" className="text-xs">
                        {moniteur.nomComplet || moniteur.prenom}
                      </Badge>
                    ))}
                    {salle.moniteurs.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{salle.moniteurs.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))
      )}

      {selectedSalle && (
        <EditSalleDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          salle={selectedSalle}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}
