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
import { Upload, Loader2 } from "lucide-react"
import type { Child } from "@/lib/types/api"
import { childrenService } from "@/lib/services/children.service"
import { toast } from "sonner"

interface EditChildDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  child: Child | null
}

export function EditChildDialog({ open, onOpenChange, child }: EditChildDialogProps) {
  // Use snake_case keys in formData to match backend and child prop
  const [formData, setFormData] = useState<Partial<Child>>({})
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Helper to safely format dates for input type="date" (YYYY-MM-DD)
  const formatDateForInput = (dateString?: string | null) => {
    if (!dateString) return ''
    // If it's already a Date object (unlikely from API but possible in typing)
    if (dateString instanceof Date) return (dateString as Date).toISOString().split('T')[0]

    // If string matches YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      return dateString.split('T')[0]
    }

    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]
      }
    } catch (e) {
      return ''
    }
    return ''
  }

  useEffect(() => {
    if (child) {
      setFormData({
        ...child,
        date_naissance: formatDateForInput(child.date_naissance),
        date_conversion: formatDateForInput(child.date_conversion),
        date_bapteme: formatDateForInput(child.date_bapteme),
        date_adhesion: formatDateForInput(child.date_adhesion),
      })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!child?.id) return

    try {
      setIsLoading(true)

      // Construct payload ensure booleans etc are correct if needed (though inputs manage them mostly)
      const payload: any = { ...formData }

      // Fix empty dates sending as "" which fails strict date validation in backend
      const dateFields = ['date_naissance', 'date_conversion', 'date_bapteme', 'date_adhesion']
      dateFields.forEach(field => {
        if (payload[field] === '') {
          payload[field] = null
        }
      })

      // Update nom_complet if parts changed (optional, backend handles virtual, but frontend might need it)
      if (payload.nom || payload.post_nom || payload.prenom) {
        const nom = payload.nom || child.nom || ''
        const postNom = payload.post_nom !== undefined ? payload.post_nom : (child.post_nom || '')
        const prenom = payload.prenom || child.prenom || ''
        payload.nom_complet = `${nom} ${postNom ? postNom + ' ' : ''}${prenom}`.trim()
      }

      await childrenService.update(child.id, payload)
      toast.success("Enfant mis à jour avec succès")
      onOpenChange(false)
      window.location.reload() // Simple way to refresh data on the page

    } catch (error: any) {
      console.error(error)
      let errorMessage = "Erreur lors de la mise à jour de l'enfant"

      if (error?.data?.errors) {
        const details = Object.values(error.data.errors).flat().join(', ')
        if (details) errorMessage += `: ${details}`
      } else if (error?.data?.message) {
        errorMessage += `: ${error.data.message}`
      }

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
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
                    <Input id="nom" value={formData.nom || ''} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="post_nom">Post-nom</Label>
                    <Input id="post_nom" value={formData.post_nom || ''} onChange={(e) => setFormData({ ...formData, post_nom: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input id="prenom" value={formData.prenom || ''} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date_naissance">Date de naissance *</Label>
                    <Input id="date_naissance" type="date" value={formData.date_naissance as string || ''} onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })} required />
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
                    <Label htmlFor="etat_civil">État civil *</Label>
                    <Select value={formData.etat_civil} onValueChange={(value: any) => setFormData({ ...formData, etat_civil: value })}>
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
                    <Input id="telephone" type="tel" value={formData.telephone || ''} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="adresse">Adresse complète *</Label>
                  <Textarea id="adresse" value={formData.adresse || ''} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} rows={2} required />
                </div>
              </div>

              {/* 2. INFORMATIONS FAMILIALES */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">2. Informations familiales</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="nom_pere">Nom du père *</Label>
                    <Input id="nom_pere" value={formData.nom_pere || ''} onChange={(e) => setFormData({ ...formData, nom_pere: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nom_mere">Nom de la mère *</Label>
                    <Input id="nom_mere" value={formData.nom_mere || ''} onChange={(e) => setFormData({ ...formData, nom_mere: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="telephone_parent1">Téléphone parent 1 *</Label>
                    <Input id="telephone_parent1" type="tel" value={formData.telephone_parent1 || ''} onChange={(e) => setFormData({ ...formData, telephone_parent1: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="telephone_parent2">Téléphone parent 2</Label>
                    <Input id="telephone_parent2" type="tel" value={formData.telephone_parent2 || ''} onChange={(e) => setFormData({ ...formData, telephone_parent2: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email_parents">Email des parents *</Label>
                    <Input id="email_parents" type="email" value={formData.email_parents || ''} onChange={(e) => setFormData({ ...formData, email_parents: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contact_urgence">Contact d'urgence *</Label>
                    <Input id="contact_urgence" value={formData.contact_urgence || ''} onChange={(e) => setFormData({ ...formData, contact_urgence: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lien_contact_urgence">Lien avec l'enfant *</Label>
                    <Input id="lien_contact_urgence" value={formData.lien_contact_urgence || ''} onChange={(e) => setFormData({ ...formData, lien_contact_urgence: e.target.value })} required />
                  </div>
                </div>
              </div>

              {/* 3. PARCOURS SPIRITUEL */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">3. Parcours spirituel</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="date_conversion">Date de conversion</Label>
                    <Input id="date_conversion" type="date" value={formData.date_conversion as string || ''} onChange={(e) => setFormData({ ...formData, date_conversion: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date_bapteme">Date de baptême</Label>
                    <Input id="date_bapteme" type="date" value={formData.date_bapteme as string || ''} onChange={(e) => setFormData({ ...formData, date_bapteme: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date_adhesion">Date d'adhésion</Label>
                    <Input id="date_adhesion" type="date" value={formData.date_adhesion as string || ''} onChange={(e) => setFormData({ ...formData, date_adhesion: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Es-tu baptisé du Saint-Esprit ? *</Label>
                    <RadioGroup value={formData.baptise_saint_esprit} onValueChange={(value: any) => setFormData({ ...formData, baptise_saint_esprit: value })}>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Oui" id="bse-oui-edit" /><Label htmlFor="bse-oui-edit" className="font-normal cursor-pointer">Oui</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Non" id="bse-non-edit" /><Label htmlFor="bse-non-edit" className="font-normal cursor-pointer">Non</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="NSP" id="bse-nsp-edit" /><Label htmlFor="bse-nsp-edit" className="font-normal cursor-pointer">NSP</Label></div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label>As-tu donné ta vie à Jésus ? *</Label>
                    <RadioGroup value={formData.vie_donnee_a_jesus} onValueChange={(value: any) => setFormData({ ...formData, vie_donnee_a_jesus: value })}>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Oui" id="vie-oui-edit" /><Label htmlFor="vie-oui-edit" className="font-normal cursor-pointer">Oui</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Non" id="vie-non-edit" /><Label htmlFor="vie-non-edit" className="font-normal cursor-pointer">Non</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Je ne sais pas" id="vie-nsp-edit" /><Label htmlFor="vie-nsp-edit" className="font-normal cursor-pointer">Je ne sais pas</Label></div>
                    </RadioGroup>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="est_ouvrier-edit" checked={formData.est_ouvrier} onCheckedChange={(checked) => setFormData({ ...formData, est_ouvrier: checked as boolean })} />
                    <Label htmlFor="est_ouvrier-edit" className="cursor-pointer">Es-tu ouvrier / ouvrière ?</Label>
                  </div>
                  {formData.est_ouvrier && (
                    <div className="grid gap-2">
                      <Label htmlFor="commission_actuelle">Commission actuelle</Label>
                      <Input id="commission_actuelle" value={formData.commission_actuelle || ''} onChange={(e) => setFormData({ ...formData, commission_actuelle: e.target.value })} />
                    </div>
                  )}
                  {!formData.est_ouvrier && (
                    <div className="grid gap-2">
                      <Label htmlFor="commission_souhaitee">Commission souhaitée</Label>
                      <Select value={formData.commission_souhaitee} onValueChange={(value) => setFormData({ ...formData, commission_souhaitee: value })}>
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
                    <Checkbox id="allergies_connues-edit" checked={formData.allergies_connues} onCheckedChange={(checked) => setFormData({ ...formData, allergies_connues: checked as boolean })} />
                    <Label htmlFor="allergies_connues-edit" className="cursor-pointer">Allergies connues ?</Label>
                  </div>
                  {formData.allergies_connues && (
                    <div className="grid gap-2">
                      <Label htmlFor="allergies_details">Détails des allergies</Label>
                      <Textarea id="allergies_details" value={formData.allergies_details || ''} onChange={(e) => setFormData({ ...formData, allergies_details: e.target.value })} rows={2} />
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="maladies">Maladie / condition particulière</Label>
                    <Textarea id="maladies" value={formData.maladies || ''} onChange={(e) => setFormData({ ...formData, maladies: e.target.value })} rows={2} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="traitement">Traitement à suivre</Label>
                    <Input id="traitement" value={formData.traitement || ''} onChange={(e) => setFormData({ ...formData, traitement: e.target.value })} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="autorisation_soins-edit" checked={formData.autorisation_soins} onCheckedChange={(checked) => setFormData({ ...formData, autorisation_soins: checked as boolean })} />
                    <Label htmlFor="autorisation_soins-edit" className="cursor-pointer">Autorisation de soins d'urgence</Label>
                  </div>
                </div>
              </div>

              {/* 5. ÉVALUATION PERSONNELLE */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">5. Évaluation personnelle</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="vie_chretienne">Vie chrétienne</Label>
                    <Select value={formData.vie_chretienne} onValueChange={(value: any) => setFormData({ ...formData, vie_chretienne: value })}>
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
                    <Label htmlFor="vie_priere">Vie de prière</Label>
                    <Select value={formData.vie_priere} onValueChange={(value: any) => setFormData({ ...formData, vie_priere: value })}>
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
                    <Label htmlFor="comprehension_bible">Compréhension Bible</Label>
                    <Select value={formData.comprehension_bible} onValueChange={(value: any) => setFormData({ ...formData, comprehension_bible: value })}>
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
                    <Label htmlFor="qualite_enseignements">Qualité enseignements</Label>
                    <Select value={formData.qualite_enseignements} onValueChange={(value: any) => setFormData({ ...formData, qualite_enseignements: value })}>
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
                    <RadioGroup value={formData.gagne_une_ame} onValueChange={(value: any) => setFormData({ ...formData, gagne_une_ame: value })}>
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
                    <Label htmlFor="sujet_souhaite">Sujet souhaité</Label>
                    <Input id="sujet_souhaite" value={formData.sujet_souhaite || ''} onChange={(e) => setFormData({ ...formData, sujet_souhaite: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="besoin_suggestion">Besoin / Suggestion</Label>
                    <Textarea id="besoin_suggestion" value={formData.besoin_suggestion || ''} onChange={(e) => setFormData({ ...formData, besoin_suggestion: e.target.value })} rows={3} />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="pr-4 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer les modifications"
                )}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
