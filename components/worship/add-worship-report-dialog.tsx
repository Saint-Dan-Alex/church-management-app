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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Plus, X } from "lucide-react"
import type { WorshipReport, SalleType, NouveauVenu } from "@/types/worship-report"

interface AddWorshipReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const salles: SalleType[] = ["Jardin", "Ainés", "Juniors", "Cadets", "Adolescents"]

export function AddWorshipReportDialog({ open, onOpenChange }: AddWorshipReportDialogProps) {
  const [formData, setFormData] = useState<Partial<WorshipReport>>({
    date: new Date().toISOString().split("T")[0],
    salle: undefined,
    orateurs: [],
    predicateur: "",
    moniteurs: [],
    effectifFreres: 0,
    effectifSoeurs: 0,
    effectifTotal: 0,
    offrandes: "",
    nombreNouveauxVenus: 0,
    nouveauxVenus: [],
  })

  // Calculer automatiquement le total
  const calculateTotal = (freres: number, soeurs: number) => {
    const total = freres + soeurs
    setFormData({ ...formData, effectifFreres: freres, effectifSoeurs: soeurs, effectifTotal: total })
  }

  // Gestion des orateurs
  const addOrateur = () => {
    setFormData({
      ...formData,
      orateurs: [...(formData.orateurs || []), ""],
    })
  }

  const updateOrateur = (index: number, value: string) => {
    const newOrateurs = [...(formData.orateurs || [])]
    newOrateurs[index] = value
    setFormData({ ...formData, orateurs: newOrateurs })
  }

  const removeOrateur = (index: number) => {
    setFormData({
      ...formData,
      orateurs: formData.orateurs?.filter((_, i) => i !== index),
    })
  }

  // Gestion des moniteurs
  const addMoniteur = () => {
    setFormData({
      ...formData,
      moniteurs: [...(formData.moniteurs || []), ""],
    })
  }

  const updateMoniteur = (index: number, value: string) => {
    const newMoniteurs = [...(formData.moniteurs || [])]
    newMoniteurs[index] = value
    setFormData({ ...formData, moniteurs: newMoniteurs })
  }

  const removeMoniteur = (index: number) => {
    setFormData({
      ...formData,
      moniteurs: formData.moniteurs?.filter((_, i) => i !== index),
    })
  }

  // Gestion des nouveaux venus
  const addNouveauVenu = () => {
    const newVenu: NouveauVenu = {
      id: Date.now().toString(),
      prenom: "",
      nom: "",
      adresse: "",
      contact: "",
    }
    setFormData({
      ...formData,
      nouveauxVenus: [...(formData.nouveauxVenus || []), newVenu],
      nombreNouveauxVenus: (formData.nombreNouveauxVenus || 0) + 1,
    })
  }

  const updateNouveauVenu = (id: string, field: keyof NouveauVenu, value: string) => {
    setFormData({
      ...formData,
      nouveauxVenus: formData.nouveauxVenus?.map((venu) =>
        venu.id === id ? { ...venu, [field]: value } : venu
      ),
    })
  }

  const removeNouveauVenu = (id: string) => {
    setFormData({
      ...formData,
      nouveauxVenus: formData.nouveauxVenus?.filter((venu) => venu.id !== id),
      nombreNouveauxVenus: Math.max(0, (formData.nombreNouveauxVenus || 0) - 1),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Rapport de culte ajouté:", formData)
    // Ici vous enregistrerez dans la base de données
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Nouveau Rapport de Culte</DialogTitle>
          <DialogDescription>Enregistrez le rapport du culte dominical</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh]">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4 pr-4">
              {/* INFORMATIONS GÉNÉRALES */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">
                  📅 Informations générales
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date du culte *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date as string}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="salle">Salle *</Label>
                    <Select
                      value={formData.salle}
                      onValueChange={(value: SalleType) => setFormData({ ...formData, salle: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une salle" />
                      </SelectTrigger>
                      <SelectContent>
                        {salles.map((salle) => (
                          <SelectItem key={salle} value={salle}>
                            {salle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* ORATEURS */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">👥 Orateur(s)</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addOrateur}>
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter un orateur
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.orateurs?.map((orateur, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Orateur ${index + 1}`}
                        value={orateur}
                        onChange={(e) => updateOrateur(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOrateur(index)}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRÉDICATEUR */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">🎤 Prédicateur</h3>
                <div className="grid gap-2">
                  <Label htmlFor="predicateur">Nom du prédicateur *</Label>
                  <Input
                    id="predicateur"
                    value={formData.predicateur}
                    onChange={(e) => setFormData({ ...formData, predicateur: e.target.value })}
                    placeholder="Ex: Frère NFEO"
                    required
                  />
                </div>
              </div>

              {/* MONITEURS ASSISTANTS */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">👨‍🏫 Moniteurs / Assistant(s)</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addMoniteur}>
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter un moniteur
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.moniteurs?.map((moniteur, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Moniteur ${index + 1}`}
                        value={moniteur}
                        onChange={(e) => updateMoniteur(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMoniteur(index)}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* EFFECTIFS */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">📊 Effectifs</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="effectifFreres">Frères *</Label>
                    <Input
                      id="effectifFreres"
                      type="number"
                      min="0"
                      value={formData.effectifFreres}
                      onChange={(e) =>
                        calculateTotal(parseInt(e.target.value) || 0, formData.effectifSoeurs || 0)
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="effectifSoeurs">Sœurs *</Label>
                    <Input
                      id="effectifSoeurs"
                      type="number"
                      min="0"
                      value={formData.effectifSoeurs}
                      onChange={(e) =>
                        calculateTotal(formData.effectifFreres || 0, parseInt(e.target.value) || 0)
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="effectifTotal">Total (calculé automatiquement)</Label>
                    <Input
                      id="effectifTotal"
                      type="number"
                      value={formData.effectifTotal}
                      disabled
                      className="bg-gray-100 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* OFFRANDES */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">💰 Offrandes</h3>
                <div className="grid gap-2">
                  <Label htmlFor="offrandes">Montant des offrandes</Label>
                  <Input
                    id="offrandes"
                    value={formData.offrandes}
                    onChange={(e) => setFormData({ ...formData, offrandes: e.target.value })}
                    placeholder="Ex: 171,700 FC + 1 GN"
                  />
                  <p className="text-xs text-gray-500">Vous pouvez indiquer plusieurs devises</p>
                </div>
              </div>

              {/* NOUVEAUX VENUS */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    ✨ Nouveaux venus ({formData.nombreNouveauxVenus || 0})
                  </h3>
                  <Button type="button" variant="outline" size="sm" onClick={addNouveauVenu}>
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter un nouveau venu
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.nouveauxVenus?.map((venu) => (
                    <Card key={venu.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">Nouveau venu</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeNouveauVenu(venu.id)}
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <Input
                            placeholder="Prénom"
                            value={venu.prenom}
                            onChange={(e) => updateNouveauVenu(venu.id, "prenom", e.target.value)}
                          />
                          <Input
                            placeholder="Nom"
                            value={venu.nom}
                            onChange={(e) => updateNouveauVenu(venu.id, "nom", e.target.value)}
                          />
                          <Input
                            placeholder="Adresse"
                            value={venu.adresse}
                            onChange={(e) => updateNouveauVenu(venu.id, "adresse", e.target.value)}
                          />
                          <Input
                            placeholder="Contact"
                            value={venu.contact}
                            onChange={(e) => updateNouveauVenu(venu.id, "contact", e.target.value)}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="pr-4 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer le rapport</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
