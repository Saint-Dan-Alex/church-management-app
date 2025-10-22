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
import { MoreVertical, Edit, Trash, Calendar, TrendingDown, DollarSign, FileText } from "lucide-react"

// Données mockées
const mockSorties = [
  {
    id: "1",
    libelle: "Achat fournitures scolaires",
    montant: 15000,
    devise: "CDF",
    categorie: "Matériel",
    dateSortie: "2025-01-18",
    beneficiaire: "Fournisseur ABC",
    modePaiement: "Espèces",
    remarque: "Cahiers et stylos pour les enfants",
  },
  {
    id: "2",
    libelle: "Transport moniteurs",
    montant: 8000,
    devise: "CDF",
    categorie: "Transport",
    dateSortie: "2025-01-15",
    beneficiaire: "Plusieurs moniteurs",
    modePaiement: "Mobile Money",
    remarque: "",
  },
  {
    id: "3",
    libelle: "Rafraîchissements culte",
    montant: 12000,
    devise: "CDF",
    categorie: "Événement",
    dateSortie: "2025-01-20",
    beneficiaire: "Boutique du coin",
    modePaiement: "Espèces",
    remarque: "Jus et biscuits",
  },
  {
    id: "4",
    libelle: "Réparation matériel",
    montant: 10000,
    devise: "CDF",
    categorie: "Maintenance",
    dateSortie: "2025-01-10",
    beneficiaire: "Technicien Jean",
    modePaiement: "Virement",
    remarque: "Réparation projecteur",
  },
]

interface SortiesListProps {
  searchQuery: string
  categorieFilter: string
}

export function SortiesList({ searchQuery, categorieFilter }: SortiesListProps) {
  const [selectedSortie, setSelectedSortie] = useState<typeof mockSorties[0] | null>(null)

  const filteredSorties = mockSorties.filter((sortie) => {
    const matchesSearch =
      sortie.libelle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sortie.beneficiaire.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sortie.categorie.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategorie = categorieFilter === "all" || sortie.categorie === categorieFilter

    return matchesSearch && matchesCategorie
  })

  const handleEdit = (sortie: typeof mockSorties[0]) => {
    setSelectedSortie(sortie)
    alert(`✏️ Modification de la sortie\n\nLibellé: ${sortie.libelle}\nMontant: ${sortie.montant} ${sortie.devise}`)
  }

  const handleDelete = (sortie: typeof mockSorties[0]) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer cette sortie "${sortie.libelle}" ?`)) {
      console.log("Sortie supprimée:", sortie.id)
      alert(`🗑️ Sortie supprimée avec succès !`)
    }
  }

  const getCategorieBadge = (categorie: string) => {
    const colors: Record<string, string> = {
      "Matériel": "bg-blue-500",
      "Transport": "bg-green-500",
      "Événement": "bg-purple-500",
      "Maintenance": "bg-orange-500",
      "Autre": "bg-gray-500",
    }
    return <Badge className={colors[categorie] || "bg-gray-500"}>{categorie}</Badge>
  }

  // Calcul du total
  const totalSorties = filteredSorties.reduce((sum, s) => sum + s.montant, 0)

  // Statistiques par catégorie
  const statsParCategorie = filteredSorties.reduce((acc, s) => {
    if (!acc[s.categorie]) {
      acc[s.categorie] = { montant: 0, nombre: 0 }
    }
    acc[s.categorie].montant += s.montant
    acc[s.categorie].nombre++
    return acc
  }, {} as Record<string, { montant: number; nombre: number }>)

  return (
    <div className="space-y-4">
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total des sorties</p>
                <p className="text-2xl font-bold text-red-600">{totalSorties.toLocaleString()} CDF</p>
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
                    {getCategorieBadge(categorie)}
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
                      {getCategorieBadge(sortie.categorie)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(sortie.dateSortie).toLocaleDateString("fr-FR")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-semibold text-red-600">
                          {sortie.montant.toLocaleString()} {sortie.devise}
                        </span>
                      </div>
                      <div>
                        Bénéficiaire: {sortie.beneficiaire}
                      </div>
                      <div>
                        Mode: {sortie.modePaiement}
                      </div>
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
