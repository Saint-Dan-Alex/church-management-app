"use client"

import type React from "react"
import { useState, useEffect } from "react"
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

interface Activity {
  id: string
  titre: string
  description: string
  date: Date
  heureDebut: string
  heureFin: string
  lieu: string
  type: string
  statut: string
  responsable: string
}

interface EditActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity: Activity
}

export function EditActivityDialog({ open, onOpenChange, activity }: EditActivityDialogProps) {
  const [formData, setFormData] = useState({
    titre: activity.titre,
    description: activity.description,
    date: activity.date instanceof Date ? activity.date.toISOString().split('T')[0] : activity.date,
    heureDebut: activity.heureDebut,
    heureFin: activity.heureFin,
    lieu: activity.lieu,
    type: activity.type,
    responsable: activity.responsable,
  })

  // Réinitialiser le formulaire quand l'activité change
  useEffect(() => {
    setFormData({
      titre: activity.titre,
      description: activity.description,
      date: activity.date instanceof Date ? activity.date.toISOString().split('T')[0] : activity.date,
      heureDebut: activity.heureDebut,
      heureFin: activity.heureFin,
      lieu: activity.lieu,
      type: activity.type,
      responsable: activity.responsable,
    })
  }, [activity])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Activité mise à jour:", formData)
    // TODO: Enregistrer dans la base de données
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Modifier l'Activité</DialogTitle>
          <DialogDescription>Modifiez les informations de l'activité</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid gap-2">
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Réunion des moniteurs"
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
            <div className="grid gap-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="heureDebut">Heure de début *</Label>
                <Input
                  id="heureDebut"
                  type="time"
                  value={formData.heureDebut}
                  onChange={(e) => setFormData({ ...formData, heureDebut: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="heureFin">Heure de fin *</Label>
                <Input
                  id="heureFin"
                  type="time"
                  value={formData.heureFin}
                  onChange={(e) => setFormData({ ...formData, heureFin: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type d'activité</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reunion">Réunion</SelectItem>
                    <SelectItem value="formation">Formation</SelectItem>
                    <SelectItem value="culte">Culte</SelectItem>
                    <SelectItem value="sortie">Sortie</SelectItem>
                    <SelectItem value="priere">Prière</SelectItem>
                    <SelectItem value="louange">Louange</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lieu">Lieu</Label>
                <Select
                  value={formData.lieu}
                  onValueChange={(value) => setFormData({ ...formData, lieu: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salle principale">Salle Principale</SelectItem>
                    <SelectItem value="Salle Enfants">Salle Enfants</SelectItem>
                    <SelectItem value="Salle Jeunesse">Salle Jeunesse</SelectItem>
                    <SelectItem value="Salle de Réunion">Salle de Réunion</SelectItem>
                    <SelectItem value="Extérieur">Extérieur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="responsable">Responsable *</Label>
              <Input
                id="responsable"
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                placeholder="Nom du responsable"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer les modifications</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
