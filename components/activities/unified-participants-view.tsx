"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Loader2,
} from "lucide-react"
import type { ActivityType } from "@/types/activity"
import { activitiesService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"

interface UnifiedParticipant {
  id: string
  nom: string
  prenom: string
  nomComplet: string
  type: "enfant" | "moniteur"

  // Présence
  estPresent: boolean
  statutPresence?: "present" | "retard" | "absent"
  heureArrivee?: string

  // Paiement (si activité payante)
  aPaye: boolean
  montantPaye?: number
  montantRequis?: number
  statutPaiement?: "paid" | "partial" | "pending"

  // Méthode d'ajout
  ajouteVia: "inscription" | "presence" | "paiement" | "manuel"
}

interface UnifiedParticipantsViewProps {
  activiteId: string
  activiteNom: string
  activiteType: ActivityType
  montantRequis?: number
  devise?: "CDF" | "USD"
}

export function UnifiedParticipantsView({
  activiteId,
  activiteNom,
  activiteType,
  montantRequis,
  devise = "CDF",
}: UnifiedParticipantsViewProps) {
  const { toast } = useToast()
  const [participants, setParticipants] = useState<UnifiedParticipant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadParticipants()
  }, [activiteId])

  const loadParticipants = async () => {
    try {
      setLoading(true)
      setError(null)

      // Charger les participants de l'activité
      const data = await activitiesService.getParticipants(activiteId)
      setParticipants(Array.isArray(data) ? data : [])
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur de chargement des participants'
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les participants
  const filteredParticipants = participants.filter((p) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      p.nomComplet?.toLowerCase().includes(searchLower) ||
      p.nom?.toLowerCase().includes(searchLower) ||
      p.prenom?.toLowerCase().includes(searchLower)
    )
  })

  // Statistiques
  const stats = {
    total: participants.length,
    presents: participants.filter((p) => p.estPresent).length,
    absents: participants.filter((p) => !p.estPresent).length,
    payesComplet: participants.filter((p) => p.statutPaiement === "paid").length,
    payesPartiel: participants.filter((p) => p.statutPaiement === "partial").length,
    nonPayes: participants.filter((p) => !p.aPaye).length,
  }

  const formatCurrency = (montant: number) => {
    return `${montant.toLocaleString("fr-FR")} ${devise}`
  }

  const getStatutBadge = (participant: UnifiedParticipant) => {
    if (activiteType === "gratuite") {
      // Pour activité gratuite : juste le statut de présence
      if (participant.estPresent) {
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Présent
          </Badge>
        )
      }
      return (
        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
          <XCircle className="mr-1 h-3 w-3" />
          Absent
        </Badge>
      )
    }

    // Pour activité payante : combinaison présence + paiement
    const presenceIcon = participant.estPresent ? "✅" : "📝"
    const paiementIcon =
      participant.statutPaiement === "paid" ? "💰" :
        participant.statutPaiement === "partial" ? "🟡" : "⏳"

    let badgeColor = ""
    let statusText = ""

    if (participant.estPresent && participant.statutPaiement === "paid") {
      badgeColor = "bg-green-100 text-green-700 border-green-300"
      statusText = `${presenceIcon}${paiementIcon} Présent + Payé`
    } else if (participant.estPresent && participant.statutPaiement === "partial") {
      badgeColor = "bg-orange-100 text-orange-700 border-orange-300"
      statusText = `${presenceIcon}${paiementIcon} Présent + Partiel`
    } else if (participant.estPresent && !participant.aPaye) {
      badgeColor = "bg-yellow-100 text-yellow-700 border-yellow-300"
      statusText = `${presenceIcon}${paiementIcon} Présent + Non payé`
    } else if (!participant.estPresent && participant.statutPaiement === "paid") {
      badgeColor = "bg-blue-100 text-blue-700 border-blue-300"
      statusText = `${presenceIcon}${paiementIcon} Inscrit + Payé`
    } else if (!participant.estPresent && participant.statutPaiement === "partial") {
      badgeColor = "bg-orange-100 text-orange-700 border-orange-300"
      statusText = `${presenceIcon}${paiementIcon} Inscrit + Partiel`
    } else {
      badgeColor = "bg-gray-100 text-gray-700 border-gray-300"
      statusText = `${presenceIcon}${paiementIcon} Inscrit + Non payé`
    }

    return (
      <Badge variant="outline" className={badgeColor}>
        {statusText}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Chargement des participants...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadParticipants} variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Participants</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.presents} présents • {stats.absents} absents
                </p>
              </div>
              <Users className="h-10 w-10 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        {activiteType === "payante" && (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">Paiements complets</p>
                    <p className="text-3xl font-bold text-green-900">{stats.payesComplet}</p>
                    <p className="text-xs text-green-600 mt-1">Montant total</p>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700">Paiements partiels</p>
                    <p className="text-3xl font-bold text-orange-900">{stats.payesPartiel}</p>
                    <p className="text-xs text-orange-600 mt-1">+ {stats.nonPayes} non payés</p>
                  </div>
                  <AlertCircle className="h-10 w-10 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Liste des participants */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Liste des Participants ({filteredParticipants.length})
            </CardTitle>
            <Button size="sm" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Barre de recherche */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher un participant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Liste */}
          <div className="space-y-3">
            {filteredParticipants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucun participant trouvé</p>
              </div>
            ) : (
              filteredParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold">
                        {participant.prenom?.charAt(0)}
                        {participant.nom?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{participant.nomComplet}</p>
                        <p className="text-sm text-gray-600">
                          {participant.type === "enfant" ? "Enfant" : "Moniteur"}
                          {participant.heureArrivee && ` • Arrivé à ${participant.heureArrivee}`}
                          {participant.ajouteVia && (
                            <span className="text-xs text-gray-500 ml-1">
                              (via {participant.ajouteVia})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {activiteType === "payante" && participant.montantPaye !== undefined && (
                      <div className="ml-13 text-sm text-gray-600">
                        Payé : {formatCurrency(participant.montantPaye)} / {formatCurrency(participant.montantRequis || 0)}
                        {participant.statutPaiement === "partial" && (
                          <span className="text-orange-600 ml-2">
                            (Reste : {formatCurrency((participant.montantRequis || 0) - participant.montantPaye)})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatutBadge(participant)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
