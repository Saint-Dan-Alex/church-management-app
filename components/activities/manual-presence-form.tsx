"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import type { Presence } from "@/types/presence"

interface ManualPresenceFormProps {
  activiteId: string
  activiteNom: string
  heureFinActivite?: string
  onClose: () => void
}

// Données mockées des moniteurs
const moniteursDisponibles = [
  { id: "1", nom: "LENGE", prenom: "Marie", nomComplet: "Marie LENGE" },
  { id: "2", nom: "NGEA", prenom: "Paul", nomComplet: "Paul NGEA" },
  { id: "3", nom: "NFEO", prenom: "Jean", nomComplet: "Jean NFEO" },
  { id: "4", nom: "JEMMA", prenom: "Sarah", nomComplet: "Sarah JEMMA" },
  { id: "5", nom: "CHRISTIAN", prenom: "Marc", nomComplet: "Marc CHRISTIAN" },
  { id: "6", nom: "MUKEBA", prenom: "David", nomComplet: "David MUKEBA" },
]

export function ManualPresenceForm({ activiteId, activiteNom, heureFinActivite, onClose }: ManualPresenceFormProps) {
  const [selectedMoniteurs, setSelectedMoniteurs] = useState<string[]>([])
  const [formData, setFormData] = useState<{
    [key: string]: {
      heureArrivee: string
      heureDepart: string
      statut: "present" | "absent" | "retard" | "excuse"
      remarque: string
    }
  }>({})

  const handleMoniteurToggle = (moniteurId: string) => {
    if (selectedMoniteurs.includes(moniteurId)) {
      setSelectedMoniteurs(selectedMoniteurs.filter((id) => id !== moniteurId))
      const newFormData = { ...formData }
      delete newFormData[moniteurId]
      setFormData(newFormData)
    } else {
      setSelectedMoniteurs([...selectedMoniteurs, moniteurId])
      setFormData({
        ...formData,
        [moniteurId]: {
          heureArrivee: new Date().toTimeString().slice(0, 5),
          heureDepart: heureFinActivite || "",
          statut: "present",
          remarque: "",
        },
      })
    }
  }

  const handleFieldChange = (
    moniteurId: string,
    field: keyof typeof formData[string],
    value: string
  ) => {
    setFormData({
      ...formData,
      [moniteurId]: {
        ...formData[moniteurId],
        [field]: value,
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Présences enregistrées:", {
      activiteId,
      moniteurs: selectedMoniteurs.map((id) => ({
        moniteurId: id,
        ...formData[id],
      })),
    })
    // TODO: Enregistrer dans la base de données
    onClose()
  }

  return (
    <form onSubmit={handleSubmit}>
      <ScrollArea className="max-h-[60vh] pr-4">
        <div className="space-y-6">
          {/* Sélection des moniteurs */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Sélectionner les moniteurs présents</Label>
            <div className="space-y-2">
              {moniteursDisponibles.map((moniteur) => (
                <div
                  key={moniteur.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Checkbox
                    id={`moniteur-${moniteur.id}`}
                    checked={selectedMoniteurs.includes(moniteur.id)}
                    onCheckedChange={() => handleMoniteurToggle(moniteur.id)}
                  />
                  <Label
                    htmlFor={`moniteur-${moniteur.id}`}
                    className="flex-1 cursor-pointer font-medium"
                  >
                    {moniteur.nomComplet}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Détails pour chaque moniteur sélectionné */}
          {selectedMoniteurs.length > 0 && (
            <div className="space-y-6 border-t pt-6">
              <h4 className="font-semibold text-gray-900">Détails de présence</h4>
              {selectedMoniteurs.map((moniteurId) => {
                const moniteur = moniteursDisponibles.find((m) => m.id === moniteurId)
                if (!moniteur) return null

                return (
                  <div key={moniteurId} className="p-4 bg-blue-50 rounded-lg space-y-4 border-l-4 border-blue-500">
                    <h5 className="font-semibold text-blue-900">{moniteur.nomComplet}</h5>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor={`heure-arrivee-${moniteurId}`}>Heure d'arrivée *</Label>
                        <Input
                          id={`heure-arrivee-${moniteurId}`}
                          type="time"
                          value={formData[moniteurId]?.heureArrivee || ""}
                          onChange={(e) =>
                            handleFieldChange(moniteurId, "heureArrivee", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`heure-depart-${moniteurId}`}>Heure de départ</Label>
                        <Input
                          id={`heure-depart-${moniteurId}`}
                          type="time"
                          value={formData[moniteurId]?.heureDepart || ""}
                          onChange={(e) =>
                            handleFieldChange(moniteurId, "heureDepart", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Statut *</Label>
                      <RadioGroup
                        value={formData[moniteurId]?.statut || "present"}
                        onValueChange={(value) =>
                          handleFieldChange(moniteurId, "statut", value)
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="present" id={`present-${moniteurId}`} />
                          <Label htmlFor={`present-${moniteurId}`} className="cursor-pointer">
                            Présent
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="retard" id={`retard-${moniteurId}`} />
                          <Label htmlFor={`retard-${moniteurId}`} className="cursor-pointer">
                            En retard
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="excuse" id={`excuse-${moniteurId}`} />
                          <Label htmlFor={`excuse-${moniteurId}`} className="cursor-pointer">
                            Excusé
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`remarque-${moniteurId}`}>Remarque</Label>
                      <Textarea
                        id={`remarque-${moniteurId}`}
                        value={formData[moniteurId]?.remarque || ""}
                        onChange={(e) =>
                          handleFieldChange(moniteurId, "remarque", e.target.value)
                        }
                        placeholder="Commentaires ou observations..."
                        rows={2}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2 mt-6 border-t pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Annuler
        </Button>
        <Button type="submit" disabled={selectedMoniteurs.length === 0} className="flex-1">
          Enregistrer {selectedMoniteurs.length > 0 && `(${selectedMoniteurs.length})`}
        </Button>
      </div>
    </form>
  )
}
