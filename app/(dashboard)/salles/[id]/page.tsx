"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Crown,
  Shield,
  Calendar,
  History,
  TrendingUp,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import type { Salle, MoniteurSalleHistorique } from "@/types/salle"

// Données mockées
const mockSalle: Salle = {
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
}

// Historique des moniteurs
const mockHistorique: MoniteurSalleHistorique[] = [
  {
    id: "1",
    moniteurId: "1",
    moniteurNom: "LENGE",
    moniteurPrenom: "Marie",
    moniteurNomComplet: "Marie LENGE",
    salleId: "1",
    salleNom: "Adolescents",
    role: "responsable",
    dateDebut: new Date("2023-01-15"),
    dateFin: undefined,
    actif: true,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    moniteurId: "2",
    moniteurNom: "NGEA",
    moniteurPrenom: "Paul",
    moniteurNomComplet: "Paul NGEA",
    salleId: "1",
    salleNom: "Adolescents",
    role: "adjoint",
    dateDebut: new Date("2023-01-15"),
    dateFin: undefined,
    actif: true,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "3",
    moniteurId: "3",
    moniteurNom: "NFEO",
    moniteurPrenom: "Jean",
    moniteurNomComplet: "Jean NFEO",
    salleId: "1",
    salleNom: "Adolescents",
    role: "membre",
    dateDebut: new Date("2023-03-20"),
    dateFin: undefined,
    actif: true,
    createdAt: new Date("2023-03-20"),
  },
  {
    id: "4",
    moniteurId: "4",
    moniteurNom: "JEMMA",
    moniteurPrenom: "Sarah",
    moniteurNomComplet: "Sarah JEMMA",
    salleId: "1",
    salleNom: "Adolescents",
    role: "membre",
    dateDebut: new Date("2022-09-01"),
    dateFin: new Date("2023-01-10"),
    actif: false,
    motifChangement: "Mutation vers la salle Juniors",
    createdAt: new Date("2022-09-01"),
  },
  {
    id: "5",
    moniteurId: "5",
    moniteurNom: "CHRISTIAN",
    moniteurPrenom: "Marc",
    moniteurNomComplet: "Marc CHRISTIAN",
    salleId: "1",
    salleNom: "Adolescents",
    role: "membre",
    dateDebut: new Date("2022-06-15"),
    dateFin: new Date("2022-12-31"),
    actif: false,
    motifChangement: "Départ du ministère",
    createdAt: new Date("2022-06-15"),
  },
]

