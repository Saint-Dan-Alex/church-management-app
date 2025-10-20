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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"
import type { MonitorFormData } from "@/types/monitor"
import type { RoleMoniteur } from "@/types/salle"

// Données mockées des salles disponibles
const sallesDisponibles = [
  { id: "1", nom: "Adolescents" },
  { id: "2", nom: "Juniors" },
  { id: "3", nom: "Jardin" },
  { id: "4", nom: "Ainés" },
  { id: "5", nom: "Cadets" },
]

interface AddMonitorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMonitorDialog({ open, onOpenChange }: AddMonitorDialogProps) {
  const [formData, setFormData] = useState<Partial<MonitorFormData>>({
    nom: "",
    postNom: "",
    prenom: "",
    dateNaissance: "",
    email: "",
    telephone: "",
    adresse: "",
    photo: "",
    dateConversion: "",
    dateBapteme: "",
    baptiseSaintEsprit: false,
    etatCivil: "Célibataire",
    dateAdhesion: "",
    salleActuelleId: undefined,
    salleActuelleNom: undefined,
    roleActuel: undefined,
    dateAffectationActuelle: "",
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

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
    console.log("Formulaire soumis:", formData)
    // Ici vous enregistrerez dans la base de données
    onOpenChange(false)
    // Réinitialiser le formulaire
    setFormData({
      nom: "",
      postNom: "",
      prenom: "",
      dateNaissance: "",
      email: "",
      telephone: "",
      adresse: "",
      photo: "",
      dateConversion: "",
      dateBapteme: "",
      baptiseSaintEsprit: false,
      etatCivil: "Célibataire",
      dateAdhesion: "",
      salleActuelleId: undefined,
      salleActuelleNom: undefined,
      roleActuel: undefined,
      dateAffectationActuelle: "",
    })
    setPhotoPreview(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un Moniteur</DialogTitle>
          <DialogDescription>Remplissez les informations du nouveau moniteur</DialogDescription>
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
                <Label htmlFor="photo" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                    <Upload className="h-4 w-4" />
                    Ajouter une photo
                  </div>
                </Label>
                <Input
                  id="photo"
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
                  placeholder="Dupont"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postNom">Post-nom</Label>
                <Input
                  id="postNom"
                  value={formData.postNom}
                  onChange={(e) => setFormData({ ...formData, postNom: e.target.value })}
                  placeholder="Martin"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  placeholder="Jean"
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
                  placeholder="jean.dupont@email.com"
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
                  placeholder="+33 6 12 34 56 78"
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
                placeholder="123 Rue de l'Église, 75001 Paris"
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
                    <RadioGroupItem value="oui" id="oui" />
                    <Label htmlFor="oui" className="font-normal cursor-pointer">Oui</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non" id="non" />
                    <Label htmlFor="non" className="font-normal cursor-pointer">Non</Label>
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
              <h3 className="font-semibold text-gray-900">🏢 Affectation à une salle (Optionnel)</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="salle">Salle</Label>
                  <Select
                    value={formData.salleActuelleId}
                    onValueChange={(value) => {
                      const salle = sallesDisponibles.find(s => s.id === value)
                      setFormData({
                        ...formData,
                        salleActuelleId: value,
                        salleActuelleNom: salle?.nom,
                        dateAffectationActuelle: new Date().toISOString().split('T')[0],
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une salle" />
                    </SelectTrigger>
                    <SelectContent>
                      {sallesDisponibles.map((salle) => (
                        <SelectItem key={salle.id} value={salle.id}>
                          {salle.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {formData.salleActuelleId && (
                  <div className="grid gap-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Select
                      value={formData.roleActuel}
                      onValueChange={(value: RoleMoniteur) => setFormData({ ...formData, roleActuel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="responsable">Responsable</SelectItem>
                        <SelectItem value="adjoint">Adjoint</SelectItem>
                        <SelectItem value="membre">Membre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
