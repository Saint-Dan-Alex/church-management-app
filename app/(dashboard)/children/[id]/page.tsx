"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Heart,
  User,
  Users,
  AlertCircle,
  TrendingUp,
  Loader2
} from "lucide-react"
import { EditChildDialog } from "@/components/children/edit-child-dialog"
import { childrenService } from "@/lib/services/children.service"
import type { Child } from "@/lib/types/api"
import { toast } from "sonner"

export default function ChildDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  // Unwrap params using React.use()
  const { id } = use(params)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [child, setChild] = useState<Child | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChild = async () => {
      try {
        setIsLoading(true)
        const data = await childrenService.getById(id)
        setChild(data)
      } catch (error) {
        console.error("Erreur:", error)
        toast.error("Impossible de charger les informations de l'enfant")
      } finally {
        setIsLoading(false)
      }
    }
    fetchChild()
  }, [id])

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const formatDate = (date: string | Date | undefined | null) => {
    if (!date) return "Non renseigné"
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }

  const handleDelete = async () => {
    if (!child) return
    if (confirm("Êtes-vous sûr de vouloir supprimer cet enfant ?")) {
      try {
        await childrenService.delete(child.id)
        toast.success("Enfant supprimé avec succès")
        router.push("/children")
      } catch (error) {
        toast.error("Erreur lors de la suppression")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!child) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Enfant non trouvé</h2>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-gray-900">Détails de l'Enfant</h1>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne gauche - Photo et infos principales */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={child.photo || undefined} />
                  <AvatarFallback className="bg-blue-600 text-white text-3xl">
                    {child.prenom?.[0]}{child.nom?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-bold text-gray-900">{child.nom_complet || `${child.prenom} ${child.nom} `}</h2>
                  <p className="text-gray-600">{calculateAge(child.date_naissance)} ans</p>
                  <div className="flex gap-2 justify-center">
                    <Badge>{child.genre}</Badge>
                    <Badge variant="outline">{child.etat_civil}</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">{child.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">{child.telephone}</span>
                </div>
                <div className="flex items-start gap-3 text-gray-700">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                  <span className="text-sm">{child.adresse}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alertes santé */}
          {child.allergies_connues && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertCircle className="h-5 w-5" />
                  Alertes Santé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium text-orange-900">Allergies:</p>
                    <p className="text-orange-800">{child.allergies_details}</p>
                  </div>
                  {child.maladies && (
                    <div>
                      <p className="font-medium text-orange-900">Condition:</p>
                      <p className="text-orange-800">{child.maladies}</p>
                    </div>
                  )}
                  {child.traitement && (
                    <div>
                      <p className="font-medium text-orange-900">Traitement:</p>
                      <p className="text-orange-800">{child.traitement}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne droite - Informations détaillées */}
        <div className="lg:col-span-2 space-y-6">
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
                  <p className="text-base text-gray-900">{formatDate(child.date_naissance)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Âge</p>
                  <p className="text-base text-gray-900">{calculateAge(child.date_naissance)} ans</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Genre</p>
                  <p className="text-base text-gray-900">{child.genre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">État civil</p>
                  <p className="text-base text-gray-900">{child.etat_civil}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations familiales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Informations Familiales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-600">Père</p>
                  <p className="text-base text-gray-900">{child.nom_pere}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Mère</p>
                  <p className="text-base text-gray-900">{child.nom_mere}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Téléphone parent 1</p>
                  <p className="text-base text-gray-900">{child.telephone_parent1}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Téléphone parent 2</p>
                  <p className="text-base text-gray-900">{child.telephone_parent2 || "Non renseigné"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email des parents</p>
                  <p className="text-base text-gray-900">{child.email_parents}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Contact d'urgence</p>
                  <p className="text-base text-gray-900">{child.contact_urgence} ({child.lien_contact_urgence})</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parcours spirituel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-blue-600" />
                Parcours Spirituel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-600">Donné sa vie à Jésus</p>
                  <Badge className={child.vie_donnee_a_jesus === "Oui" ? "bg-green-600" : "bg-gray-500"}>{child.vie_donnee_a_jesus}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Baptisé du Saint-Esprit</p>
                  <Badge className={child.baptise_saint_esprit === "Oui" ? "bg-green-600" : child.baptise_saint_esprit === "Non" ? "bg-red-600" : "bg-gray-500"}>{child.baptise_saint_esprit}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date de conversion</p>
                  <p className="text-base text-gray-900">{formatDate(child.date_conversion)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date de baptême</p>
                  <p className="text-base text-gray-900">{formatDate(child.date_bapteme)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date d'adhésion</p>
                  <p className="text-base text-gray-900">{formatDate(child.date_adhesion)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Est ouvrier</p>
                  <p className="text-base text-gray-900">{child.est_ouvrier ? "Oui" : "Non"}</p>
                </div>
                {child.est_ouvrier && child.commission_actuelle && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Commission actuelle</p>
                    <Badge variant="outline">{child.commission_actuelle}</Badge>
                  </div>
                )}
                {!child.est_ouvrier && child.commission_souhaitee && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Commission souhaitée</p>
                    <Badge variant="outline">{child.commission_souhaitee}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Évaluation personnelle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Évaluation Personnelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {child.vie_chretienne && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vie chrétienne</p>
                    <Badge variant="outline">{child.vie_chretienne}</Badge>
                  </div>
                )}
                {child.vie_priere && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vie de prière</p>
                    <Badge variant="outline">{child.vie_priere}</Badge>
                  </div>
                )}
                {child.comprehension_bible && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Compréhension Bible</p>
                    <Badge variant="outline">{child.comprehension_bible}</Badge>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-600">Gagné une âme</p>
                  <Badge className={child.gagne_une_ame === "Oui" ? "bg-green-600" : "bg-gray-500"}>{child.gagne_une_ame}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">A un encadreur</p>
                  <Badge className={child.encadreur === "Oui" ? "bg-green-600" : "bg-gray-500"}>{child.encadreur}</Badge>
                </div>
                {child.qualite_enseignements && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Qualité enseignements</p>
                    <Badge variant="outline">{child.qualite_enseignements}</Badge>
                  </div>
                )}
              </div>
              {(child.sujet_souhaite || child.besoin_suggestion) && (
                <div className="mt-4 space-y-3 pt-4 border-t">
                  {child.sujet_souhaite && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sujet souhaité</p>
                      <p className="text-base text-gray-900">{child.sujet_souhaite}</p>
                    </div>
                  )}
                  {child.besoin_suggestion && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Besoins / Suggestions</p>
                      <p className="text-base text-gray-900">{child.besoin_suggestion}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Santé */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                Informations de Santé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Autorisation de soins:</span>
                  <Badge className={child.autorisation_soins ? "bg-green-600" : "bg-red-600"}>
                    {child.autorisation_soins ? "Accordée" : "Non accordée"}
                  </Badge>
                </div>
                {child.allergies_connues && child.allergies_details && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Allergies</p>
                    <p className="text-base text-gray-900">{child.allergies_details}</p>
                  </div>
                )}
                {child.maladies && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conditions médicales</p>
                    <p className="text-base text-gray-900">{child.maladies}</p>
                  </div>
                )}
                {child.traitement && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Traitement</p>
                    <p className="text-base text-gray-900">{child.traitement}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <EditChildDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        child={child as any}
      />
    </div>
  )
}
