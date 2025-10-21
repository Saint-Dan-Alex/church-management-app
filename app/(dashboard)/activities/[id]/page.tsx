"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar,
  MapPin,
  Users,
  Clock,
  FileText,
  QrCode,
  UserPlus,
  DollarSign,
  FileText as FileTextIcon,
} from "lucide-react"
import { PresenceManager } from "@/components/activities/presence-manager"
import { EditActivityDialog } from "@/components/activities/edit-activity-dialog"
import { PaymentManager } from "@/components/activities/payment-manager"
import { ActivityReport } from "@/components/activities/activity-report"
import { ExpenseManager } from "@/components/activities/expense-manager"

// Données mockées
const mockActivity = {
  id: "1",
  titre: "Réunion des moniteurs",
  description: "Réunion mensuelle de coordination des moniteurs",
  date: new Date("2025-01-25"),
  heureDebut: "14:00",
  heureFin: "16:00",
  lieu: "Salle principale",
  type: "reunion",
  statut: "planifie",
  responsable: "Marie LENGE",
  participants: ["Marie LENGE", "Paul NGEA", "Jean NFEO"],
}

export default function ActivityDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activity] = useState(mockActivity)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      console.log("Suppression de l'activité:", activity.id)
      router.push("/activities")
    }
  }

  const getTypeBadge = (type: string) => {
    const colors: { [key: string]: string } = {
      reunion: "bg-blue-100 text-blue-700",
      formation: "bg-purple-100 text-purple-700",
      culte: "bg-green-100 text-green-700",
      sortie: "bg-orange-100 text-orange-700",
    }
    return colors[type] || "bg-gray-100 text-gray-700"
  }

  const getStatutBadge = (statut: string) => {
    const colors: { [key: string]: string } = {
      planifie: "bg-yellow-100 text-yellow-700",
      en_cours: "bg-blue-100 text-blue-700",
      termine: "bg-green-100 text-green-700",
      annule: "bg-red-100 text-red-700",
    }
    return colors[statut] || "bg-gray-100 text-gray-700"
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
              <h1 className="text-3xl font-bold text-blue-900">{activity.titre}</h1>
              <Badge className={getTypeBadge(activity.type)}>
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
              </Badge>
              <Badge className={getStatutBadge(activity.statut)}>
                {activity.statut.charAt(0).toUpperCase() + activity.statut.slice(1).replace("_", " ")}
              </Badge>
            </div>
            <p className="text-gray-600">{activity.description}</p>
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
        {/* Colonne gauche - Infos de l'activité */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Date</p>
                  <p className="text-base text-gray-900">{formatDate(activity.date)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Horaire</p>
                  <p className="text-base text-gray-900">
                    {activity.heureDebut} - {activity.heureFin}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Lieu</p>
                  <p className="text-base text-gray-900">{activity.lieu}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Responsable</p>
                  <p className="text-base text-gray-900">{activity.responsable}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activity.participants.map((participant, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                      {participant.split(" ").map(n => n.charAt(0)).join("")}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{participant}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Gestion de présence */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="presence" className="space-y-4">
            <TabsList>
              <TabsTrigger value="presence">
                <QrCode className="mr-2 h-4 w-4" />
                Présence
              </TabsTrigger>
              <TabsTrigger value="participants">
                <Users className="mr-2 h-4 w-4" />
                Participants
              </TabsTrigger>
              <TabsTrigger value="paiements">
                <DollarSign className="mr-2 h-4 w-4" />
                Paiements
              </TabsTrigger>
              <TabsTrigger value="finances">
                <DollarSign className="mr-2 h-4 w-4" />
                Finances
              </TabsTrigger>
              <TabsTrigger value="rapport">
                <FileTextIcon className="mr-2 h-4 w-4" />
                Rapport
              </TabsTrigger>
              <TabsTrigger value="details">
                <FileText className="mr-2 h-4 w-4" />
                Détails
              </TabsTrigger>
            </TabsList>

            <TabsContent value="presence">
              <PresenceManager
                activiteId={activity.id}
                activiteNom={activity.titre}
                dateActivite={activity.date}
                heureFinActivite={activity.heureFin}
              />
            </TabsContent>

            <TabsContent value="participants">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Gestion des Participants ({activity.participants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activity.participants.map((participant, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold">
                            {participant.split(" ").map(n => n.charAt(0)).join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{participant}</p>
                            <p className="text-sm text-gray-600">Participant</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Ajouter un participant
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="paiements">
              <PaymentManager
                activiteId={activity.id}
                activiteNom={activity.titre}
                dateActivite={activity.date}
              />
            </TabsContent>

            <TabsContent value="finances">
              <ExpenseManager
                activiteId={activity.id}
                activiteNom={activity.titre}
                totalPaiementsCollectes={13000}
                devisePaiements="CDF"
              />
            </TabsContent>

            <TabsContent value="rapport">
              <ActivityReport
                activite={activity}
                presences={[]}
                payments={[]}
                paymentStats={{
                  totalParticipants: 10,
                  totalPaye: 13000,
                  totalRestant: 7000,
                  totalAttendus: 20000,
                  tauxPaiement: 65,
                  nombrePaiesComplet: 2,
                  nombrePaiesPartiel: 1,
                  nombreEnAttente: 5,
                  nombreEnRetard: 2,
                }}
                paymentConfig={{
                  montantRequis: 5000,
                  devise: "CDF",
                  montantAlternatif: 3,
                  deviseAlternative: "USD",
                }}
                expenses={[
                  {
                    id: "1",
                    activiteId: "1",
                    activiteNom: "Réunion des moniteurs",
                    categorie: "repas",
                    description: "Rafraîchissements pour les participants",
                    montant: 15000,
                    devise: "CDF",
                    date: "2025-01-20",
                    beneficiaire: "Restaurant La Paix",
                    ajoutePar: "user1",
                    ajouteParNom: "Admin",
                    createdAt: new Date(),
                  },
                  {
                    id: "2",
                    activiteId: "1",
                    activiteNom: "Réunion des moniteurs",
                    categorie: "materiel",
                    description: "Cahiers et stylos",
                    montant: 8000,
                    devise: "CDF",
                    date: "2025-01-19",
                    beneficiaire: "Librairie Centrale",
                    ajoutePar: "user1",
                    ajouteParNom: "Admin",
                    createdAt: new Date(),
                  },
                ]}
              />
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Description complète</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{activity.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <EditActivityDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        activity={activity}
      />
    </div>
  )
}
