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
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"
import type { Child } from "@/types/child"

interface EditChildDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  child: Child | null
}

export function EditChildDialog({ open, onOpenChange, child }: EditChildDialogProps) {
  const [formData, setFormData] = useState<Partial<Child>>({})
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  useEffect(() => {
    if (child) {
      setFormData(child)
      setPhotoPreview(child.photo || null)
    }
  }, [child])

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
    console.log("Enfant modifié:", formData)
    // Ici vous enregistrerez dans la base de données
    onOpenChange(false)
  }

  if (!child) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l'Enfant</DialogTitle>
          <DialogDescription>Modifiez les informations de l'enfant</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh]">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4 pr-4">
              {/* Photo */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={photoPreview || undefined} />
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
                  <Input id="photo-edit" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </div>
              </div>

              {/* 1. IDENTIFICATION PERSONNELLE */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">1. Identification personnelle</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="nom">Nom *</Label>
                    <Input id="nom" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="postNom">Post-nom</Label>
                    <Input id="postNom" value={formData.postNom} onChange={(e) => setFormData({ ...formData, postNom: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input id="prenom" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dateNaissance">Date de naissance *</Label>
                    <Input id="dateNaissance" type="date" value={formData.dateNaissance as string} onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="genre">Genre *</Label>
                    <Select value={formData.genre} onValueChange={(value: any) => setFormData({ ...formData, genre: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculin">Masculin</SelectItem>
                        <SelectItem value="Féminin">Féminin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="etatCivil">État civil *</Label>
                    <Select value={formData.etatCivil} onValueChange={(value: any) => setFormData({ ...formData, etatCivil: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Célibataire">Célibataire</SelectItem>
                        <SelectItem value="Marié(e)">Marié(e)</SelectItem>
                        <SelectItem value="Veuf(ve)">Veuf(ve)</SelectItem>
                        <SelectItem value="Divorcé(e)">Divorcé(e)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="telephone">Téléphone *</Label>
                    <Input id="telephone" type="tel" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="adresse">Adresse complète *</Label>
                  <Textarea id="adresse" value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} rows={2} required />
                </div>
              </div>

              {/* 2. INFORMATIONS FAMILIALES */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">2. Informations familiales</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="nomPere">Nom du père *</Label>
                    <Input id="nomPere" value={formData.nomPere} onChange={(e) => setFormData({ ...formData, nomPere: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nomMere">Nom de la mère *</Label>
                    <Input id="nomMere" value={formData.nomMere} onChange={(e) => setFormData({ ...formData, nomMere: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="telephoneParent1">Téléphone parent 1 *</Label>
                    <Input id="telephoneParent1" type="tel" value={formData.telephoneParent1} onChange={(e) => setFormData({ ...formData, telephoneParent1: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="telephoneParent2">Téléphone parent 2</Label>
                    <Input id="telephoneParent2" type="tel" value={formData.telephoneParent2} onChange={(e) => setFormData({ ...formData, telephoneParent2: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emailParents">Email des parents *</Label>
                    <Input id="emailParents" type="email" value={formData.emailParents} onChange={(e) => setFormData({ ...formData, emailParents: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contactUrgence">Contact d'urgence *</Label>
                    <Input id="contactUrgence" value={formData.contactUrgence} onChange={(e) => setFormData({ ...formData, contactUrgence: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lienContactUrgence">Lien avec l'enfant *</Label>
                    <Input id="lienContactUrgence" value={formData.lienContactUrgence} onChange={(e) => setFormData({ ...formData, lienContactUrgence: e.target.value })} required />
                  </div>
                </div>
              </div>

              {/* 3. PARCOURS SPIRITUEL */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">3. Parcours spirituel</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="dateConversion">Date de conversion</Label>
                    <Input id="dateConversion" type="date" value={formData.dateConversion as string} onChange={(e) => setFormData({ ...formData, dateConversion: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dateBapteme">Date de baptême</Label>
                    <Input id="dateBapteme" type="date" value={formData.dateBapteme as string} onChange={(e) => setFormData({ ...formData, dateBapteme: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dateAdhesion">Date d'adhésion</Label>
                    <Input id="dateAdhesion" type="date" value={formData.dateAdhesion as string} onChange={(e) => setFormData({ ...formData, dateAdhesion: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Es-tu baptisé du Saint-Esprit ? *</Label>
                    <RadioGroup value={formData.baptiseSaintEsprit} onValueChange={(value: any) => setFormData({ ...formData, baptiseSaintEsprit: value })}>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Oui" id="bse-oui-edit" /><Label htmlFor="bse-oui-edit" className="font-normal cursor-pointer">Oui</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Non" id="bse-non-edit" /><Label htmlFor="bse-non-edit" className="font-normal cursor-pointer">Non</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="NSP" id="bse-nsp-edit" /><Label htmlFor="bse-nsp-edit" className="font-normal cursor-pointer">NSP</Label></div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label>As-tu donné ta vie à Jésus ? *</Label>
                    <RadioGroup value={formData.vieDonneeAJesus} onValueChange={(value: any) => setFormData({ ...formData, vieDonneeAJesus: value })}>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Oui" id="vie-oui-edit" /><Label htmlFor="vie-oui-edit" className="font-normal cursor-pointer">Oui</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Non" id="vie-non-edit" /><Label htmlFor="vie-non-edit" className="font-normal cursor-pointer">Non</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Je ne sais pas" id="vie-nsp-edit" /><Label htmlFor="vie-nsp-edit" className="font-normal cursor-pointer">Je ne sais pas</Label></div>
                    </RadioGroup>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="estOuvrier-edit" checked={formData.estOuvrier} onCheckedChange={(checked) => setFormData({ ...formData, estOuvrier: checked as boolean })} />
                    <Label htmlFor="estOuvrier-edit" className="cursor-pointer">Es-tu ouvrier / ouvrière ?</Label>
                  </div>
                  {formData.estOuvrier && (
                    <div className="grid gap-2">
                      <Label htmlFor="commissionActuelle">Commission actuelle</Label>
                      <Input id="commissionActuelle" value={formData.commissionActuelle} onChange={(e) => setFormData({ ...formData, commissionActuelle: e.target.value })} />
                    </div>
                  )}
                  {!formData.estOuvrier && (
                    <div className="grid gap-2">
                      <Label htmlFor="commissionSouhaitee">Commission souhaitée</Label>
                      <Select value={formData.commissionSouhaitee} onValueChange={(value) => setFormData({ ...formData, commissionSouhaitee: value })}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Louange">Louange</SelectItem>
                          <SelectItem value="Accueil">Accueil</SelectItem>
                          <SelectItem value="Technique">Technique</SelectItem>
                          <SelectItem value="Intercession">Intercession</SelectItem>
                          <SelectItem value="Enseignement">Enseignement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. SANTÉ & BESOINS SPÉCIFIQUES */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">4. Santé & besoins spécifiques</h3>
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="allergiesConnues-edit" checked={formData.allergiesConnues} onCheckedChange={(checked) => setFormData({ ...formData, allergiesConnues: checked as boolean })} />
                    <Label htmlFor="allergiesConnues-edit" className="cursor-pointer">Allergies connues ?</Label>
                  </div>
                  {formData.allergiesConnues && (
                    <div className="grid gap-2">
                      <Label htmlFor="allergiesDetails">Détails des allergies</Label>
                      <Textarea id="allergiesDetails" value={formData.allergiesDetails} onChange={(e) => setFormData({ ...formData, allergiesDetails: e.target.value })} rows={2} />
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="maladies">Maladie / condition particulière</Label>
                    <Textarea id="maladies" value={formData.maladies} onChange={(e) => setFormData({ ...formData, maladies: e.target.value })} rows={2} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="traitement">Traitement à suivre</Label>
                    <Input id="traitement" value={formData.traitement} onChange={(e) => setFormData({ ...formData, traitement: e.target.value })} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="autorisationSoins-edit" checked={formData.autorisationSoins} onCheckedChange={(checked) => setFormData({ ...formData, autorisationSoins: checked as boolean })} />
                    <Label htmlFor="autorisationSoins-edit" className="cursor-pointer">Autorisation de soins d'urgence</Label>
                  </div>
                </div>
              </div>

              {/* 5. ÉVALUATION PERSONNELLE */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">5. Évaluation personnelle</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="vieChretienne">Vie chrétienne</Label>
                    <Select value={formData.vieChretienne} onValueChange={(value: any) => setFormData({ ...formData, vieChretienne: value })}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Très bonne">Très bonne</SelectItem>
                        <SelectItem value="Bonne">Bonne</SelectItem>
                        <SelectItem value="Moyenne">Moyenne</SelectItem>
                        <SelectItem value="Faible">Faible</SelectItem>
                        <SelectItem value="Très mauvaise">Très mauvaise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="viePriere">Vie de prière</Label>
                    <Select value={formData.viePriere} onValueChange={(value: any) => setFormData({ ...formData, viePriere: value })}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellente">Excellente</SelectItem>
                        <SelectItem value="Bonne">Bonne</SelectItem>
                        <SelectItem value="Moyenne">Moyenne</SelectItem>
                        <SelectItem value="Faible">Faible</SelectItem>
                        <SelectItem value="Très faible">Très faible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="comprehensionBible">Compréhension Bible</Label>
                    <Select value={formData.comprehensionBible} onValueChange={(value: any) => setFormData({ ...formData, comprehensionBible: value })}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellente">Excellente</SelectItem>
                        <SelectItem value="Bonne">Bonne</SelectItem>
                        <SelectItem value="Moyenne">Moyenne</SelectItem>
                        <SelectItem value="Faible">Faible</SelectItem>
                        <SelectItem value="Très faible">Très faible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="qualiteEnseignements">Qualité enseignements</Label>
                    <Select value={formData.qualiteEnseignements} onValueChange={(value: any) => setFormData({ ...formData, qualiteEnseignements: value })}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bonne">Bonne</SelectItem>
                        <SelectItem value="Moyenne">Moyenne</SelectItem>
                        <SelectItem value="Faible">Faible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>As-tu déjà gagné une âme ?</Label>
                    <RadioGroup value={formData.gagneUneAme} onValueChange={(value: any) => setFormData({ ...formData, gagneUneAme: value })}>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Oui" id="ame-oui-edit" /><Label htmlFor="ame-oui-edit" className="font-normal cursor-pointer">Oui</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Non" id="ame-non-edit" /><Label htmlFor="ame-non-edit" className="font-normal cursor-pointer">Non</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Je ne sais pas" id="ame-nsp-edit" /><Label htmlFor="ame-nsp-edit" className="font-normal cursor-pointer">Je ne sais pas</Label></div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label>As-tu un encadreur ?</Label>
                    <RadioGroup value={formData.encadreur} onValueChange={(value: any) => setFormData({ ...formData, encadreur: value })}>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Oui" id="enc-oui-edit" /><Label htmlFor="enc-oui-edit" className="font-normal cursor-pointer">Oui</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Non" id="enc-non-edit" /><Label htmlFor="enc-non-edit" className="font-normal cursor-pointer">Non</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="NSP" id="enc-nsp-edit" /><Label htmlFor="enc-nsp-edit" className="font-normal cursor-pointer">NSP</Label></div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sujetSouhaite">Sujet souhaité</Label>
                    <Input id="sujetSouhaite" value={formData.sujetSouhaite} onChange={(e) => setFormData({ ...formData, sujetSouhaite: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="besoinSuggestion">Besoin / Suggestion</Label>
                    <Textarea id="besoinSuggestion" value={formData.besoinSuggestion} onChange={(e) => setFormData({ ...formData, besoinSuggestion: e.target.value })} rows={3} />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="pr-4 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button type="submit">Enregistrer les modifications</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
