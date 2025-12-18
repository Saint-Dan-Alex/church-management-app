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
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Salle, MoniteurSalle } from "@/types/salle"
import { monitorsService } from "@/lib/services/monitors.service"
import { sallesService } from "@/lib/services/salles.service"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface EditSalleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  salle: Salle
  onSuccess?: () => void
}

export function EditSalleDialog({ open, onOpenChange, salle, onSuccess }: EditSalleDialogProps) {
  const [formData, setFormData] = useState<Partial<Salle>>({
    nom: salle.nom,
    description: salle.description,
    capacite: salle.capacite,
    responsable_id: salle.responsable_id,
    adjoint_id: salle.adjoint_id,
    moniteurs: salle.moniteurs,
    actif: salle.actif,
  })

  const [moniteursSelectionnes, setMoniteursSelectionnes] = useState<string[]>(
    salle.moniteurs.map(m => m.id)
  )
  const [availableMonitors, setAvailableMonitors] = useState<any[]>([])
  const [loadingMonitors, setLoadingMonitors] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialisation à l'ouverture ou changement de salle
  useEffect(() => {
    if (open) {
      setFormData({
        nom: salle.nom,
        description: salle.description,
        capacite: salle.capacite,
        responsable_id: salle.responsable_id,
        adjoint_id: salle.adjoint_id,
        moniteurs: salle.moniteurs,
        actif: salle.actif,
      })
      setMoniteursSelectionnes(salle.moniteurs ? salle.moniteurs.map(m => m.id) : [])
    }
  }, [salle, open])

  // Charger les moniteurs
  useEffect(() => {
    const fetchMonitors = async () => {
      if (!open) return

      try {
        setLoadingMonitors(true)
        const response = await monitorsService.getAll({ per_page: 999 })
        const monitorsData = response.data || response || []

        if (Array.isArray(monitorsData)) {
          const formatted = monitorsData.map((m: any) => ({
            id: m.id,
            nom: m.nom,
            prenom: m.prenom,
            nomComplet: `${m.prenom} ${m.nom}`
          }))
          setAvailableMonitors(formatted)
        }
      } catch (error) {
        console.error("Erreur chargement moniteurs:", error)
        toast.error("Impossible de charger la liste des moniteurs")
      } finally {
        setLoadingMonitors(false)
      }
    }

    fetchMonitors()
  }, [open])

  const handleMoniteurToggle = (moniteurId: string) => {
    if (moniteursSelectionnes.includes(moniteurId)) {
      setMoniteursSelectionnes(moniteursSelectionnes.filter((id) => id !== moniteurId))
      // Si c'était le responsable ou l'adjoint, le retirer
      if (formData.responsable_id === moniteurId) {
        setFormData((prev) => ({ ...prev, responsable_id: undefined }))
      }
      if (formData.adjoint_id === moniteurId) {
        setFormData((prev) => ({ ...prev, adjoint_id: undefined }))
      }
    } else {
      setMoniteursSelectionnes([...moniteursSelectionnes, moniteurId])
    }
  }

  const getMoniteurById = (id: string) => {
    return availableMonitors.find((m) => m.id === id)
  }

  const moniteursDisponiblesPourResponsable = availableMonitors.filter((m) =>
    moniteursSelectionnes.includes(m.id)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        nom: formData.nom,
        description: formData.description,
        capacite: formData.capacite,
        responsable_id: formData.responsable_id,
        responsable_nom: formData.responsable_id ? getMoniteurById(formData.responsable_id)?.nom : undefined,
        adjoint_id: formData.adjoint_id,
        adjoint_nom: formData.adjoint_id ? getMoniteurById(formData.adjoint_id)?.nom : undefined,
        actif: formData.actif,
        moniteurs_ids: moniteursSelectionnes
      }

      await sallesService.update(salle.id, payload)

      toast.success("Salle mise à jour avec succès")
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Erreur mise à jour salle:", error)
      toast.error("Erreur lors de la mise à jour de la salle")
    } finally {
      setIsSubmitting(false)
    }
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
                      value={formData.capacite === undefined || isNaN(formData.capacite) ? "" : formData.capacite}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({
                          ...formData,
                          capacite: val === "" ? 0 : parseInt(val)
                        })
                      }}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
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
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900 flex items-center justify-between">
                  <span>👥 Moniteurs affectés ({moniteursSelectionnes.length})</span>
                  {loadingMonitors && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
                </h3>

                {loadingMonitors ? (
                  <div className="text-center py-4 text-gray-500">Chargement des moniteurs...</div>
                ) : availableMonitors.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">Aucun moniteur disponible</div>
                ) : (
                  <div className="grid gap-2 bg-gray-50 p-4 rounded-md max-h-[300px] overflow-y-auto">
                    {availableMonitors.map((moniteur) => {
                      const isSelected = moniteursSelectionnes.includes(moniteur.id);
                      return (
                        <div
                          key={moniteur.id}
                          className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${isSelected ? 'bg-white shadow-sm border' : 'hover:bg-gray-100'}`}
                        >
                          <Checkbox
                            id={`moniteur-${moniteur.id}`}
                            checked={isSelected}
                            onCheckedChange={() => handleMoniteurToggle(moniteur.id)}
                          />
                          <Label
                            htmlFor={`moniteur-${moniteur.id}`}
                            className="flex-1 cursor-pointer font-medium"
                          >
                            {moniteur.nomComplet}
                          </Label>
                          {isSelected && (
                            <Badge variant="outline" className="text-xs">
                              {moniteur.id === formData.responsable_id
                                ? "Responsable"
                                : moniteur.id === formData.adjoint_id
                                  ? "Adjoint"
                                  : "Membre"}
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* RÔLES DES MONITEURS */}
              {moniteursSelectionnes.length > 0 && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-900">🔑 Rôles</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="responsable">Responsable</Label>
                      <Select
                        value={formData.responsable_id || ""}
                        onValueChange={(value) =>
                          setFormData({ ...formData, responsable_id: value === "_aucun" ? undefined : value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un responsable" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_aucun">Aucun</SelectItem>
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
                        value={formData.adjoint_id || ""}
                        onValueChange={(value) =>
                          setFormData({ ...formData, adjoint_id: value === "_aucun" ? undefined : value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un adjoint" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_aucun">Aucun</SelectItem>
                          {moniteursDisponiblesPourResponsable
                            .filter((m) => m.id !== formData.responsable_id)
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer les modifications
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
