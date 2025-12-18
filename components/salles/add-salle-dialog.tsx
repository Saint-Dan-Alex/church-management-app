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
import type { Salle, MoniteurSalle } from "@/types/salle"
import { monitorsService } from "@/lib/services/monitors.service"
import { sallesService } from "@/lib/services/salles.service"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface AddSalleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddSalleDialog({ open, onOpenChange, onSuccess }: AddSalleDialogProps) {
  const [formData, setFormData] = useState<Partial<Salle>>({
    nom: undefined,
    description: "",
    capacite: 50,
    responsable_id: undefined,
    adjoint_id: undefined,
    moniteurs: [],
    actif: true,
  })

  // État pour les moniteurs récupérés depuis l'API
  const [availableMonitors, setAvailableMonitors] = useState<any[]>([])
  const [loadingMonitors, setLoadingMonitors] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [moniteursSelectionnes, setMoniteursSelectionnes] = useState<string[]>([])

  // Charger les moniteurs à l'ouverture du dialogue
  useEffect(() => {
    const fetchMonitors = async () => {
      if (!open) return

      try {
        setLoadingMonitors(true)
        const response = await monitorsService.getAll({ per_page: 999 })
        // Gestion de la réponse paginée ou tableau direct
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
      // Préparation des données pour l'API
      // Note: L'API attend peut-être un format différent, on adapte selon le service
      const payload = {
        nom: formData.nom,
        description: formData.description,
        capacite: formData.capacite,
        responsable_id: formData.responsable_id,
        responsable_nom: formData.responsable_id ? getMoniteurById(formData.responsable_id)?.nomComplet : undefined,
        adjoint_id: formData.adjoint_id,
        adjoint_nom: formData.adjoint_id ? getMoniteurById(formData.adjoint_id)?.nomComplet : undefined,
        actif: formData.actif,
        moniteurs_ids: moniteursSelectionnes
      }

      await sallesService.create(payload)

      toast.success("Salle créée avec succès")
      onOpenChange(false)
      // Reset form
      setFormData({
        nom: undefined,
        description: "",
        capacite: 50,
        responsable_id: undefined,
        adjoint_id: undefined,
        moniteurs: [],
        actif: true,
      })
      setMoniteursSelectionnes([])

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Erreur création salle:", error)
      toast.error("Erreur lors de la création de la salle")
    } finally {
      setIsSubmitting(false)
    }
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
                      value={formData.capacite === undefined ? "" : formData.capacite}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({
                          ...formData,
                          capacite: val === "" ? undefined : parseInt(val)
                        })
                      }}
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
                <h3 className="font-semibold text-gray-900 flex items-center justify-between">
                  <span>👥 Moniteurs ({moniteursSelectionnes.length})</span>
                  {loadingMonitors && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
                </h3>
                <Card className="p-4">
                  {loadingMonitors ? (
                    <div className="text-center py-4 text-gray-500">Chargement...</div>
                  ) : availableMonitors.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">Aucun moniteur disponible</div>
                  ) : (
                    <div className="space-y-3">
                      {availableMonitors.map((moniteur) => (
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
                          {formData.responsable_id === moniteur.id && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Responsable
                            </Badge>
                          )}
                          {formData.adjoint_id === moniteur.id && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              Adjoint
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
                        value={formData.responsable_id || ""}
                        onValueChange={(value) => setFormData({ ...formData, responsable_id: value })}
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
                        value={formData.adjoint_id || ""}
                        onValueChange={(value) => setFormData({ ...formData, adjoint_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un adjoint" />
                        </SelectTrigger>
                        <SelectContent>
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

            <DialogFooter className="pr-4 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={!formData.nom || isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer la salle
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
