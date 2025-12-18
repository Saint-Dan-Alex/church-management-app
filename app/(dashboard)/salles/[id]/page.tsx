"use client"

import { useState, useEffect, use } from "react"
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
  Loader2
} from "lucide-react"
import { EditSalleDialog } from "@/components/salles/edit-salle-dialog"
import type { Salle, MoniteurSalleHistorique } from "@/types/salle"
import { sallesService } from "@/lib/services/salles.service"
import { toast } from "sonner"

export default function SalleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  // Déballage des paramètres avec use() comme recommandé par Next.js 15
  const { id } = use(params)

  const [salle, setSalle] = useState<Salle | null>(null)
  const [historique, setHistorique] = useState<MoniteurSalleHistorique[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchSalleDetails = async () => {
      try {
        setLoading(true)
        const data = await sallesService.getById(id)
        setSalle(data)
        if (data.historique) {
          setHistorique(data.historique)
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la salle:", error)
        toast.error("Impossible de charger les détails de la salle")
        // Optionnel : rediriger vers la liste si non trouvé
        // router.push('/salles') 
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchSalleDetails()
    }
  }, [id])

  const handleEditSuccess = () => {
    // Recharger les données après modification
    if (id) {
      // Simple recharge pour l'instant
      window.location.reload();
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

  const getRoleBadge = (role?: string) => {
    if (!role) return "bg-gray-100 text-gray-700 border-gray-300"
    const r = role.toLowerCase()
    if (r === "responsable" || r === "chef_salle") return "bg-blue-100 text-blue-700 border-blue-300"
    if (r === "adjoint") return "bg-green-100 text-green-700 border-green-300"
    return "bg-gray-100 text-gray-700 border-gray-300"
  }

  const getRoleIcon = (role?: string) => {
    if (!role) return <Users className="h-4 w-4" />
    const r = role.toLowerCase()
    if (r === "responsable" || r === "chef_salle") return <Crown className="h-4 w-4" />
    if (r === "adjoint") return <Shield className="h-4 w-4" />
    return <Users className="h-4 w-4" />
  }

  const formatRoleLabel = (role?: string) => {
    if (!role) return "Moniteur"
    const r = role.toLowerCase()
    if (r === "responsable" || r === "chef_salle") return "Responsable"
    if (r === "adjoint") return "Adjoint"
    return "Moniteur"
  }


  const formatDate = (date: Date | string) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const calculateDuree = (dateDebut: Date | string, dateFin?: Date | string) => {
    if (!dateDebut) return "-"
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

  const handleDelete = async () => {
    if (!salle) return
    if (confirm("Êtes-vous sûr de vouloir supprimer cette salle ?")) {
      try {
        await sallesService.delete(salle.id)
        toast.success("Salle supprimée avec succès")
        router.push("/salles")
      } catch (error) {
        console.error("Erreur suppression salle:", error)
        toast.error("Erreur lors de la suppression")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500">Chargement des détails de la salle...</p>
      </div>
    )
  }

  if (!salle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-red-500 text-xl font-semibold">Salle introuvable</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>
    )
  }

  const moniteurActifs = historique.filter((h) => h.actif)
  const moniteurInactifs = historique.filter((h) => !h.actif)

  // Filtrage de l'historique
  const filteredHistorique = historique.filter((entry) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      entry.moniteurNomComplet.toLowerCase().includes(searchLower) ||
      entry.role.toLowerCase().includes(searchLower) ||
      (entry.motifChangement && entry.motifChangement.toLowerCase().includes(searchLower)) ||
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
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1">
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
                  <span className="text-2xl font-bold text-green-600">{salle.moniteurs ? salle.moniteurs.length : 0}</span>
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
              {salle.responsable_nom && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Crown className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Responsable</p>
                    <p className="font-semibold text-gray-900">{salle.responsable_nom}</p>
                  </div>
                </div>
              )}
              {salle.adjoint_nom && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Adjoint</p>
                    <p className="font-semibold text-gray-900">{salle.adjoint_nom}</p>
                  </div>
                </div>
              )}
              {!salle.responsable_nom && !salle.adjoint_nom && (
                <p className="text-sm text-gray-600 italic">Aucun responsable affecté</p>
              )}
            </CardContent>
          </Card>

          {/* Informations supplémentaires */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Créée le {formatDate(salle.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Mise à jour le {formatDate(salle.updated_at)}</span>
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
                Moniteurs Actuels ({salle.moniteurs ? salle.moniteurs.length : 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!salle.moniteurs || salle.moniteurs.length === 0 ? (
                <div className="text-center py-4 text-gray-500">Aucun moniteur affecté</div>
              ) : (
                <div className="space-y-3">
                  {salle.moniteurs.map((moniteur) => (
                    <div
                      key={moniteur.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold">
                          {moniteur.prenom ? moniteur.prenom.charAt(0) : ''}
                          {moniteur.nom ? moniteur.nom.charAt(0) : ''}
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
                        {moniteur.role ? formatRoleLabel(moniteur.role) : 'Membre'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
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
                  Aucun résultat trouvé dans l'historique
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedHistorique.map((entry) => (
                      <div
                        key={entry.id}
                        className={`p-4 rounded-lg border-l-4 ${entry.actif
                          ? "bg-green-50 border-green-500"
                          : "bg-gray-50 border-gray-300"
                          }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{entry.moniteurNomComplet}</p>
                            {/* ... */}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline" className={getRoleBadge(entry.role)}>
                              {entry.role ? formatRoleLabel(entry.role) : ''}
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

      <EditSalleDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        salle={salle}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}
