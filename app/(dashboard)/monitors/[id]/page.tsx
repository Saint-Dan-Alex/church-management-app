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
  Users
} from "lucide-react"
import { EditMonitorDialog } from "@/components/monitors/edit-monitor-dialog"
import type { Monitor } from "@/types/monitor"

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
}

export default function MonitorDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [monitor] = useState<Monitor>(mockMonitor) // Remplacer par fetch réel

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
