"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
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
    }
  }>({})

  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    const initialData: any = {}
    participants.forEach(p => {
      // Mapping des données existantes
      const isPresent = p.est_present || p.estPresent || false
      const statut = p.statut_presence || p.statutPresence || (isPresent ? "present" : "absent")

      initialData[p.id] = {
        heureArrivee: p.heure_arrivee || p.heureArrivee || (isPresent ? new Date().toTimeString().slice(0, 5) : ""),
        heureDepart: p.heure_depart || "", // Si stocké
        statut: statut,
        remarque: p.remarque || "",
        isModified: false,
        isSelected: isPresent
      }
    })
    setFormData(initialData)
  }, [participants])

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
      .map(([id, data]) => ({
        id,
        ...data
      }))

    if (modifiedParticipants.length === 0) {
      onClose()
      return
    }

    try {
      setIsSaving(true)

      // Envoi séquentiel ou parallèle
      // Pour l'instant parallèle pour la performance
      await Promise.all(modifiedParticipants.map(p => {
        return activitiesService.updateParticipant(activiteId, p.id, {
          est_present: p.isSelected, // Le booléen principal
          statut_presence: p.statut,
          heure_arrivee: p.heureArrivee || null,
          // remarque: p.remarque // Si supporté par le backend
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

  // Grouping ou sorting: Moniteurs first?
  // Pour l'instant simple liste

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-[70vh]">
      <div className="px-4 py-2 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cochez les personnes présentes. Vous pouvez préciser le statut et l'heure en cliquant sur les détails.
          </p>

          <div className="grid gap-3">
            {filteredParticipants.map((p) => {
              const data = formData[p.id] || { isSelected: false, statut: 'absent' }
              const isSelected = data.isSelected
              const nom = p.participant_nom_complet || p.nomComplet || "Inconnu"
              const type = p.participant_type || p.type

              return (
                <div
                  key={p.id}
                  className={`border rounded-lg p-3 transition-colors ${isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleTogglePresent(p.id, checked as boolean)}
                      id={`check-${p.id}`}
                      className="h-5 w-5"
                    />
                    <div className="flex-1">
                      <Label htmlFor={`check-${p.id}`} className="font-medium text-base cursor-pointer">
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

                  {/* Détails étendus si sélectionné ou si on veut modifier - Pour l'instant on montre si sélectionné */}
                  {isSelected && (
                    <div className="mt-3 pl-8 grid gap-4 border-t pt-3 md:grid-cols-2">
                      <div className="grid gap-1.5">
                        <Label className="text-xs">Heure d'arrivée</Label>
                        <Input
                          type="time"
                          value={data.heureArrivee || ""}
                          onChange={(e) => handleFieldChange(p.id, "heureArrivee", e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-xs">Statut précis</Label>
                        <RadioGroup
                          value={data.statut}
                          onValueChange={(val) => handleFieldChange(p.id, "statut", val)}
                          className="flex gap-2"
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="present" id={`stat-p-${p.id}`} />
                            <Label htmlFor={`stat-p-${p.id}`} className="text-xs">Présent</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="retard" id={`stat-r-${p.id}`} />
                            <Label htmlFor={`stat-r-${p.id}`} className="text-xs">Retard</Label>
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
      </ScrollArea>

      <div className="flex gap-2 p-4 border-t bg-gray-50/50">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Annuler
        </Button>
        <Button type="submit" disabled={isSaving} className="flex-1">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Enregistrer
        </Button>
      </div>
    </form>
  )
}
