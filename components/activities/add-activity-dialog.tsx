"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import type { ActivityType } from "@/types/activity"

interface AddActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddActivityDialog({ open, onOpenChange }: AddActivityDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "gratuite" as ActivityType,
    date: "",
    time: "",
    duration: "",
    location: "",
    category: "",
    maxParticipants: "",
    organizer: "",
    // Champs pour activité payante
    montantRequis: "",
    devise: "CDF" as "CDF" | "USD",
    montantAlternatif: "",
    deviseAlternative: "USD" as "CDF" | "USD",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Activity created:", formData)
    onOpenChange(false)
    setFormData({
      title: "",
      description: "",
      type: "gratuite" as ActivityType,
      date: "",
      time: "",
      duration: "",
      location: "",
      category: "",
      maxParticipants: "",
      organizer: "",
      montantRequis: "",
      devise: "CDF" as "CDF" | "USD",
      montantAlternatif: "",
      deviseAlternative: "USD" as "CDF" | "USD",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Activité</DialogTitle>
          <DialogDescription>Créez une nouvelle activité ou événement</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="École du Dimanche"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de l'activité..."
                rows={3}
              />
            </div>

            {/* Type d'activité */}
            <div className="grid gap-2 border-t pt-4">
              <Label>Type d'activité *</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value: ActivityType) => setFormData({ ...formData, type: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="gratuite" id="gratuite" />
                  <Label htmlFor="gratuite" className="font-normal cursor-pointer flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      🎉 Gratuite
                    </Badge>
                    <span className="text-sm text-gray-600">Accès libre</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="payante" id="payante" />
                  <Label htmlFor="payante" className="font-normal cursor-pointer flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                      💰 Payante
                    </Badge>
                    <span className="text-sm text-gray-600">Paiement requis</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Configuration paiement (si payante) */}
            {formData.type === "payante" && (
              <div className="grid gap-4 border rounded-lg p-4 bg-blue-50">
                <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                  💳 Configuration du paiement
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="montantRequis">Montant requis *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="montantRequis"
                        type="number"
                        value={formData.montantRequis}
                        onChange={(e) => setFormData({ ...formData, montantRequis: e.target.value })}
                        placeholder="10000"
                        required={formData.type === "payante"}
                        min="0"
                      />
                      <Select
                        value={formData.devise}
                        onValueChange={(value: "CDF" | "USD") => setFormData({ ...formData, devise: value })}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CDF">CDF</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="montantAlternatif">Montant alternatif</Label>
                    <div className="flex gap-2">
                      <Input
                        id="montantAlternatif"
                        type="number"
                        value={formData.montantAlternatif}
                        onChange={(e) => setFormData({ ...formData, montantAlternatif: e.target.value })}
                        placeholder="6"
                        min="0"
                      />
                      <Select
                        value={formData.deviseAlternative}
                        onValueChange={(value: "CDF" | "USD") => setFormData({ ...formData, deviseAlternative: value })}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CDF">CDF</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-blue-700">
                  💡 Les participants seront automatiquement ajoutés lorsqu'ils paient ou scannent le QR Code
                </p>
              </div>
            )}

            {formData.type === "gratuite" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  💡 Les participants seront automatiquement ajoutés lorsqu'ils scannent le QR Code
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Heure</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Durée</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30min">30 minutes</SelectItem>
                    <SelectItem value="1h">1 heure</SelectItem>
                    <SelectItem value="1h30">1h30</SelectItem>
                    <SelectItem value="2h">2 heures</SelectItem>
                    <SelectItem value="3h">3 heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enfants">Enfants</SelectItem>
                    <SelectItem value="jeunesse">Jeunesse</SelectItem>
                    <SelectItem value="priere">Prière</SelectItem>
                    <SelectItem value="louange">Louange</SelectItem>
                    <SelectItem value="reunion">Réunion</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Lieu</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principale">Salle Principale</SelectItem>
                    <SelectItem value="enfants">Salle Enfants</SelectItem>
                    <SelectItem value="jeunesse">Salle Jeunesse</SelectItem>
                    <SelectItem value="reunion">Salle de Réunion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxParticipants">Participants max</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  placeholder="50"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="organizer">Organisateur</Label>
              <Input
                id="organizer"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                placeholder="Nom de l'organisateur"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Créer l'Activité</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