export default function SalleDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [salle] = useState<Salle>(mockSalle)
  const [historique] = useState<MoniteurSalleHistorique[]>(mockHistorique)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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

  const getRoleBadge = (role: string) => {
    if (role === "responsable") return "bg-blue-100 text-blue-700 border-blue-300"
    if (role === "adjoint") return "bg-green-100 text-green-700 border-green-300"
    return "bg-gray-100 text-gray-700 border-gray-300"
  }

  const getRoleIcon = (role: string) => {
    if (role === "responsable") return <Crown className="h-4 w-4" />
    if (role === "adjoint") return <Shield className="h-4 w-4" />
    return <Users className="h-4 w-4" />
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const calculateDuree = (dateDebut: Date, dateFin?: Date) => {
    const debut = new Date(dateDebut)
    const fin = dateFin ? new Date(dateFin) : new Date()
    const diffTime = Math.abs(fin.getTime() - debut.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    
    if (years > 0) {
      return `${years} an${years > 1 ? "s" : ""} ${months > 0 ? `et ${months} mois` : ""}`
    }
    if (months > 0) {
      return `${months} mois`
    }
    return `${diffDays} jour${diffDays > 1 ? "s" : ""}`
  }

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette salle ?")) {
      console.log("Suppression de la salle:", salle.id)
      router.push("/salles")
    }
  }

  const moniteurActifs = historique.filter((h) => h.actif)
  const moniteurInactifs = historique.filter((h) => !h.actif)

  // Filtrage de l'historique
  const filteredHistorique = historique.filter((entry) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      entry.moniteurNomComplet.toLowerCase().includes(searchLower) ||
      entry.role.toLowerCase().includes(searchLower) ||
      entry.motifChangement?.toLowerCase().includes(searchLower) ||
      formatDate(entry.dateDebut).toLowerCase().includes(searchLower)
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredHistorique.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedHistorique = filteredHistorique.slice(startIndex, endIndex)

  // Réinitialiser à la page 1 quand la recherche change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-blue-900">Salle {salle.nom}</h1>
              <Badge variant="outline" className={getSalleBadgeColor(salle.nom)}>
                {salle.nom}
              </Badge>
              {!salle.actif && (
                <Badge variant="outline" className="bg-gray-100 text-gray-600">
                  Inactive
                </Badge>
              )}
            </div>
            <p className="text-gray-600">{salle.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {/* TODO: ouvrir edit dialog */}}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne gauche - Infos principales */}
        <div className="lg:col-span-1 space-y-6">
          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Capacité</span>
                  <span className="text-2xl font-bold text-blue-900">{salle.capacite}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Moniteurs actifs</span>
                  <span className="text-2xl font-bold text-green-600">{moniteurActifs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total passages</span>
                  <span className="text-2xl font-bold text-gray-900">{historique.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responsables */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Responsables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {salle.responsableNom && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Crown className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Responsable</p>
                    <p className="font-semibold text-gray-900">{salle.responsableNom}</p>
                  </div>
                </div>
              )}
              {salle.adjointNom && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Adjoint</p>
                    <p className="font-semibold text-gray-900">{salle.adjointNom}</p>
                  </div>
                </div>
              )}
              {!salle.responsableNom && !salle.adjointNom && (
                <p className="text-sm text-gray-600 italic">Aucun responsable affecté</p>
              )}
            </CardContent>
          </Card>

          {/* Informations supplémentaires */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Créée le {formatDate(salle.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Mise à jour le {formatDate(salle.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Moniteurs et Historique */}
        <div className="lg:col-span-2 space-y-6">
          {/* Moniteurs actuels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Moniteurs Actuels ({salle.moniteurs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {salle.moniteurs.map((moniteur) => (
                  <div
                    key={moniteur.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold">
                        {moniteur.prenom.charAt(0)}
                        {moniteur.nom.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{moniteur.nomComplet}</p>
                        <p className="text-xs text-gray-500">
                          Depuis le {formatDate(moniteur.dateAffectation)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getRoleBadge(moniteur.role)}>
                      <span className="mr-1">{getRoleIcon(moniteur.role)}</span>
                      {moniteur.role.charAt(0).toUpperCase() + moniteur.role.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Historique complet */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Historique Complet ({filteredHistorique.length} entrée{filteredHistorique.length > 1 ? "s" : ""})
                </CardTitle>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, rôle, motif..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {paginatedHistorique.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun résultat trouvé
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedHistorique.map((entry) => (
                      <div
                        key={entry.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          entry.actif
                            ? "bg-green-50 border-green-500"
                            : "bg-gray-50 border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{entry.moniteurNomComplet}</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(entry.dateDebut)} 
                              {entry.dateFin ? ` - ${formatDate(entry.dateFin)}` : " - Aujourd'hui"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline" className={getRoleBadge(entry.role)}>
                              {entry.role.charAt(0).toUpperCase() + entry.role.slice(1)}
                            </Badge>
                            {entry.actif && (
                              <Badge className="bg-green-600 text-white">Actif</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          <Clock className="h-3 w-3 inline mr-1" />
                          Durée: {calculateDuree(entry.dateDebut, entry.dateFin)}
                        </div>
                        {entry.motifChangement && (
                          <div className="mt-2 text-sm text-gray-700 italic">
                            Motif: {entry.motifChangement}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        Page {currentPage} sur {totalPages} ({filteredHistorique.length} résultat{filteredHistorique.length > 1 ? "s" : ""})
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Précédent
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Suivant
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
