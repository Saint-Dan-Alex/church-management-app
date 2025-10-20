"use client"

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
import type { Salle } from "@/types/salle"

// Données mockées
const mockSalles: Salle[] = [
  {
    id: "1",
    nom: "Adolescents",
    description: "Salle pour les adolescents de 13 à 17 ans",
    capacite: 80,
    responsableId: "1",
    responsableNom: "Marie LENGE",
    adjointId: "2",
    adjointNom: "Paul NGEA",
    moniteurs: [
      {
        id: "1",
        nom: "LENGE",
        prenom: "Marie",
        nomComplet: "Marie LENGE",
        role: "responsable",
        dateAffectation: new Date("2023-01-15"),
      },
      {
        id: "2",
        nom: "NGEA",
        prenom: "Paul",
        nomComplet: "Paul NGEA",
        role: "adjoint",
        dateAffectation: new Date("2023-01-15"),
      },
      {
        id: "3",
        nom: "NFEO",
        prenom: "Jean",
        nomComplet: "Jean NFEO",
        role: "membre",
        dateAffectation: new Date("2023-03-20"),
      },
    ],
    actif: true,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-10-20"),
  },
  {
    id: "2",
    nom: "Juniors",
    description: "Salle pour les juniors de 9 à 12 ans",
    capacite: 60,
    responsableId: "4",
    responsableNom: "Sarah JEMMA",
    adjointId: "5",
    adjointNom: "Marc CHRISTIAN",
    moniteurs: [
      {
        id: "4",
        nom: "JEMMA",
        prenom: "Sarah",
        nomComplet: "Sarah JEMMA",
        role: "responsable",
        dateAffectation: new Date("2023-02-01"),
      },
      {
        id: "5",
        nom: "CHRISTIAN",
        prenom: "Marc",
        nomComplet: "Marc CHRISTIAN",
        role: "adjoint",
        dateAffectation: new Date("2023-02-01"),
      },
    ],
    actif: true,
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2024-10-20"),
  },
  {
    id: "3",
    nom: "Jardin",
    description: "Salle pour les tout-petits",
    capacite: 40,
    moniteurs: [
      {
        id: "6",
        nom: "MUKEBA",
        prenom: "David",
        nomComplet: "David MUKEBA",
        role: "membre",
        dateAffectation: new Date("2023-06-10"),
      },
    ],
    actif: true,
    createdAt: new Date("2023-06-10"),
    updatedAt: new Date("2024-10-20"),
  },
]

export function SalleList() {
  const router = useRouter()

  const handleDelete = (id: string, nom: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la salle "${nom}" ?`)) {
      console.log("Suppression de la salle:", id)
      // Logique de suppression ici
    }
  }

  const getSalleBadgeColor = (nom: string) => {
    const colors: { [key: string]: string } = {
      Jardin: "bg-green-100 text-green-800 border-green-300",
      Ainés: "bg-blue-100 text-blue-800 border-blue-300",
      Juniors: "bg-purple-100 text-purple-800 border-purple-300",
      Cadets: "bg-orange-100 text-orange-800 border-orange-300",
      Adolescents: "bg-red-100 text-red-800 border-red-300",
    }
    return colors[nom] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mockSalles.map((salle) => (
        <Card
          key={salle.id}
          className="p-5 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(`/salles/${salle.id}`)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Badge variant="outline" className={`${getSalleBadgeColor(salle.nom)} mb-2`}>
                {salle.nom}
              </Badge>
              {!salle.actif && (
                <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-600">
                  Inactive
                </Badge>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/salles/${salle.id}`)
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Voir détails
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    // TODO: Ouvrir le dialog d'édition
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(salle.id, salle.nom)
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-3">
            {salle.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{salle.description}</p>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span className="font-semibold">{salle.moniteurs.length}</span>
              <span>moniteur{salle.moniteurs.length > 1 ? "s" : ""}</span>
              <span className="text-gray-400">•</span>
              <span>Capacité: {salle.capacite}</span>
            </div>

            {salle.responsableNom && (
              <div className="flex items-center gap-2 text-sm">
                <Crown className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700">{salle.responsableNom}</span>
              </div>
            )}

            {salle.adjointNom && (
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">{salle.adjointNom}</span>
              </div>
            )}

            <div className="pt-3 border-t">
              <div className="flex flex-wrap gap-1">
                {salle.moniteurs.slice(0, 3).map((moniteur) => (
                  <Badge key={moniteur.id} variant="secondary" className="text-xs">
                    {moniteur.prenom} {moniteur.nom.charAt(0)}.
                  </Badge>
                ))}
                {salle.moniteurs.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-gray-200">
                    +{salle.moniteurs.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
