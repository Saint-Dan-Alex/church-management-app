"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
import { paymentsService } from "@/lib/services/payments.service"
import { expensesService } from "@/lib/services"
import { toast } from "sonner"
import { useUser } from "@/hooks/use-user"
import { PermissionGuard } from "@/components/auth/permission-guard"

import { AddPaymentDialog } from "@/components/activities/add-payment-dialog"
import { AddExpenseDialog } from "@/components/activities/add-expense-dialog"
import { ManualPresenceForm } from "@/components/activities/manual-presence-form"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

export default function ActivityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const { can } = useUser()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [isPresenceDialogOpen, setIsPresenceDialogOpen] = useState(false)
  const [reportData, setReportData] = useState<{ payments: any[], expenses: any[] }>({ payments: [], expenses: [] })
  const [financeStats, setFinanceStats] = useState({ totalRecettes: 0, totalDepenses: 0 })

  // Extension de l'interface Activity pour inclure les relations si nécessaire
  // Note: le contrôleur Laravel load(['participants', ...]) donc activity aura ces champs peuplés
  // en plus des champs de base.

  useEffect(() => {
    loadActivity()
  }, [id])

  const loadActivity = async () => {
    try {
      setIsLoading(true)
      const data = await activitiesService.getById(id)
      setActivity(data)

      // Charger les données connexes si l'utilisateur a les droits de lecture (sinon ça plantera ou sera vide)
      if (can('paiements.read') || can('depenses.read')) {
        const [paymentsResp, expensesResp] = await Promise.all([
          can('paiements.read') ? paymentsService.getAll(id) : Promise.resolve([]),
          can('depenses.read') ? expensesService.getAll({ activity_id: id }) : Promise.resolve([])
        ])

        const rawPayments = Array.isArray(paymentsResp) ? paymentsResp : (paymentsResp as any).data || []
        const rawExpenses = Array.isArray(expensesResp) ? expensesResp : (expensesResp as any).data || []

        // Mapping pour ActivityReport
        const payments = rawPayments.map((p: any) => ({
          ...p,
          id: p.id,
          montantPaye: parseFloat(String(p.montant || 0)),
          devise: p.devise,
          participantNomComplet: p.participant_nom_complet || p.participant_nom || "Inconnu",
          statut: p.statut
        }))

        const expenses = rawExpenses.map((e: any) => ({
          ...e,
          montant: parseFloat(String(e.montant || 0)),
          date: e.date
        }))

        setReportData({ payments, expenses })

        // Calculer les totaux
        const totalRecettes = payments.reduce((sum: number, p: any) => sum + p.montantPaye, 0)
        const totalDepenses = expenses.reduce((sum: number, e: any) => sum + e.montant, 0)
        setFinanceStats({ totalRecettes, totalDepenses })
      }

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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        {/* Ligne du haut : Bouton retour + Actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.push('/activities')} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">

            {can('presences.create') && (
              <Link href={`/kiosk/activities/${activity.id}/scan`} target="_blank">
                <Button variant="outline" size="sm" className="hidden sm:flex text-xs sm:text-sm">
                  <QrCode className="h-4 w-4 mr-2" />
                  Scanner
                </Button>
              </Link>
            )}

            {can('activites.update') && (
              <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)} className="text-xs sm:text-sm">
                <Edit className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Modifier</span>
              </Button>
            )}

            {can('activites.delete') && (
              <Button variant="destructive" size="sm" onClick={handleDelete} className="text-xs sm:text-sm">
                <Trash2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Supprimer</span>
              </Button>
            )}
          </div>
        </div>

        {/* Titre et informations */}
        <div className="space-y-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 leading-tight break-words">
            {activity.title}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`${getTypeBadge(activity.type)} text-xs sm:text-sm`}>
              {activity.type === 'libre' ? 'Libre' : 'Payante'}
            </Badge>
            <Badge className={`${getStatutBadge(activity.status)} text-xs sm:text-sm`}>
              {getStatusLabel(activity.status)}
            </Badge>
            <Badge variant="outline" className="text-gray-600 border-gray-300 text-xs sm:text-sm">
              {activity.category}
            </Badge>
          </div>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{activity.description}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Colonne gauche - Infos de l'activité */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Date</p>
                  <p className="text-sm sm:text-base text-gray-900 break-words">
                    {formatDate(activity.date)}
                    {activity.end_date && activity.end_date !== activity.date && (
                      <span className="block text-xs sm:text-sm text-gray-500">au {formatDate(activity.end_date)}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Horaire</p>
                  <p className="text-sm sm:text-base text-gray-900">
                    {activity.time} ({activity.duration})
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Lieu</p>
                  <p className="text-sm sm:text-base text-gray-900 break-words">{activity.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Responsable</p>
                  <p className="text-sm sm:text-base text-gray-900 break-words">{activity.organizer}</p>
                </div>
              </div>
              {activity.price && parseFloat(activity.price.toString()) > 0 && (
                <div className="flex items-start gap-3">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Prix</p>
                    <p className="text-sm sm:text-base text-gray-900 font-semibold">{activity.price} {activity.currency}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                Participants ({Array.isArray(activity.participants) ? activity.participants.length : activity.participants})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[250px] sm:max-h-[300px] overflow-y-auto">
                {Array.isArray(activity.participants) && activity.participants.length > 0 ? (
                  (activity.participants as any[]).map((participant: any, index: number) => (
                    <div
                      key={participant.id || index}
                      className="flex items-center gap-2 sm:gap-3 p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs sm:text-sm shrink-0">
                        {(participant.participant_nom_complet || participant.participant_nom || "Inconnu").charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {participant.participant_nom_complet || `${participant.participant_nom} ${participant.participant_prenom || ''}`}
                        </span>
                        <span className="text-xs text-gray-500">{participant.participant_type}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs sm:text-sm text-gray-500 text-center py-4">Aucun participant enregistré.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Gestion de présence */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="participants" className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto pb-2 -mx-2 sm:-mx-4 px-2 sm:px-4 scrollbar-hide">
              <TabsList className="inline-flex min-w-max w-auto justify-start h-auto bg-transparent p-0 border-b rounded-none gap-1 sm:gap-2">
                <TabsTrigger
                  value="participants"
                  className="rounded-none border-b-2 border-transparent px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all whitespace-nowrap"
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Participants</span>
                </TabsTrigger>

                <TabsTrigger
                  value="presence"
                  className="rounded-none border-b-2 border-transparent px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all whitespace-nowrap"
                >
                  <QrCode className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Présence</span>
                </TabsTrigger>

                {/* Onglet Paiements - Visible seulement si payante et permission */}
                {activity.type === 'payante' && can('paiements.read') && (
                  <TabsTrigger
                    value="paiements"
                    className="rounded-none border-b-2 border-transparent px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all whitespace-nowrap"
                  >
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Paiements</span>
                  </TabsTrigger>
                )}

                {/* Onglet Finances (Dépenses) - Visible seulement si permission */}
                {can('depenses.read') && (
                  <TabsTrigger
                    value="finances"
                    className="rounded-none border-b-2 border-transparent px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all whitespace-nowrap"
                  >
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Finances</span>
                  </TabsTrigger>
                )}

                {/* Onglet Rapport - Visible seulement si permission view report */}
                {can('reports.view') && (
                  <TabsTrigger
                    value="rapport"
                    className="rounded-none border-b-2 border-transparent px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all whitespace-nowrap"
                  >
                    <FileTextIcon className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Rapport</span>
                  </TabsTrigger>
                )}

                <TabsTrigger
                  value="details"
                  className="rounded-none border-b-2 border-transparent px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all whitespace-nowrap"
                >
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Détails</span>
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
                participants={Array.isArray(activity.participants) ? activity.participants : []}
                onManualPresenceClick={() => setIsPresenceDialogOpen(true)}
              />
            </TabsContent>

            {activity.type === 'payante' && can('paiements.read') && (
              <TabsContent value="paiements">
                <div className="flex justify-end mb-3 sm:mb-4">
                  {can('paiements.create') && (
                    <Button onClick={() => setIsPaymentDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm w-full sm:w-auto">
                      <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Encaisser un paiement
                    </Button>
                  )}
                </div>
                <PaymentManager
                  activiteId={activity.id}
                  activiteNom={activity.title}
                  dateActivite={new Date(activity.date)}
                />
              </TabsContent>
            )}

            {can('depenses.read') && (
              <TabsContent value="finances">
                <div className="flex justify-end mb-3 sm:mb-4">
                  {can('depenses.create') && (
                    <Button onClick={() => setIsExpenseDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm w-full sm:w-auto">
                      <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Ajouter une dépense
                    </Button>
                  )}
                </div>
                <ExpenseManager
                  activiteId={activity.id}
                  activiteNom={activity.title}
                  totalPaiementsCollectes={0}
                  devisePaiements={activity.currency || "CDF"}
                />
              </TabsContent>
            )}

            {can('reports.view') && (
              <TabsContent value="rapport">
                <ActivityReport
                  activite={{
                    id: activity.id,
                    titre: activity.title,
                    description: activity.description || "",
                    date: activity.date,
                    dateFin: activity.end_date,
                    heureDebut: activity.time.split(' - ')[0] || activity.time,
                    heureFin: activity.time.split(' - ')[1] || "",
                    lieu: activity.location,
                    type: activity.type,
                    statut: activity.status,
                    responsable: activity.organizer
                  }}
                  presences={(Array.isArray(activity.participants) ? activity.participants : []).map((p: any) => ({
                    id: p.id,
                    activiteId: activity.id,
                    activiteNom: activity.title,
                    moniteurId: p.participant_id || p.id,
                    moniteurNom: p.participant_nom || "",
                    moniteurPrenom: p.participant_prenom || "",
                    moniteurNomComplet: p.participant_nom_complet || `${p.participant_nom || ''} ${p.participant_prenom || ''}`.trim(),
                    datePresence: new Date(),
                    heureArrivee: p.heure_arrivee || "",
                    statut: (p.statut_presence || (p.est_present ? 'present' : 'absent')) as any,
                    modeEnregistrement: (p.ajoute_via === 'automatique' ? 'auto' : 'manuel') as any,
                    createdAt: new Date(),
                    updatedAt: new Date()
                  }))}
                  payments={reportData.payments}
                  expenses={reportData.expenses}
                  paymentStats={{
                    totalParticipants: activity.participants?.length || 0,
                    totalPaye: financeStats.totalRecettes,
                    totalAttendus: (activity.participants?.length || 0) * (Number(activity.price) || 0),
                    totalRestant: Math.max(0, (activity.participants?.length || 0) * (Number(activity.price) || 0) - financeStats.totalRecettes),
                    nombrePaiesComplet: (activity.participants as any[] || []).filter((p: any) =>
                      p.statut_paiement === 'paid' || parseFloat(String(p.montant_paye || 0)) >= (Number(activity.price) || 0)
                    ).length,
                    nombrePaiesPartiel: (activity.participants as any[] || []).filter((p: any) =>
                      p.statut_paiement === 'partial' || (parseFloat(String(p.montant_paye || 0)) > 0 && parseFloat(String(p.montant_paye || 0)) < (Number(activity.price) || 0))
                    ).length,
                    nombreEnAttente: (activity.participants as any[] || []).filter((p: any) =>
                      !p.montant_paye || parseFloat(String(p.montant_paye || 0)) === 0
                    ).length,
                    nombreEnRetard: 0,
                    tauxPaiement: activity.participants?.length ? Math.round(((activity.participants as any[]).filter((p: any) => parseFloat(String(p.montant_paye || 0)) > 0).length / activity.participants.length) * 100) : 0
                  }}
                  paymentConfig={{
                    montantRequis: Number(activity.price) || 0,
                    devise: activity.currency || "CDF"
                  }}
                />
              </TabsContent>
            )}

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
        }}
      />

      <AddExpenseDialog
        open={isExpenseDialogOpen}
        onOpenChange={setIsExpenseDialogOpen}
        activityId={activity.id}
        activityName={activity.title}
        maxAuthorizedAmount={financeStats.totalRecettes - financeStats.totalDepenses}
        onSuccess={() => {
          loadActivity()
        }}
      />

      <Dialog open={isPresenceDialogOpen} onOpenChange={setIsPresenceDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0">
          <DialogTitle className="px-6 py-4 border-b">Faire l'appel - {activity.title}</DialogTitle>
          <ManualPresenceForm
            activiteId={activity.id}
            activiteNom={activity.title}
            participants={Array.isArray(activity.participants) ? activity.participants : []}
            onClose={() => setIsPresenceDialogOpen(false)}
            onSuccess={() => {
              loadActivity()
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
