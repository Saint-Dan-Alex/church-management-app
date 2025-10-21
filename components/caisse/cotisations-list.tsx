"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash, Calendar, User, DollarSign, Check, X } from "lucide-react"
import { EditCotisationDialog } from "./edit-cotisation-dialog"

// Données mockées
const mockCotisations = [
  {
    id: "1",
    moniteur: "Sophie KAMANDA",
    montant: 5000,
    devise: "CDF",
    periode: "Janvier 2025",
    datePaiement: "2025-01-15",
    statut: "Payé",
    modePaiement: "Mobile Money",
    remarque: "",
  },
  {
    id: "2",
    moniteur: "Jacques MUKENDI",
    montant: 5000,
    devise: "CDF",
    periode: "Janvier 2025",
    datePaiement: "2025-01-10",
    statut: "Payé",
    modePaiement: "Espèces",
    remarque: "",
  },
  {
    id: "3",
    moniteur: "Sophie KAMANDA",
    montant: 5000,
    devise: "CDF",
    periode: "Décembre 2024",
    datePaiement: null,
    statut: "En attente",
    modePaiement: "",
    remarque: "",
  },
  {
    id: "4",
    moniteur: "Paul NGEA",
    montant: 5000,
    devise: "CDF",
    periode: "Janvier 2025",
    datePaiement: "2025-01-20",
    statut: "Payé",
    modePaiement: "Virement",
    remarque: "Paiement confirmé",
  },
]

interface CotisationsListProps {
  searchQuery: string
  statutFilter: string
}

export function CotisationsList({ searchQuery, statutFilter }: CotisationsListProps) {
  const [selectedCotisation, setSelectedCotisation] = useState<typeof mockCotisations[0] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const filteredCotisations = mockCotisations.filter((cotisation) => {
    const matchesSearch =
      cotisation.moniteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cotisation.periode.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatut = statutFilter === "all" || cotisation.statut === statutFilter

    return matchesSearch && matchesStatut
  })

  const handleEdit = (cotisation: typeof mockCotisations[0]) => {
    setSelectedCotisation(cotisation)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (cotisation: typeof mockCotisations[0]) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer cette cotisation de ${cotisation.moniteur} ?`)) {
      console.log("Cotisation supprimée:", cotisation.id)
      alert(`🗑️ Cotisation supprimée avec succès !`)
    }
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "Payé":
        return <Badge className="bg-green-500">Payé</Badge>
      case "En attente":
        return <Badge variant="secondary">En attente</Badge>
      case "Retard":
        return <Badge variant="destructive">En retard</Badge>
      default:
        return <Badge variant="outline">{statut}</Badge>
    }
  }

  // Calcul du total
  const totalPaye = filteredCotisations
    .filter((c) => c.statut === "Payé")
    .reduce((sum, c) => sum + c.montant, 0)

  const totalEnAttente = filteredCotisations
    .filter((c) => c.statut === "En attente")
    .reduce((sum, c) => sum + c.montant, 0)

  return (
    <div className="space-y-4">
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cotisations payées</p>
                <p className="text-2xl font-bold text-green-600">{totalPaye.toLocaleString()} CDF</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <X className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-orange-600">{totalEnAttente.toLocaleString()} CDF</p>
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
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{(totalPaye + totalEnAttente).toLocaleString()} CDF</p>
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
                      <span className="font-semibold">{cotisation.moniteur}</span>
                      {getStatutBadge(cotisation.statut)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Période: {cotisation.periode}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-semibold">
                          {cotisation.montant.toLocaleString()} {cotisation.devise}
                        </span>
                      </div>
                      {cotisation.datePaiement && (
                        <div>
                          Payé le:{" "}
                          {new Date(cotisation.datePaiement).toLocaleDateString("fr-FR")}
                        </div>
                      )}
                      {cotisation.modePaiement && (
                        <div>Mode: {cotisation.modePaiement}</div>
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
                      <DropdownMenuItem onClick={() => handleEdit(cotisation)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(cotisation)}
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

      <EditCotisationDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        cotisation={selectedCotisation}
      />
    </div>
  )
}
