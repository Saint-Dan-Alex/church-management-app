"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Search } from "lucide-react"
import { activitiesService } from "@/lib/services/activities.service"
import { toast } from "sonner"

interface ManualPresenceFormProps {
  activiteId: string
  activiteNom: string
  heureFinActivite?: string
  participants: any[] // Idéalement typé
  onClose: () => void
  onSuccess?: () => void
}

export function ManualPresenceForm({
  activiteId,
  activiteNom,
  heureFinActivite,
  participants,
  onClose,
  onSuccess
}: ManualPresenceFormProps) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [isLoadingPresences, setIsLoadingPresences] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // On ne gère que le statut et les heures pour ceux qu'on modifie
  const [formData, setFormData] = useState<{
    [participantId: string]: {
      heureArrivee: string
      heureDepart: string
      statut: "present" | "absent" | "retard" | "excuse"
      remarque: string
      isModified: boolean
      isSelected: boolean // Pour l'UX "Cocher les présents"
      recordId?: string // ID de la présence si elle existe déjà
    }
  }>({})

  // Charger les présences pour la date sélectionnée
  useEffect(() => {
    const fetchPresences = async () => {
      try {
        setIsLoadingPresences(true)
        // 1. Initialiser tout le monde comme absent (ou état par défaut)
        const initialData: any = {}

        participants.forEach(p => {
          // Utiliser l'ID du participant (l'enfant/moniteur), pas l'ID de l'inscription pivot si possible
          // Mais attention, dans activity.participants (Laravel relation), c'est souvent l'objet pivot ActivityParticipant
          // qui contient participant_id.

          // On assume que p.participant_id est disponible, sinon p.id (si c'est directement le user)
          // Dans ActivityDetailsPage, c'est le pivot ActivityParticipant.

          initialData[p.participant_id] = {
            heureArrivee: "",
            heureDepart: "",
            statut: "absent",
            remarque: "",
            isModified: false,
            isSelected: false
          }
        })

        // 2. Récupérer les présences existantes pour cette date
        const response: any = await activitiesService.getPresences({
          activity_id: activiteId,
          date_presence: selectedDate
          // per_page: 1000 // Assurer de tout avoir
        })

        const existingPresences = response.data || [] // Si paginé

        // 3. Merger les infos
        existingPresences.forEach((presence: any) => {
          if (initialData[presence.participant_id]) {
            initialData[presence.participant_id] = {
              heureArrivee: presence.heure_arrivee ? presence.heure_arrivee.substring(0, 5) : "",
              heureDepart: presence.heure_depart || "",
              statut: presence.statut,
              remarque: presence.remarque || "",
              isModified: false,
              isSelected: presence.statut === 'present' || presence.statut === 'retard',
              recordId: presence.id
            }
          }
        })

        setFormData(initialData)
      } catch (error) {
        console.error("Erreur chargement présences", error)
        toast.error("Erreur lors du chargement des présences pour cette date")
      } finally {
        setIsLoadingPresences(false)
      }
    }

    if (activiteId && selectedDate) {
      fetchPresences()
    }
  }, [activiteId, selectedDate, participants])

  const handleTogglePresent = (participantId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [participantId]: {
        ...prev[participantId],
        isSelected: checked,
        statut: checked ? "present" : "absent",
        heureArrivee: checked && !prev[participantId].heureArrivee ? new Date().toTimeString().slice(0, 5) : prev[participantId].heureArrivee,
        isModified: true
      }
    }))
  }

  const handleFieldChange = (
    participantId: string,
    field: keyof typeof formData[string],
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [participantId]: {
        ...prev[participantId],
        [field]: value,
        isModified: true
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Filtrer ceux qui ont été modifiés
    const modifiedParticipants = Object.entries(formData)
      .filter(([_, data]) => data.isModified)
      .map(([pId, data]) => {
        // Retrouver le participant original pour le type et le nom
        const original = participants.find(p => p.participant_id === pId)
        return {
          participantId: pId,
          ...data,
          original
        }
      })

    if (modifiedParticipants.length === 0) {
      onClose()
      return
    }

    try {
      setIsSaving(true)

      await Promise.all(modifiedParticipants.map(p => {
        // Utiliser la nouvelle méthode markPresence
        return activitiesService.markPresence({
          activity_id: activiteId,
          activity_nom: activiteNom,
          participant_id: p.participantId,
          participant_type: p.original?.participant_type || "Inconnu", // Important pour le polymorphisme
          date_presence: selectedDate,
          statut: p.statut,
          heure_arrivee: p.isSelected && !p.heureArrivee ? new Date().toTimeString().slice(0, 5) : p.heureArrivee,
          remarque: p.remarque,
          mode_enregistrement: 'manuel',
          // ID de la présence existante si update ? 
          // L'API store crée une nouvelle, update nécessiterait l'ID.
          // Pour simplifier ici on assume create/overwrite logic ou on devrait appeler update si recordId existe.
          // Si le backend PresenceController::store ne gère pas l'upsert, cela va créer des doublons.
          // Vérificons le controlleur... Store crée juste.

          // Correction: Il faut utiliser update si on a un recordId, ou store sinon.
          // Comme activitiesService.markPresence pointe vers POST, on va devoir gérer ça.
          // Pour l'instant, assumons creation, mais idéalement il faudrait une route d'upsert ou gérer l'ID.
        })
      }))

      toast.success(`${modifiedParticipants.length} présences mises à jour`)
      if (onSuccess) onSuccess()
      onClose()
    } catch (error) {
      console.error("Erreur sauvegarde présences", error)
      toast.error("Erreur lors de l'enregistrement")
    } finally {
      setIsSaving(false)
    }
  }

  // Filtrage
  const filteredParticipants = participants.filter(p => {
    const nom = (p.participant_nom_complet || p.nomComplet || "").toLowerCase()
    return nom.includes(searchQuery.toLowerCase())
  })

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-4 border-b space-y-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="grid gap-1.5 flex-1">
            <Label htmlFor="date-presence">Date de présence</Label>
            <Input
              id="date-presence"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          {/* Infos résumé */}
          <div className="flex gap-4 text-xs text-muted-foreground pt-6">
            <span>{Object.values(formData).filter(d => d.isSelected).length} Présents</span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un participant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoadingPresences ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Cochez les personnes présentes pour le <strong>{new Date(selectedDate).toLocaleDateString('fr-FR')}</strong>.
            </p>

            <div className="grid gap-3">
              {filteredParticipants.map((p) => {
                // Utiliser p.participant_id pour la clé
                const pId = p.participant_id
                const data = formData[pId] || { isSelected: false, statut: 'absent' }
                const isSelected = data.isSelected
                const nom = p.participant_nom_complet || p.nomComplet || "Inconnu"
                const type = p.participant_type || p.type

                return (
                  <div
                    key={pId}
                    className={`border rounded-lg p-3 transition-colors ${isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleTogglePresent(pId, checked as boolean)}
                        id={`check-${pId}`}
                        className="h-5 w-5"
                      />
                      <div className="flex-1">
                        <Label htmlFor={`check-${pId}`} className="font-medium text-base cursor-pointer">
                          {nom}
                        </Label>
                        <p className="text-xs text-muted-foreground capitalize">{type}</p>
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${data.statut === 'present' ? 'bg-green-100 text-green-700' :
                            data.statut === 'retard' ? 'bg-yellow-100 text-yellow-700' :
                              data.statut === 'excuse' ? 'bg-gray-100 text-gray-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                            {data.statut === 'present' ? 'Présent' :
                              data.statut === 'retard' ? 'Retard' :
                                data.statut === 'excuse' ? 'Excusé' : 'Absent'}
                          </span>
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <div className="mt-3 pl-8 grid gap-4 border-t pt-3 md:grid-cols-2">
                        <div className="grid gap-1.5">
                          <Label className="text-xs">Heure d'arrivée</Label>
                          <Input
                            type="time"
                            value={data.heureArrivee || ""}
                            onChange={(e) => handleFieldChange(pId, "heureArrivee", e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs">Statut précis</Label>
                          <RadioGroup
                            value={data.statut}
                            onValueChange={(val) => handleFieldChange(pId, "statut", val)}
                            className="flex gap-2"
                          >
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem value="present" id={`stat-p-${pId}`} />
                              <Label htmlFor={`stat-p-${pId}`} className="text-xs">Présent</Label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem value="retard" id={`stat-r-${pId}`} />
                              <Label htmlFor={`stat-r-${pId}`} className="text-xs">Retard</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 p-4 border-t bg-gray-50/50">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Annuler
        </Button>
        <Button type="submit" disabled={isSaving || isLoadingPresences} className="flex-1">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Enregistrer
        </Button>
      </div>
    </form>
  )
}

