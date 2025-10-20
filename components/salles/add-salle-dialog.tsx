"use client"

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
import type { Salle, MoniteurSalle } from "@/types/salle"

interface AddSalleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function AddSalleDialog({ open, onOpenChange }: AddSalleDialogProps) {
  const [formData, setFormData] = useState<Partial<Salle>>({
    nom: undefined,
    description: "",
    capacite: 50,
    responsableId: undefined,
    adjointId: undefined,
    moniteurs: [],
    actif: true,
  })

  const [moniteursSelectionnes, setMoniteursSelectionnes] = useState<string[]>([])

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

    const salle: Salle = {
      id: Date.now().toString(),
      nom: formData.nom!,
      description: formData.description || "",
      capacite: formData.capacite || 50,
      responsableId: formData.responsableId,
      responsableNom: responsable?.nomComplet,
      adjointId: formData.adjointId,
      adjointNom: adjoint?.nomComplet,
      moniteurs: moniteursSalle,
      actif: formData.actif || true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("Salle ajoutée:", salle)
    // TODO: Enregistrer dans la base de données
    // TODO: Créer les entrées d'historique pour chaque moniteur
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Salle</DialogTitle>
          <DialogDescription>Créez une nouvelle salle et affectez des moniteurs</DialogDescription>
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
                    placeholder="Description de la salle..."
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
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">
                  👥 Moniteurs ({moniteursSelectionnes.length})
                </h3>
                <Card className="p-4">
                  <div className="space-y-3">
                    {moniteursDisponibles.map((moniteur) => (
                      <div key={moniteur.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`moniteur-${moniteur.id}`}
                          checked={moniteursSelectionnes.includes(moniteur.id)}
                          onCheckedChange={() => handleMoniteurToggle(moniteur.id)}
                        />
                        <Label
                          htmlFor={`moniteur-${moniteur.id}`}
                          className="cursor-pointer flex-1"
                        >
                          {moniteur.nomComplet}
                        </Label>
                        {formData.responsableId === moniteur.id && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Responsable
                          </Badge>
                        )}
                        {formData.adjointId === moniteur.id && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Adjoint
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
                {moniteursSelectionnes.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {moniteursSelectionnes.length} moniteur{moniteursSelectionnes.length > 1 ? "s" : ""} sélectionné{moniteursSelectionnes.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>

              {/* RESPONSABLE ET ADJOINT */}
              {moniteursSelectionnes.length > 0 && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-900">👔 Responsables</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="responsable">Responsable</Label>
                      <Select
                        value={formData.responsableId}
                        onValueChange={(value) => setFormData({ ...formData, responsableId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un responsable" />
                        </SelectTrigger>
                        <SelectContent>
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
                        value={formData.adjointId}
                        onValueChange={(value) => setFormData({ ...formData, adjointId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un adjoint" />
                        </SelectTrigger>
                        <SelectContent>
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

            <DialogFooter className="pr-4 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={!formData.nom}>
                Créer la salle
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
