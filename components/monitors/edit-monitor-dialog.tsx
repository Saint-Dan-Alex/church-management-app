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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"
import type { Monitor } from "@/types/monitor"
import type { RoleMoniteur } from "@/types/salle"

interface EditMonitorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  monitor: Monitor | null
}

// Salles disponibles (mockées - à remplacer par des données de la BD)
const sallesDisponibles = [
  { id: "1", nom: "Adolescents" },
  { id: "2", nom: "Juniors" },
  { id: "3", nom: "Jardin" },
  { id: "4", nom: "Cadets" },
  { id: "5", nom: "Ainés" },
]

export function EditMonitorDialog({ open, onOpenChange, monitor }: EditMonitorDialogProps) {
  const [formData, setFormData] = useState<Partial<Monitor>>({})
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  useEffect(() => {
    if (monitor) {
      setFormData(monitor)
      setPhotoPreview(monitor.photo || null)
    }
  }, [monitor])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
        setFormData({ ...formData, photo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Moniteur modifié:", formData)
    // Ici vous enregistrerez dans la base de données
    onOpenChange(false)
  }

  if (!monitor) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le Moniteur</DialogTitle>
          <DialogDescription>Modifiez les informations du moniteur</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Photo */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={photoPreview || ""} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  <Upload className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="photo-edit" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                    <Upload className="h-4 w-4" />
                    Modifier la photo
                  </div>
                </Label>
                <Input
                  id="photo-edit"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postNom">Post-nom</Label>
                <Input
                  id="postNom"
                  value={formData.postNom}
                  onChange={(e) => setFormData({ ...formData, postNom: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dateNaissance">Date de naissance *</Label>
                <Input
                  id="dateNaissance"
                  type="date"
                  value={formData.dateNaissance as string}
                  onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="adresse">Adresse *</Label>
              <Textarea
                id="adresse"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                rows={2}
                required
              />
            </div>

            {/* Informations spirituelles */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900">Informations spirituelles</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="dateConversion">Date de conversion</Label>
                  <Input
                    id="dateConversion"
                    type="date"
                    value={formData.dateConversion as string}
                    onChange={(e) => setFormData({ ...formData, dateConversion: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateBapteme">Date de baptême</Label>
                  <Input
                    id="dateBapteme"
                    type="date"
                    value={formData.dateBapteme as string}
                    onChange={(e) => setFormData({ ...formData, dateBapteme: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Baptisé du Saint-Esprit ? *</Label>
                <RadioGroup
                  value={formData.baptiseSaintEsprit ? "oui" : "non"}
                  onValueChange={(value) => setFormData({ ...formData, baptiseSaintEsprit: value === "oui" })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="oui" id="oui-edit" />
                    <Label htmlFor="oui-edit" className="font-normal cursor-pointer">Oui</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non" id="non-edit" />
                    <Label htmlFor="non-edit" className="font-normal cursor-pointer">Non</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* État civil et adhésion */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="etatCivil">État civil *</Label>
                <Select
                  value={formData.etatCivil}
                  onValueChange={(value: any) => setFormData({ ...formData, etatCivil: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Célibataire">Célibataire</SelectItem>
                    <SelectItem value="Marié(e)">Marié(e)</SelectItem>
                    <SelectItem value="Veuf(ve)">Veuf(ve)</SelectItem>
                    <SelectItem value="Divorcé(e)">Divorcé(e)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dateAdhesion">Date d'adhésion au ministère *</Label>
                <Input
                  id="dateAdhesion"
                  type="date"
                  value={formData.dateAdhesion as string}
                  onChange={(e) => setFormData({ ...formData, dateAdhesion: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Affectation à une salle */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900">Affectation à une salle</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="salleActuelleId">Salle</Label>
                  <Select
                    value={formData.salleActuelleId || ""}
                    onValueChange={(value) => {
                      const salle = sallesDisponibles.find(s => s.id === value)
                      setFormData({ 
                        ...formData, 
                        salleActuelleId: value,
                        salleActuelleNom: salle?.nom
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une salle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucune salle</SelectItem>
                      {sallesDisponibles.map((salle) => (
                        <SelectItem key={salle.id} value={salle.id}>
                          {salle.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="roleActuel">Rôle dans la salle</Label>
                  <Select
                    value={formData.roleActuel || ""}
                    onValueChange={(value: RoleMoniteur | "") => 
                      setFormData({ ...formData, roleActuel: value || undefined })
                    }
                    disabled={!formData.salleActuelleId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun rôle</SelectItem>
                      <SelectItem value="responsable">Responsable</SelectItem>
                      <SelectItem value="adjoint">Adjoint</SelectItem>
                      <SelectItem value="membre">Membre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {formData.salleActuelleId && (
                <div className="grid gap-2">
                  <Label htmlFor="dateAffectationActuelle">Date d'affectation</Label>
                  <Input
                    id="dateAffectationActuelle"
                    type="date"
                    value={formData.dateAffectationActuelle as string || ""}
                    onChange={(e) => setFormData({ ...formData, dateAffectationActuelle: e.target.value })}
                  />
                </div>
              )}
              {formData.salleActuelleId && formData.salleActuelleNom && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Affectation actuelle :</span> {formData.salleActuelleNom}
                    {formData.roleActuel && (
                      <span> - Rôle : <span className="font-semibold">
                        {formData.roleActuel === "responsable" ? "Responsable" : 
                         formData.roleActuel === "adjoint" ? "Adjoint" : "Membre"}
                      </span></span>
                    )}
                  </p>
                </div>
              )}
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
