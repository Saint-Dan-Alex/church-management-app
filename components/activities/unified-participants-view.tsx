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
import { childrenService } from "@/lib/services/children.service"
import { monitorsService } from "@/lib/services/monitors.service"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

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

  // -- State Hooks (must be at top level) --
  const [participants, setParticipants] = useState<UnifiedParticipant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // New hooks for Add Participant
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [people, setPeople] = useState<Array<{ id: string, nom: string, type: 'enfant' | 'moniteur' | 'visiteur' }>>([])
  const [selectedPersonName, setSelectedPersonName] = useState("")
  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // Load people for combo box
  useEffect(() => {
    loadPeople()
  }, [])

  const loadPeople = async () => {
    try {
      const [children, monitors] = await Promise.all([
        childrenService.getAll(),
        monitorsService.getAll()
      ])

      const childrenData = Array.isArray(children) ? children : (children as any).data || []
      const monitorsData = Array.isArray(monitors) ? monitors : (monitors as any).data || []

      const allPeople = [
        ...childrenData.map((c: any) => ({ id: c.id, nom: `${c.prenom} ${c.nom}`, type: 'enfant' as const })),
        ...monitorsData.map((m: any) => ({ id: m.id, nom: m.nom, type: 'moniteur' as const }))
      ]
      setPeople(allPeople)
    } catch (e) {
      console.error("Erreur chargement personnes", e)
    }
  }

  // Handle Add Participant Logic
  const handleAddParticipant = async () => {
    if (!selectedPersonName) return

    try {
      setIsAdding(true)
      const existingPerson = people.find(p => p.nom === selectedPersonName)

      const payload: any = {
        participant_type: existingPerson ? existingPerson.type : 'visiteur',
        participant_nom: "",
        participant_prenom: "",
        participant_id: existingPerson ? existingPerson.id : null,
      }

      if (!existingPerson) {
        const parts = selectedPersonName.split(' ')
        payload.participant_prenom = parts[0] || ""
        payload.participant_nom = parts.slice(1).join(' ') || parts[0] || ""
        if (parts.length === 1) payload.participant_prenom = ""
      } else {
        const parts = existingPerson.nom.split(' ')
        payload.participant_prenom = parts[0] || ""
        payload.participant_nom = parts.slice(1).join(' ') || parts[0] || ""
      }

      await activitiesService.addParticipant(activiteId, payload)

      toast({
        title: "Succès",
        description: "Participant ajouté avec succès"
      })
      setIsAddOpen(false)
      setSelectedPersonName("")
      loadParticipants()
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.response?.data?.message || "Impossible d'ajouter le participant",
        variant: "destructive"
      })
    } finally {
      setIsAdding(false)
    }
  }

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
            <div className="flex gap-2">
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter un participant</DialogTitle>
                    <DialogDescription>
                      Sélectionnez un enfant, un moniteur ou saisissez un nom pour un visiteur.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Personne</Label>
                      <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={comboboxOpen}
                            className="w-full justify-between"
                          >
                            {selectedPersonName || "Rechercher ou saisir un nom..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Rechercher..." onValueChange={(val) => {
                              if (!people.find(p => p.nom.toLowerCase() === val.toLowerCase()) && val) {
                                // Logic override if needed
                              }
                            }} />
                            <CommandEmpty>
                              <div className="p-2 text-sm text-center">
                                Personne non trouvée.
                                <Button variant="link" size="sm" onClick={() => {
                                  setSelectedPersonName("Nouveau Visiteur") // Placeholder logic fix
                                }}>
                                  Utiliser comme visiteur
                                </Button>
                              </div>
                            </CommandEmpty>
                            <CommandGroup className="max-h-[200px] overflow-auto">
                              {people.map((person) => (
                                <CommandItem
                                  key={person.id + person.type}
                                  value={person.nom}
                                  onSelect={(currentValue) => {
                                    setSelectedPersonName(currentValue === selectedPersonName ? "" : currentValue)
                                    setComboboxOpen(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedPersonName === person.nom ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {person.nom}
                                  <span className="ml-auto text-xs text-muted-foreground capitalize">{person.type}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-muted-foreground">
                        Recherchez un membre ou saisissez un nom.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddParticipant} disabled={isAdding || !selectedPersonName}>
                      {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Ajouter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button size="sm" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
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
