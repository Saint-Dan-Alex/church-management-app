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
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import { Plus, X } from "lucide-react"
import type { Teaching, Chant, PointDeveloppement, SousPoint, Evenement, EnseignementEvenement } from "@/types/teaching"

interface EditTeachingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teaching: Teaching | null
  onSave: (teaching: Teaching) => Promise<void>
}

export function EditTeachingDialog({ open, onOpenChange, teaching, onSave }: EditTeachingDialogProps) {
  const [formData, setFormData] = useState<Partial<Teaching>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (teaching) {
      setFormData(teaching)
    }
  }, [teaching])

  // Gestion des chants
  const addChant = () => {
    const newChant: Chant = {
      id: Date.now().toString(),
      titre: "",
      numero: "",
    }
    setFormData({
      ...formData,
      chants: [...(formData.chants || []), newChant],
    })
  }

  const updateChant = (id: string, field: keyof Chant, value: string) => {
    setFormData({
      ...formData,
      chants: formData.chants?.map(chant =>
        chant.id === id ? { ...chant, [field]: value } : chant
      ),
    })
  }

  const removeChant = (id: string) => {
    setFormData({
      ...formData,
      chants: formData.chants?.filter(chant => chant.id !== id),
    })
  }

  // Gestion des points à développer
  const addPoint = () => {
    const newPoint: PointDeveloppement = {
      id: Date.now().toString(),
      titre: "",
      sous_points: [],
    }
    setFormData({
      ...formData,
      points: [...(formData.points || []), newPoint],
    })
  }

  const updatePoint = (id: string, titre: string) => {
    setFormData({
      ...formData,
      points: formData.points?.map(point =>
        point.id === id ? { ...point, titre } : point
      ),
    })
  }

  const removePoint = (id: string) => {
    setFormData({
      ...formData,
      points: formData.points?.filter(point => point.id !== id),
    })
  }

  // Gestion des sous-points
  const addSousPoint = (pointId: string) => {
    const newSousPoint: SousPoint = {
      id: Date.now().toString(),
      contenu: "",
    }
    setFormData({
      ...formData,
      points: formData.points?.map(point =>
        point.id === pointId
          ? { ...point, sous_points: [...point.sous_points, newSousPoint] }
          : point
      ),
    })
  }

  const updateSousPoint = (pointId: string, sousPointId: string, contenu: string) => {
    setFormData({
      ...formData,
      points: formData.points?.map(point =>
        point.id === pointId
          ? {
            ...point,
            sous_points: point.sous_points.map(sp =>
              sp.id === sousPointId ? { ...sp, contenu } : sp
            ),
          }
          : point
      ),
    })
  }

  const removeSousPoint = (pointId: string, sousPointId: string) => {
    setFormData({
      ...formData,
      points: formData.points?.map(point =>
        point.id === pointId
          ? { ...point, sous_points: point.sous_points.filter(sp => sp.id !== sousPointId) }
          : point
      ),
    })
  }

  // Gestion des événements
  const addEvenement = () => {
    const newEvenement: Evenement = {
      id: Date.now().toString(),
      titre: "",
      enseignements: [],
    }
    setFormData({
      ...formData,
      evenements: [...(formData.evenements || []), newEvenement],
    })
  }

  const updateEvenement = (id: string, titre: string) => {
    setFormData({
      ...formData,
      evenements: formData.evenements?.map(evt =>
        evt.id === id ? { ...evt, titre } : evt
      ),
    })
  }

  const removeEvenement = (id: string) => {
    setFormData({
      ...formData,
      evenements: formData.evenements?.filter(evt => evt.id !== id),
    })
  }

  // Gestion des enseignements d'un événement
  const addEnseignementEvenement = (evenementId: string) => {
    const newEnseignement: EnseignementEvenement = {
      id: Date.now().toString(),
      contenu: "",
    }
    setFormData({
      ...formData,
      evenements: formData.evenements?.map(evt =>
        evt.id === evenementId
          ? { ...evt, enseignements: [...evt.enseignements, newEnseignement] }
          : evt
      ),
    })
  }

  const updateEnseignementEvenement = (evenementId: string, enseignementId: string, contenu: string) => {
    setFormData({
      ...formData,
      evenements: formData.evenements?.map(evt =>
        evt.id === evenementId
          ? {
            ...evt,
            enseignements: evt.enseignements.map(ens =>
              ens.id === enseignementId ? { ...ens, contenu } : ens
            ),
          }
          : evt
      ),
    })
  }

  const removeEnseignementEvenement = (evenementId: string, enseignementId: string) => {
    setFormData({
      ...formData,
      evenements: formData.evenements?.map(evt =>
        evt.id === evenementId
          ? { ...evt, enseignements: evt.enseignements.filter(ens => ens.id !== enseignementId) }
          : evt
      ),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.id) return

    try {
      setSaving(true)
      await onSave(formData as Teaching)
      onOpenChange(false)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde", error)
    } finally {
      setSaving(false)
    }
  }

  if (!teaching) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Modifier l'Enseignement</DialogTitle>
          <DialogDescription>Modifiez les informations de l'enseignement</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4 pr-4">
              {/* INFORMATIONS GÉNÉRALES */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  📅 Informations générales
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="dateSeance-edit">Date de la séance *</Label>
                    <Input
                      id="dateSeance-edit"
                      type="date"
                      value={
                        typeof formData.date_seance === "string"
                          ? formData.date_seance.substring(0, 10)
                          : formData.date_seance instanceof Date
                            ? formData.date_seance.toISOString().split("T")[0]
                            : ""
                      }
                      onChange={(e) => setFormData({ ...formData, date_seance: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="theme-edit">Thème *</Label>
                    <Input
                      id="theme-edit"
                      value={formData.theme || ""}
                      onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sousTheme-edit">Sous-thème</Label>
                    <Input
                      id="sousTheme-edit"
                      value={formData.sous_theme || ""}
                      onChange={(e) => setFormData({ ...formData, sous_theme: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sujet-edit">Sujet *</Label>
                    <Input
                      id="sujet-edit"
                      value={formData.sujet || ""}
                      onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="textesBibliques-edit">Textes bibliques *</Label>
                  <Textarea
                    id="textesBibliques-edit"
                    value={formData.textes_bibliques || ""}
                    onChange={(e) => setFormData({ ...formData, textes_bibliques: e.target.value })}
                    rows={2}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="butPedagogique-edit">But pédagogique *</Label>
                  <Textarea
                    id="butPedagogique-edit"
                    value={formData.but_pedagogique || ""}
                    onChange={(e) => setFormData({ ...formData, but_pedagogique: e.target.value })}
                    rows={2}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="versetRetenir-edit">Verset à retenir (V.A.R) *</Label>
                  <Input
                    id="versetRetenir-edit"
                    value={formData.verset_retenir || ""}
                    onChange={(e) => setFormData({ ...formData, verset_retenir: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* CHANTS */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    🎶 Chants
                  </h3>
                  <Button type="button" variant="outline" size="sm" onClick={addChant}>
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter un chant
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.chants?.map((chant, index) => (
                    <Card key={chant.id} className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 grid gap-2 md:grid-cols-2">
                          <Input
                            placeholder={`Titre du chant ${index + 1}`}
                            value={chant.titre || ""}
                            onChange={(e) => updateChant(chant.id, "titre", e.target.value)}
                          />
                          <Input
                            placeholder="N° (optionnel)"
                            value={chant.numero || ""}
                            onChange={(e) => updateChant(chant.id, "numero", e.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeChant(chant.id)}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* MATÉRIEL ET RÉVISION */}
              <div className="space-y-4 border-t pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="materielDidactique-edit">Matériel didactique (M/D)</Label>
                    <Textarea
                      id="materielDidactique-edit"
                      value={formData.materiel_didactique || ""}
                      onChange={(e) => setFormData({ ...formData, materiel_didactique: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sujetRevision-edit">Sujet de révision (S/R)</Label>
                    <Textarea
                      id="sujetRevision-edit"
                      value={formData.sujet_revision || ""}
                      onChange={(e) => setFormData({ ...formData, sujet_revision: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* INTRODUCTION */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  🔍 Introduction
                </h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sensibilisation-edit">Sensibilisation (chants)</Label>
                    <Textarea
                      id="sensibilisation-edit"
                      value={formData.sensibilisation || ""}
                      onChange={(e) => setFormData({ ...formData, sensibilisation: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="questionsReponses-edit">Questions/Réponses (Q.R)</Label>
                    <Textarea
                      id="questionsReponses-edit"
                      value={formData.questions_reponses || ""}
                      onChange={(e) => setFormData({ ...formData, questions_reponses: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="questionDecouverte-edit">Question de découverte (Q.D)</Label>
                    <Textarea
                      id="questionDecouverte-edit"
                      value={formData.question_decouverte || ""}
                      onChange={(e) => setFormData({ ...formData, question_decouverte: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reponseDecouverte-edit">Réponse de découverte (R)</Label>
                    <Textarea
                      id="reponseDecouverte-edit"
                      value={formData.reponse_decouverte || ""}
                      onChange={(e) => setFormData({ ...formData, reponse_decouverte: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* TYPE DE CONTENU */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">Type de contenu *</h3>
                <RadioGroup
                  value={formData.type_contenu}
                  onValueChange={(value: any) => setFormData({ ...formData, type_contenu: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="points_developper" id="points-edit" />
                    <Label htmlFor="points-edit" className="font-normal cursor-pointer">
                      Points à développer
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="developpement" id="developpement-edit" />
                    <Label htmlFor="developpement-edit" className="font-normal cursor-pointer">
                      Développement
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* POINTS À DÉVELOPPER */}
              {formData.type_contenu === "points_developper" && (
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      📚 Points à développer
                    </h3>
                    <Button type="button" variant="outline" size="sm" onClick={addPoint}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter un point
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {formData.points?.map((point, pointIndex) => (
                      <Card key={point.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder={`Point ${pointIndex + 1}`}
                              value={point.titre || ""}
                              onChange={(e) => updatePoint(point.id, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removePoint(point.id)}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>

                          {/* Sous-points */}
                          <div className="ml-6 space-y-2">
                            {point.sous_points.map((sousPoint, spIndex) => (
                              <div key={sousPoint.id} className="flex items-center gap-2">
                                <Input
                                  placeholder={`Sous-point ${spIndex + 1}`}
                                  value={sousPoint.contenu || ""}
                                  onChange={(e) =>
                                    updateSousPoint(point.id, sousPoint.id, e.target.value)
                                  }
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeSousPoint(point.id, sousPoint.id)}
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addSousPoint(point.id)}
                              className="mt-2"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Ajouter un sous-point
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* DÉVELOPPEMENT */}
              {formData.type_contenu === "developpement" && (
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      📚 Développement
                    </h3>
                    <Button type="button" variant="outline" size="sm" onClick={addEvenement}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter un événement
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {formData.evenements?.map((evenement, evtIndex) => (
                      <Card key={evenement.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder={`Événement ${evtIndex + 1}`}
                              value={evenement.titre || ""}
                              onChange={(e) => updateEvenement(evenement.id, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeEvenement(evenement.id)}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>

                          {/* Enseignements de l'événement */}
                          <div className="ml-6 space-y-2">
                            {evenement.enseignements.map((ens, ensIndex) => (
                              <div key={ens.id} className="flex items-center gap-2">
                                <Textarea
                                  placeholder={`Enseignement ${ensIndex + 1}`}
                                  value={ens.contenu || ""}
                                  onChange={(e) =>
                                    updateEnseignementEvenement(evenement.id, ens.id, e.target.value)
                                  }
                                  rows={2}
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeEnseignementEvenement(evenement.id, ens.id)}
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addEnseignementEvenement(evenement.id)}
                              className="mt-2"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Ajouter un enseignement
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* CONCLUSION */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">Conclusion</h3>
                <div className="grid gap-2">
                  <Label htmlFor="conclusion-edit">Conclusion de la leçon</Label>
                  <Textarea
                    id="conclusion-edit"
                    value={formData.conclusion || ""}
                    onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pr-4 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                Annuler
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
