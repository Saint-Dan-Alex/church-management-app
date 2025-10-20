"use client"

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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"
import type { Salle, MoniteurSalle } from "@/types/salle"

interface EditSalleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  salle: Salle
}

// Données mockées des moniteurs disponibles
const moniteursDisponibles = [
  { id: "1", nom: "LENGE", prenom: "Marie", nomComplet: "Marie LENGE" },
  { id: "2", nom: "NGEA", prenom: "Paul", nomComplet: "Paul NGEA" },
  { id: "3", nom: "NFEO", prenom: "Jean", nomComplet: "Jean NFEO" },
  { id: "4", nom: "JEMMA", prenom: "Sarah", nomComplet: "Sarah JEMMA" },
  { id: "5", nom: "CHRISTIAN", prenom: "Marc", nomComplet: "Marc CHRISTIAN" },
  { id: "6", nom: "MUKEBA", prenom: "David", nomComplet: "David MUKEBA" },
]

export function EditSalleDialog({ open, onOpenChange, salle }: EditSalleDialogProps) {
  const [formData, setFormData] = useState<Partial<Salle>>({
    nom: salle.nom,
    description: salle.description,
    capacite: salle.capacite,
    responsableId: salle.responsableId,
    adjointId: salle.adjointId,
    moniteurs: salle.moniteurs,
    actif: salle.actif,
  })

  const [moniteursSelectionnes, setMoniteursSelectionnes] = useState<string[]>(
    salle.moniteurs.map(m => m.id)
  )

  // Réinitialiser le formulaire quand la salle change
  useEffect(() => {
    setFormData({
      nom: salle.nom,
      description: salle.description,
      capacite: salle.capacite,
      responsableId: salle.responsableId,
      adjointId: salle.adjointId,
      moniteurs: salle.moniteurs,
      actif: salle.actif,
    })
    setMoniteursSelectionnes(salle.moniteurs.map(m => m.id))
  }, [salle])

  const handleMoniteurToggle = (moniteurId: string) => {
    if (moniteursSelectionnes.includes(moniteurId)) {
      setMoniteursSelectionnes(moniteursSelectionnes.filter((id) => id !== moniteurId))
      // Si c'était le responsable ou l'adjoint, le retirer
      if (formData.responsableId === moniteurId) {
        setFormData({ ...formData, responsableId: undefined })
      }
      if (formData.adjointId === moniteurId) {
        setFormData({ ...formData, adjointId: undefined })
      }
    } else {
      setMoniteursSelectionnes([...moniteursSelectionnes, moniteurId])
    }
  }

  const getMoniteurById = (id: string) => {
    return moniteursDisponibles.find((m) => m.id === id)
  }

  const moniteursDisponiblesPourResponsable = moniteursDisponibles.filter((m) =>
    moniteursSelectionnes.includes(m.id)
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const moniteursSalle: MoniteurSalle[] = moniteursSelectionnes.map((id) => {
      const moniteur = getMoniteurById(id)!
      let role: "responsable" | "adjoint" | "membre" = "membre"
      if (id === formData.responsableId) role = "responsable"
      else if (id === formData.adjointId) role = "adjoint"

      return {
        id,
        nom: moniteur.nom,
        prenom: moniteur.prenom,
        nomComplet: moniteur.nomComplet,
        role,
        dateAffectation: new Date(),
      }
    })

    const responsable = getMoniteurById(formData.responsableId || "")
    const adjoint = getMoniteurById(formData.adjointId || "")

    const salleData = {
      ...formData,
      moniteurs: moniteursSalle,
      responsableNom: responsable?.nomComplet,
      adjointNom: adjoint?.nomComplet,
    }

    console.log("Salle mise à jour:", salleData)
    // TODO: Enregistrer dans la base de données
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Modifier la Salle</DialogTitle>
          <DialogDescription>Modifiez les informations de la salle et gérez les moniteurs</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh]">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4 pr-4">
              {/* INFORMATIONS GÉNÉRALES */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">
                  📋 Informations générales
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="nom">Nom de la salle *</Label>
                    <Input
                      id="nom"
                      value={formData.nom || ""}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      placeholder="Ex: Adolescents, Jardin..."
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="capacite">Capacité</Label>
                    <Input
                      id="capacite"
                      type="number"
                      min="1"
                      value={formData.capacite}
                      onChange={(e) =>
                        setFormData({ ...formData, capacite: parseInt(e.target.value) || 50 })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brève description de la salle..."
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="actif"
                    checked={formData.actif}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, actif: checked as boolean })
                    }
                  />
                  <Label htmlFor="actif" className="cursor-pointer">
                    Salle active
                  </Label>
                </div>
              </div>

              {/* SÉLECTION DES MONITEURS */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">
                  👥 Moniteurs affectés
                </h3>
                <div className="grid gap-2">
                  {moniteursDisponibles.map((moniteur) => (
                    <div
                      key={moniteur.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <Checkbox
                        id={`moniteur-${moniteur.id}`}
                        checked={moniteursSelectionnes.includes(moniteur.id)}
                        onCheckedChange={() => handleMoniteurToggle(moniteur.id)}
                      />
                      <Label
                        htmlFor={`moniteur-${moniteur.id}`}
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {moniteur.nomComplet}
                      </Label>
                      {moniteursSelectionnes.includes(moniteur.id) && (
                        <Badge variant="outline" className="text-xs">
                          {moniteur.id === formData.responsableId
                            ? "Responsable"
                            : moniteur.id === formData.adjointId
                            ? "Adjoint"
                            : "Membre"}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* RÔLES DES MONITEURS */}
              {moniteursSelectionnes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">🔑 Rôles</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="responsable">Responsable</Label>
                      <Select
                        value={formData.responsableId || ""}
                        onValueChange={(value) =>
                          setFormData({ ...formData, responsableId: value || undefined })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un responsable" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Aucun</SelectItem>
                          {moniteursDisponiblesPourResponsable.map((moniteur) => (
                            <SelectItem key={moniteur.id} value={moniteur.id}>
                              {moniteur.nomComplet}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="adjoint">Adjoint</Label>
                      <Select
                        value={formData.adjointId || ""}
                        onValueChange={(value) =>
                          setFormData({ ...formData, adjointId: value || undefined })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un adjoint" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Aucun</SelectItem>
                          {moniteursDisponiblesPourResponsable
                            .filter((m) => m.id !== formData.responsableId)
                            .map((moniteur) => (
                              <SelectItem key={moniteur.id} value={moniteur.id}>
                                {moniteur.nomComplet}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer les modifications</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
