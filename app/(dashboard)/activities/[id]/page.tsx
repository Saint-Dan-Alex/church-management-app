"use client"

import { useState, useEffect, use } from "react"
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
  DollarSign,
  FileText as FileTextIcon,
  Loader2
} from "lucide-react"
import { PresenceManager } from "@/components/activities/presence-manager"
import { EditActivityDialog } from "@/components/activities/edit-activity-dialog"
import { PaymentManager } from "@/components/activities/payment-manager"
import { ActivityReport } from "@/components/activities/activity-report"
import { ExpenseManager } from "@/components/activities/expense-manager"
import { UnifiedParticipantsView } from "@/components/activities/unified-participants-view"
import { activitiesService, type Activity } from "@/lib/services/activities.service"
import { toast } from "sonner"

import { AddPaymentDialog } from "@/components/activities/add-payment-dialog"
import { AddExpenseDialog } from "@/components/activities/add-expense-dialog"
import { Plus } from "lucide-react"

export default function ActivityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [activity, setActivity] = useState<Activity | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)

  // Extension de l'interface Activity pour inclure les relations si nécessaire
  // Note: le contrôleur Laravel load(['participants', ...]) donc activity aura ces champs peuplés
  // en plus des champs de base.

  useEffect(() => {
    loadActivity()
  }, [id])

  // ... (loadActivity, handleDelete, formatDate, getTypeBadge, getStatutBadge, getStatusLabel unchanged)

  const loadActivity = async () => {
    try {
      setIsLoading(true)
      const data = await activitiesService.getById(id)
      setActivity(data)
    } catch (error) {
      console.error("Erreur lors du chargement de l'activité:", error)
      toast.error("Impossible de charger les détails de l'activité")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      try {
        await activitiesService.delete(id)
        toast.success("Activité supprimée avec succès")
        router.push("/activities")
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        toast.error("Impossible de supprimer l'activité")
      }
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getTypeBadge = (type: string) => {
    // Mapping simplifié pour correspondre à votre logique actuelle
    if (type === 'libre') return "bg-green-100 text-green-700"
    if (type === 'payante') return "bg-blue-100 text-blue-700"
    return "bg-gray-100 text-gray-700"
  }

  const getStatutBadge = (statut: string) => {
    const colors: { [key: string]: string } = {
      upcoming: "bg-yellow-100 text-yellow-700",
      ongoing: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    }
    return colors[statut] || "bg-gray-100 text-gray-700"
  }

  const getStatusLabel = (statut: string) => {
    const labels: { [key: string]: string } = {
      upcoming: "Planifiée",
      ongoing: "En cours",
      completed: "Terminée",
      cancelled: "Annulée"
    }
    return labels[statut] || statut
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Chargement des détails...</span>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <p className="text-lg text-gray-600">Activité introuvable.</p>
        <Button onClick={() => router.push('/activities')}>Retour aux activités</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/activities')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl font-bold text-blue-900">{activity.title}</h1>
              <Badge className={getTypeBadge(activity.type)}>
                {activity.type === 'libre' ? 'Libre' : 'Payante'}
              </Badge>
              <Badge className={getStatutBadge(activity.status)}>
                {getStatusLabel(activity.status)}
              </Badge>
              <Badge variant="outline" className="text-gray-600 border-gray-300">
                {activity.category}
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
                  <p className="text-base text-gray-900">
                    {formatDate(activity.date)}
                    {activity.end_date && activity.end_date !== activity.date && (
                      <span className="block text-sm text-gray-500">au {formatDate(activity.end_date)}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Horaire</p>
                  <p className="text-base text-gray-900">
                    {activity.time} ({activity.duration})
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Lieu</p>
                  <p className="text-base text-gray-900">{activity.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Responsable</p>
                  <p className="text-base text-gray-900">{activity.organizer}</p>
                </div>
              </div>
              {activity.price && parseFloat(activity.price.toString()) > 0 && (
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Prix</p>
                    <p className="text-base text-gray-900 font-semibold">{activity.price} {activity.currency}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants ({Array.isArray(activity.participants) ? activity.participants.length : activity.participants})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {Array.isArray(activity.participants) && activity.participants.length > 0 ? (
                  (activity.participants as any[]).map((participant: any, index: number) => (
                    <div
                      key={participant.id || index}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                        {(participant.participant_nom_complet || participant.participant_nom || "Inconnu").charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {participant.participant_nom_complet || `${participant.participant_nom} ${participant.participant_prenom || ''}`}
                        </span>
                        <span className="text-xs text-gray-500">{participant.participant_type}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Aucun participant enregistré.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Gestion de présence */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="participants" className="space-y-6">
            <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <TabsList className="w-full justify-start h-auto bg-transparent p-0 border-b rounded-none space-x-2">
                <TabsTrigger
                  value="participants"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 text-muted-foreground hover:text-foreground data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Participants
                </TabsTrigger>
                <TabsTrigger
                  value="presence"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 text-muted-foreground hover:text-foreground data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all"
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Présence
                </TabsTrigger>
                <TabsTrigger
                  value="paiements"
                  disabled={activity.type !== 'payante'}
                  className="rounded-none border-b-2 border-transparent px-4 py-3 text-muted-foreground hover:text-foreground data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all disabled:opacity-50"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Paiements
                </TabsTrigger>
                <TabsTrigger
                  value="finances"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 text-muted-foreground hover:text-foreground data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Finances
                </TabsTrigger>
                <TabsTrigger
                  value="rapport"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 text-muted-foreground hover:text-foreground data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all"
                >
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  Rapport
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 text-muted-foreground hover:text-foreground data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Détails
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="participants">
              <UnifiedParticipantsView
                activiteId={activity.id}
                activiteNom={activity.title}
                activiteType={activity.type as any}
                montantRequis={activity.price}
                devise={activity.currency as "CDF" | "USD"}
              />
            </TabsContent>

            <TabsContent value="presence">
              <PresenceManager
                activiteId={activity.id}
                activiteNom={activity.title}
                dateActivite={new Date(activity.date)}
                heureFinActivite={activity.time}
              />
            </TabsContent>

            <TabsContent value="paiements">
              <div className="flex justify-end mb-4">
                <Button onClick={() => setIsPaymentDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Encaisser un paiement
                </Button>
              </div>
              <PaymentManager
                activiteId={activity.id}
                activiteNom={activity.title}
                dateActivite={new Date(activity.date)}
              />
            </TabsContent>

            <TabsContent value="finances">
              <div className="flex justify-end mb-4">
                <Button onClick={() => setIsExpenseDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une dépense
                </Button>
              </div>
              <ExpenseManager
                activiteId={activity.id}
                activiteNom={activity.title}
                totalPaiementsCollectes={0} // TODO: relier pour de vrai si possible ou laisser le composant gérer
                devisePaiements={activity.currency || "CDF"}
              />
            </TabsContent>

            <TabsContent value="rapport">
              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                Le rapport sera disponible une fois des données collectées.
              </div>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Description complète</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{activity.description}</p>
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
        onSuccess={loadActivity}
      />

      <AddPaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        activityId={activity.id}
        activityName={activity.title}
        defaultPrice={Number(activity.price)}
        defaultCurrency={activity.currency as "CDF" | "USD"}
        onSuccess={() => {
          loadActivity()
          // Une amélioration serait de trigger un refresh du PaymentManager aussi 
          // (souvent fait par un context ou un key change)
        }}
      />

      <AddExpenseDialog
        open={isExpenseDialogOpen}
        onOpenChange={setIsExpenseDialogOpen}
        activityId={activity.id}
        activityName={activity.title}
        onSuccess={() => {
          loadActivity()
        }}
      />
    </div>
  )
}
