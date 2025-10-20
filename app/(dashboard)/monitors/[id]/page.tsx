"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Heart,
  User,
  Users,
  Building2,
  Crown,
  Shield,
  History,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { EditMonitorDialog } from "@/components/monitors/edit-monitor-dialog"
import type { Monitor } from "@/types/monitor"
import type { MoniteurSalleHistorique } from "@/types/salle"

// Données de test - à remplacer par des données réelles de la base de données
const mockMonitor: Monitor = {
  id: "1",
  nom: "Dupont",
  postNom: "Martin",
  prenom: "Jean",
  dateNaissance: "1985-03-15",
  email: "jean.dupont@email.com",
  telephone: "+33 6 12 34 56 78",
  adresse: "123 Rue de l'Église, 75001 Paris, France",
  photo: "",
  dateConversion: "2010-05-20",
  dateBapteme: "2010-08-15",
  baptiseSaintEsprit: true,
  etatCivil: "Marié(e)",
  dateAdhesion: "2015-01-10",
  salleActuelleId: "1",
  salleActuelleNom: "Adolescents",
  roleActuel: "responsable",
  dateAffectationActuelle: "2023-01-15",
}

// Historique des affectations
const mockHistorique: MoniteurSalleHistorique[] = [
  {
    id: "1",
    moniteurId: "1",
    moniteurNom: "Dupont",
    moniteurPrenom: "Jean",
    moniteurNomComplet: "Jean Martin Dupont",
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
    moniteurId: "1",
    moniteurNom: "Dupont",
    moniteurPrenom: "Jean",
    moniteurNomComplet: "Jean Martin Dupont",
    salleId: "2",
    salleNom: "Juniors",
    role: "adjoint",
    dateDebut: new Date("2021-06-01"),
    dateFin: new Date("2023-01-10"),
    actif: false,
    motifChangement: "Promotion au poste de responsable Adolescents",
    createdAt: new Date("2021-06-01"),
  },
  {
    id: "3",
    moniteurId: "1",
    moniteurNom: "Dupont",
    moniteurPrenom: "Jean",
    moniteurNomComplet: "Jean Martin Dupont",
    salleId: "3",
    salleNom: "Jardin",
    role: "membre",
    dateDebut: new Date("2019-09-01"),
    dateFin: new Date("2021-05-30"),
    actif: false,
    motifChangement: "Réaffectation à la salle Juniors",
    createdAt: new Date("2019-09-01"),
  },
  {
    id: "4",
    moniteurId: "1",
    moniteurNom: "Dupont",
    moniteurPrenom: "Jean",
    moniteurNomComplet: "Jean Martin Dupont",
    salleId: "2",
    salleNom: "Juniors",
    role: "membre",
    dateDebut: new Date("2018-01-10"),
    dateFin: new Date("2019-08-30"),
    actif: false,
    motifChangement: "Mutation vers salle Jardin",
    createdAt: new Date("2018-01-10"),
  },
]

export default function MonitorDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [monitor] = useState<Monitor>(mockMonitor) // Remplacer par fetch réel
  const [historique] = useState<MoniteurSalleHistorique[]>(mockHistorique)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "Non renseigné"
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce moniteur ?")) {
      console.log("Suppression du moniteur:", monitor.id)
      // Logique de suppression ici
      router.push("/monitors")
    }
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

  // Filtrage de l'historique
  const filteredHistorique = historique.filter((entry) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      entry.salleNom.toLowerCase().includes(searchLower) ||
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
            <h1 className="text-3xl font-bold text-gray-900">Détails du Moniteur</h1>
            <p className="text-gray-600">Informations complètes</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Colonne gauche - Photo et infos principales */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={monitor.photo} />
                <AvatarFallback className="bg-blue-600 text-white text-3xl">
                  {monitor.prenom.charAt(0)}{monitor.nom.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {monitor.prenom} {monitor.postNom} {monitor.nom}
                </h2>
                <p className="text-gray-600">{calculateAge(monitor.dateNaissance)} ans</p>
                <Badge className="mt-2">{monitor.etatCivil}</Badge>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="text-sm">{monitor.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="h-5 w-5 text-blue-600" />
                <span className="text-sm">{monitor.telephone}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-700">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <span className="text-sm">{monitor.adresse}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colonne droite - Informations détaillées */}
        <div className="md:col-span-2 space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-600">Date de naissance</p>
                  <p className="text-base text-gray-900">{formatDate(monitor.dateNaissance)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">État civil</p>
                  <p className="text-base text-gray-900">{monitor.etatCivil}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-base text-gray-900">{monitor.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Téléphone</p>
                  <p className="text-base text-gray-900">{monitor.telephone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-600">Adresse</p>
                  <p className="text-base text-gray-900">{monitor.adresse}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations spirituelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-blue-600" />
                Informations Spirituelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-600">Date de conversion</p>
                  <p className="text-base text-gray-900">{formatDate(monitor.dateConversion)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date de baptême</p>
                  <p className="text-base text-gray-900">{formatDate(monitor.dateBapteme)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Baptisé du Saint-Esprit</p>
                  <div className="flex items-center gap-2">
                    {monitor.baptiseSaintEsprit ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Oui</Badge>
                    ) : (
                      <Badge variant="secondary">Non</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations du ministère */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Ministère
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Date d'adhésion</p>
                  <p className="text-base text-gray-900">{formatDate(monitor.dateAdhesion)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Ancienneté</p>
                  <p className="text-base text-gray-900">
                    {Math.floor((new Date().getTime() - new Date(monitor.dateAdhesion).getTime()) / (1000 * 60 * 60 * 24 * 365))} ans
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Affectation actuelle */}
          {monitor.salleActuelleNom && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Building2 className="h-5 w-5" />
                  Affectation Actuelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Salle</p>
                      <p className="text-lg font-bold text-blue-900">{monitor.salleActuelleNom}</p>
                    </div>
                    <Badge variant="outline" className={getRoleBadge(monitor.roleActuel || "membre")}>
                      <span className="mr-1">{getRoleIcon(monitor.roleActuel || "membre")}</span>
                      {monitor.roleActuel?.charAt(0).toUpperCase()}{monitor.roleActuel?.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Date d'affectation</p>
                    <p className="text-base text-blue-900">{formatDate(monitor.dateAffectationActuelle)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Durée</p>
                    <p className="text-base text-blue-900">
                      {calculateDuree(new Date(monitor.dateAffectationActuelle || new Date()))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Historique des affectations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Historique des Affectations ({filteredHistorique.length} entrée{filteredHistorique.length > 1 ? "s" : ""})
                </CardTitle>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par salle, rôle, motif..."
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
                            <p className="font-semibold text-gray-900">{entry.salleNom}</p>
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

      <EditMonitorDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        monitor={monitor}
      />
    </div>
  )
}
