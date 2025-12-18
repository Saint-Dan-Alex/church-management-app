"use client"

import type React from "react"
import { useState, useRef } from "react"
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
import { Upload, Loader2, Camera } from "lucide-react"
import type { ChildFormData } from "@/types/child"
import { childrenService } from "@/lib/services/children.service"
import { toast } from "sonner"
import { CommissionCombobox } from "./commission-combobox"

interface AddChildDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddChildDialog({ open, onOpenChange, onSuccess }: AddChildDialogProps) {
  const [formData, setFormData] = useState<Partial<ChildFormData>>({
    // Identification
    nom: "",
    postNom: "",
    prenom: "",
    dateNaissance: "",
    genre: "Masculin",
    etatCivil: "Célibataire",
    adresse: "",
    telephone: "",
    email: "",
    photo: "",
    // Famille
    nomPere: "",
    nomMere: "",
    telephoneParent1: "",
    telephoneParent2: "",
    emailParents: "",
    contactUrgence: "",
    lienContactUrgence: "",
    // Parcours spirituel
    dateConversion: "",
    dateBapteme: "",
    baptiseSaintEsprit: "Non",
    vieDonneeAJesus: "Non",
    estOuvrier: false,
    commissionActuelle: "",
    commissionSouhaitee: "",
    dateAdhesion: "",
    // Santé
    allergiesConnues: false,
    allergiesDetails: "",
    maladies: "",
    traitement: "",
    autorisationSoins: false,
    // Évaluation
    vieChretienne: undefined,
    viePriere: undefined,
    comprehensionBible: undefined,
    gagneUneAme: "Non",
    encadreur: "Non",
    qualiteEnseignements: undefined,
    sujetSouhaite: "",
    besoinSuggestion: "",
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleStartCamera = async () => {
    try {
      setIsCameraOpen(true)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Erreur caméra:", err)
      toast.error("Impossible d'accéder à la caméra")
      setIsCameraOpen(false)
    }
  }

  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCameraOpen(false)
  }

  const handleTakePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const base64String = canvas.toDataURL("image/jpeg")
        setPhotoPreview(base64String)
        setFormData({ ...formData, photo: base64String })
        handleStopCamera()
      }
    }
  }

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
    setIsLoading(true)

    try {
      // Calculer le nom complet
      const nomComplet = `${formData.prenom} ${formData.postNom} ${formData.nom}`.trim()
      const payload: any = {
        nom: formData.nom,
        post_nom: formData.postNom,
        prenom: formData.prenom,
        nom_complet: nomComplet,
        date_naissance: formData.dateNaissance,
        genre: formData.genre,
        etat_civil: formData.etatCivil,
        adresse: formData.adresse,
        telephone: formData.telephone,
        email: formData.email,
        photo: formData.photo,
        nom_pere: formData.nomPere,
        nom_mere: formData.nomMere,
        telephone_parent1: formData.telephoneParent1,
        telephone_parent2: formData.telephoneParent2,
        email_parents: formData.emailParents,
        contact_urgence: formData.contactUrgence,
        lien_contact_urgence: formData.lienContactUrgence,
        date_conversion: formData.dateConversion || null,
        date_bapteme: formData.dateBapteme || null,
        baptise_saint_esprit: formData.baptiseSaintEsprit,
        vie_donnee_a_jesus: formData.vieDonneeAJesus,
        est_ouvrier: Boolean(formData.estOuvrier),
        commission_actuelle: formData.commissionActuelle,
        commission_souhaitee: formData.commissionSouhaitee,
        date_adhesion: formData.dateAdhesion || null,
        allergies_connues: Boolean(formData.allergiesConnues),
        allergies_details: formData.allergiesDetails,
        maladies: formData.maladies,
        traitement: formData.traitement,
        autorisation_soins: Boolean(formData.autorisationSoins),
        vie_chretienne: formData.vieChretienne,
        vie_priere: formData.viePriere,
        comprehension_bible: formData.comprehensionBible,
        gagne_une_ame: formData.gagneUneAme,
        encadreur: formData.encadreur,
        qualite_enseignements: formData.qualiteEnseignements,
        sujet_souhaite: formData.sujetSouhaite,
        besoin_suggestion: formData.besoinSuggestion,
      }

      await childrenService.create(payload)
      toast.success("Enfant ajouté avec succès")
      if (onSuccess) onSuccess()
      onOpenChange(false)
      handleStopCamera()
      setPhotoPreview(null)
      setFormData({
        nom: "", postNom: "", prenom: "", dateNaissance: "",
        genre: "Masculin", etatCivil: "Célibataire", adresse: "", telephone: "", email: "", photo: "",
        nomPere: "", nomMere: "", telephoneParent1: "", telephoneParent2: "", emailParents: "",
        contactUrgence: "", lienContactUrgence: "",
        dateConversion: "", dateBapteme: "", baptiseSaintEsprit: "Non", vieDonneeAJesus: "Non",
        estOuvrier: false, commissionActuelle: "", commissionSouhaitee: "", dateAdhesion: "",
        allergiesConnues: false, allergiesDetails: "", maladies: "", traitement: "", autorisationSoins: false,
        vieChretienne: undefined, viePriere: undefined, comprehensionBible: undefined, gagneUneAme: "Non",
        encadreur: "Non", qualiteEnseignements: undefined, sujetSouhaite: "", besoinSuggestion: ""
      })
    } catch (error) {
      console.error("Erreur ajout enfant:", error)
      toast.error("Erreur lors de l'enregistrement")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        handleStopCamera()
      }
      onOpenChange(isOpen)
    }}>
      <DialogContent className="sm:max-w-[600px] max-w-[calc(100vw-2rem)]">
        <DialogHeader>
          <DialogTitle>Ajouter un Enfant</DialogTitle>
          <DialogDescription>Remplissez les informations de l'enfant et de son parent/tuteur</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh] w-full">
          <form onSubmit={handleSubmit} className="w-full max-w-full overflow-hidden">
            <div className="grid gap-6 py-4 pr-4 w-full">
              {/* Photo */}
              <div className="flex flex-col items-center gap-4">
                {isCameraOpen ? (
                  <div className="flex flex-col items-center gap-2 w-full max-w-sm">
                    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="destructive" size="sm" onClick={handleStopCamera}>
                        Annuler
                      </Button>
                      <Button type="button" size="sm" onClick={handleTakePhoto}>
                        Capturer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={photoPreview || undefined} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Upload className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-4">
                      <div>
                        <Label htmlFor="photo" className="cursor-pointer">
                          <div className="flex items-center gap-2 text-sm text-blue-600 hover:underline px-3 py-2 bg-blue-50 rounded-md">
                            <Upload className="h-4 w-4" />
                            {photoPreview ? 'Changer' : 'Importer'}
                          </div>
                        </Label>
                        <Input id="photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={handleStartCamera}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Caméra
                      </Button>
                    </div>
                  </>
                )}
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
                    <Input id="lienContactUrgence" placeholder="Ex: oncle, voisin..." value={formData.lienContactUrgence} onChange={(e) => setFormData({ ...formData, lienContactUrgence: e.target.value })} required />
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
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Oui" id="bse-oui" /><Label htmlFor="bse-oui" className="font-normal cursor-pointer">Oui</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Non" id="bse-non" /><Label htmlFor="bse-non" className="font-normal cursor-pointer">Non</Label></div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label>As-tu donné ta vie à Jésus ? *</Label>
                    <RadioGroup value={formData.vieDonneeAJesus} onValueChange={(value: any) => setFormData({ ...formData, vieDonneeAJesus: value })}>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Oui" id="vie-oui" /><Label htmlFor="vie-oui" className="font-normal cursor-pointer">Oui</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Non" id="vie-non" /><Label htmlFor="vie-non" className="font-normal cursor-pointer">Non</Label></div>
                    </RadioGroup>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="estOuvrier" checked={formData.estOuvrier} onCheckedChange={(checked) => setFormData({ ...formData, estOuvrier: checked as boolean })} />
                    <Label htmlFor="estOuvrier" className="cursor-pointer">Es-tu ouvrier / ouvrière ?</Label>
                  </div>
                  {formData.estOuvrier && (
                    <div className="grid gap-2">
                      <Label htmlFor="commissionActuelle">Commission actuelle</Label>
                      <CommissionCombobox
                        value={formData.commissionActuelle}
                        onValueChange={(value) => setFormData({ ...formData, commissionActuelle: value })}
                        placeholder="Sélectionner ou créer une commission..."
                      />
                    </div>
                  )}
                  {!formData.estOuvrier && (
                    <div className="grid gap-2">
                      <Label htmlFor="commissionSouhaitee">Commission souhaitée</Label>
                      <CommissionCombobox
                        value={formData.commissionSouhaitee}
                        onValueChange={(value) => setFormData({ ...formData, commissionSouhaitee: value })}
                        placeholder="Sélectionner ou créer une commission..."
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 4. SANTÉ & BESOINS SPÉCIFIQUES */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">4. Santé & besoins spécifiques</h3>
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="allergiesConnues" checked={formData.allergiesConnues} onCheckedChange={(checked) => setFormData({ ...formData, allergiesConnues: checked as boolean })} />
                    <Label htmlFor="allergiesConnues" className="cursor-pointer">Allergies connues ?</Label>
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
                    <Checkbox id="autorisationSoins" checked={formData.autorisationSoins} onCheckedChange={(checked) => setFormData({ ...formData, autorisationSoins: checked as boolean })} />
                    <Label htmlFor="autorisationSoins" className="cursor-pointer">Autorisation de soins d'urgence</Label>
                  </div>
                </div>
              </div>

              {/* 5. ÉVALUATION PERSONNELLE */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">5. Évaluation personnelle (adolescents / pré-ados)</h3>
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
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Oui" id="ame-oui" /><Label htmlFor="ame-oui" className="font-normal cursor-pointer">Oui</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Non" id="ame-non" /><Label htmlFor="ame-non" className="font-normal cursor-pointer">Non</Label></div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label>As-tu un encadreur ?</Label>
                    <RadioGroup value={formData.encadreur} onValueChange={(value: any) => setFormData({ ...formData, encadreur: value })}>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Oui" id="enc-oui" /><Label htmlFor="enc-oui" className="font-normal cursor-pointer">Oui</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Non" id="enc-non" /><Label htmlFor="enc-non" className="font-normal cursor-pointer">Non</Label></div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sujetSouhaite">Sujet souhaité</Label>
                    <Input id="sujetSouhaite" value={formData.sujetSouhaite} onChange={(e) => setFormData({ ...formData, sujetSouhaite: e.target.value })} placeholder="Sujet à aborder..." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="besoinSuggestion">Besoin / Suggestion</Label>
                    <Textarea id="besoinSuggestion" value={formData.besoinSuggestion} onChange={(e) => setFormData({ ...formData, besoinSuggestion: e.target.value })} rows={3} placeholder="Vos suggestions..." />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="pr-4 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
