"use client"

import { useState } from "react"
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
  Calendar,
  Heart,
  User,
  Users,
  AlertCircle,
  TrendingUp
} from "lucide-react"
import { EditChildDialog } from "@/components/children/edit-child-dialog"
import type { Child } from "@/types/child"

// Données de test
const mockChild: Child = {
  id: "1",
  nom: "Dupont",
  postNom: "Martin",
  prenom: "Lucas",
  nomComplet: "Lucas Martin Dupont",
  dateNaissance: "2012-05-15",
  genre: "Masculin",
  etatCivil: "Célibataire",
  adresse: "123 Rue de l'Église, 75001 Paris",
  telephone: "+33 6 12 34 56 78",
  email: "lucas.dupont@email.com",
  photo: "",
  nomPere: "Jean Dupont",
  nomMere: "Marie Dupont",
  telephoneParent1: "+33 6 11 22 33 44",
  telephoneParent2: "+33 6 55 66 77 88",
  emailParents: "parents.dupont@email.com",
  contactUrgence: "Pierre Dupont",
  lienContactUrgence: "Oncle",
  dateConversion: "2020-03-10",
  dateBapteme: "2020-06-15",
  baptiseSaintEsprit: "Oui",
  vieDonneeAJesus: "Oui",
  estOuvrier: true,
  commissionActuelle: "Louange",
  dateAdhesion: "2019-09-01",
  allergiesConnues: true,
  allergiesDetails: "Arachides, lactose",
  maladies: "Asthme léger",
  traitement: "Ventoline en cas de crise",
  autorisationSoins: true,
  vieChretienne: "Bonne",
  viePriere: "Bonne",
  comprehensionBible: "Moyenne",
  gagneUneAme: "Non",
  encadreur: "Oui",
  qualiteEnseignements: "Bonne",
  sujetSouhaite: "La prière efficace",
  besoinSuggestion: "Plus d'activités pratiques"
}

export default function ChildDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [child] = useState<Child>(mockChild)

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
    if (confirm("Êtes-vous sûr de vouloir supprimer cet enfant ?")) {
      console.log("Suppression de l'enfant:", child.id)
      router.push("/children")
    }
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
                  <AvatarImage src={child.photo} />
                  <AvatarFallback className="bg-blue-600 text-white text-3xl">
                    {child.prenom.charAt(0)}{child.nom.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-bold text-gray-900">{child.nomComplet}</h2>
                  <p className="text-gray-600">{calculateAge(child.dateNaissance)} ans</p>
                  <div className="flex gap-2 justify-center">
                    <Badge>{child.genre}</Badge>
                    <Badge variant="outline">{child.etatCivil}</Badge>
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
          {child.allergiesConnues && (
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
                    <p className="text-orange-800">{child.allergiesDetails}</p>
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
                  <p className="text-base text-gray-900">{formatDate(child.dateNaissance)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Âge</p>
                  <p className="text-base text-gray-900">{calculateAge(child.dateNaissance)} ans</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Genre</p>
                  <p className="text-base text-gray-900">{child.genre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">État civil</p>
                  <p className="text-base text-gray-900">{child.etatCivil}</p>
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
                  <p className="text-base text-gray-900">{child.nomPere}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Mère</p>
                  <p className="text-base text-gray-900">{child.nomMere}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Téléphone parent 1</p>
                  <p className="text-base text-gray-900">{child.telephoneParent1}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Téléphone parent 2</p>
                  <p className="text-base text-gray-900">{child.telephoneParent2 || "Non renseigné"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email des parents</p>
                  <p className="text-base text-gray-900">{child.emailParents}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Contact d'urgence</p>
                  <p className="text-base text-gray-900">{child.contactUrgence} ({child.lienContactUrgence})</p>
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
                  <Badge className={child.vieDonneeAJesus === "Oui" ? "bg-green-600" : "bg-gray-500"}>{child.vieDonneeAJesus}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Baptisé du Saint-Esprit</p>
                  <Badge className={child.baptiseSaintEsprit === "Oui" ? "bg-green-600" : child.baptiseSaintEsprit === "Non" ? "bg-red-600" : "bg-gray-500"}>{child.baptiseSaintEsprit}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date de conversion</p>
                  <p className="text-base text-gray-900">{formatDate(child.dateConversion)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date de baptême</p>
                  <p className="text-base text-gray-900">{formatDate(child.dateBapteme)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date d'adhésion</p>
                  <p className="text-base text-gray-900">{formatDate(child.dateAdhesion)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Est ouvrier</p>
                  <p className="text-base text-gray-900">{child.estOuvrier ? "Oui" : "Non"}</p>
                </div>
                {child.estOuvrier && child.commissionActuelle && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Commission actuelle</p>
                    <Badge variant="outline">{child.commissionActuelle}</Badge>
                  </div>
                )}
                {!child.estOuvrier && child.commissionSouhaitee && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Commission souhaitée</p>
                    <Badge variant="outline">{child.commissionSouhaitee}</Badge>
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
                {child.vieChretienne && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vie chrétienne</p>
                    <Badge variant="outline">{child.vieChretienne}</Badge>
                  </div>
                )}
                {child.viePriere && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vie de prière</p>
                    <Badge variant="outline">{child.viePriere}</Badge>
                  </div>
                )}
                {child.comprehensionBible && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Compréhension Bible</p>
                    <Badge variant="outline">{child.comprehensionBible}</Badge>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-600">Gagné une âme</p>
                  <Badge className={child.gagneUneAme === "Oui" ? "bg-green-600" : "bg-gray-500"}>{child.gagneUneAme}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">A un encadreur</p>
                  <Badge className={child.encadreur === "Oui" ? "bg-green-600" : "bg-gray-500"}>{child.encadreur}</Badge>
                </div>
                {child.qualiteEnseignements && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Qualité enseignements</p>
                    <Badge variant="outline">{child.qualiteEnseignements}</Badge>
                  </div>
                )}
              </div>
              {(child.sujetSouhaite || child.besoinSuggestion) && (
                <div className="mt-4 space-y-3 pt-4 border-t">
                  {child.sujetSouhaite && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sujet souhaité</p>
                      <p className="text-base text-gray-900">{child.sujetSouhaite}</p>
                    </div>
                  )}
                  {child.besoinSuggestion && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Besoins / Suggestions</p>
                      <p className="text-base text-gray-900">{child.besoinSuggestion}</p>
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
                  <Badge className={child.autorisationSoins ? "bg-green-600" : "bg-red-600"}>
                    {child.autorisationSoins ? "Accordée" : "Non accordée"}
                  </Badge>
                </div>
                {child.allergiesConnues && child.allergiesDetails && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Allergies</p>
                    <p className="text-base text-gray-900">{child.allergiesDetails}</p>
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
        child={child}
      />
    </div>
  )
}
