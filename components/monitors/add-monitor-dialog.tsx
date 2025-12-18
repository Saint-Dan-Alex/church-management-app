"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
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
import { Upload, Loader2, Camera } from "lucide-react"
import { toast } from "sonner"
import type { Monitor } from "@/types/monitor"
import { monitorsService } from "@/lib/services/monitors.service"
import { sallesService } from "@/lib/services/salles.service"
import { rolesService } from "@/lib/services/roles.service"

// Types
type Salle = {
  id: string
  nom: string
}

type Role = {
  id: number
  name: string
}

type AddMonitorDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMonitorAdded?: (monitor: Monitor) => void
}

export function AddMonitorDialog({ open, onOpenChange, onMonitorAdded }: AddMonitorDialogProps) {
  const [formData, setFormData] = useState<Partial<Monitor>>({
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
    roleActuel: undefined,
  })

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [salles, setSalles] = useState<Salle[]>([])
  const [roles, setRoles] = useState<Role[]>([])

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Charger les salles disponibles depuis l'API Laravel
  useEffect(() => {
    const fetchSalles = async () => {
      try {
        const response = await sallesService.getAll()
        const sallesArray = Array.isArray(response)
          ? response
          : Array.isArray((response as any).data)
            ? (response as any).data
            : []
        setSalles(sallesArray)
      } catch (err) {
        console.error('Erreur lors du chargement des salles:', err)
        toast.error("Impossible de charger les salles")
      }
    }

    if (open) {
      fetchSalles()
    }
  }, [open])

  // Charger les rôles disponibles depuis l'API Laravel
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await rolesService.getAll()
        setRoles(data)
      } catch (err) {
        console.error('Erreur lors du chargement des rôles:', err)
        toast.error("Impossible de charger les rôles")
      }
    }

    if (open) {
      fetchRoles()
    }
  }, [open])

  // Stop camera when dialog closes
  useEffect(() => {
    if (!open) {
      handleStopCamera()
    }
  }, [open])

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
        setFormData(prev => ({ ...prev, photo: base64String }))
        handleStopCamera()
      }
    }
  }

  const resetForm = () => {
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
      roleActuel: undefined,
    })
    setPhotoPreview(null)
    setError(null)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPhotoPreview(base64String)
        setFormData(prev => ({ ...prev, photo: base64String }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone || !formData.adresse || !formData.dateAdhesion) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const monitorData = {
        ...formData,
        dateNaissance: formData.dateNaissance || null,
        dateConversion: formData.dateConversion || null,
        dateBapteme: formData.dateBapteme || null,
        dateAdhesion: formData.dateAdhesion || null,
        dateAffectationActuelle: formData.dateAffectationActuelle || null,
        baptiseSaintEsprit: Boolean(formData.baptiseSaintEsprit),
        ...(photoPreview && { photo: photoPreview })
      }

      console.log("Données envoyées:", monitorData)

      const newMonitor = await monitorsService.create(monitorData)
      toast.success("Moniteur ajouté avec succès")
      onOpenChange(false)
      resetForm()
      handleStopCamera()

      if (onMonitorAdded) {
        onMonitorAdded(newMonitor as any)
      }

    } catch (err: any) {
      console.error('Erreur lors de l\'ajout du moniteur:', err)
      let errorMessage = "Une erreur est survenue lors de l'ajout du moniteur"
      if (err.status === 422 && err.data) {
        if (err.data.errors) {
          const validationErrors = Object.values(err.data.errors).flat().join(', ')
          errorMessage = `Erreur de validation: ${validationErrors}`
        } else if (err.data.message) {
          errorMessage = err.data.message
        }
      } else if (err.message) {
        errorMessage = err.message
      }
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        resetForm()
        handleStopCamera()
      }
      onOpenChange(isOpen)
    }}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un Moniteur</DialogTitle>
          <DialogDescription>Remplissez les informations du nouveau moniteur</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Photo Section */}
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
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                        disabled={isLoading}
                      />
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

            {/* Informations personnelles */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom || ''}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Dupont"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postNom">Post-nom</Label>
                <Input
                  id="postNom"
                  value={formData.postNom || ''}
                  onChange={(e) => setFormData({ ...formData, postNom: e.target.value })}
                  placeholder="Martin"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom || ''}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  placeholder="Jean"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dateNaissance">Date de naissance *</Label>
                <Input
                  id="dateNaissance"
                  type="date"
                  value={formData.dateNaissance ? new Date(formData.dateNaissance).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                  required
                  disabled={isLoading}
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
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jean.dupont@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone || ''}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="adresse">Adresse *</Label>
              <Textarea
                id="adresse"
                value={formData.adresse || ''}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                placeholder="123 Rue de l'Église, 75000 Paris"
                required
                rows={2}
                disabled={isLoading}
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
                    value={formData.dateConversion ? new Date(formData.dateConversion).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, dateConversion: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateBapteme">Date de baptême d'eau</Label>
                  <Input
                    id="dateBapteme"
                    type="date"
                    value={formData.dateBapteme ? new Date(formData.dateBapteme).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, dateBapteme: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Baptisé du Saint-Esprit</Label>
                  <RadioGroup
                    value={formData.baptiseSaintEsprit ? "oui" : "non"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, baptiseSaintEsprit: value === "oui" })
                    }
                    className="flex space-x-4"
                    disabled={isLoading}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="oui" id="baptise-oui" />
                      <Label htmlFor="baptise-oui">Oui</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non" id="baptise-non" />
                      <Label htmlFor="baptise-non">Non</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Informations d'adhésion */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900">Adhésion</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="dateAdhesion">Date d'adhésion *</Label>
                  <Input
                    id="dateAdhesion"
                    type="date"
                    value={formData.dateAdhesion ? new Date(formData.dateAdhesion).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, dateAdhesion: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="etatCivil">État civil</Label>
                  <Select
                    value={formData.etatCivil}
                    onValueChange={(value) =>
                      setFormData({ ...formData, etatCivil: value as any })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un état civil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Célibataire">Célibataire</SelectItem>
                      <SelectItem value="Marié(e)">Marié(e)</SelectItem>
                      <SelectItem value="Divorcé(e)">Divorcé(e)</SelectItem>
                      <SelectItem value="Veuf(ve)">Veuf(ve)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Affectation actuelle */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900">Affectation actuelle</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="salleActuelleId">Salle</Label>
                  <Select
                    value={formData.salleActuelleId || ''}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        salleActuelleId: value,
                        dateAffectationActuelle: new Date().toISOString().split('T')[0],
                      })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une salle" />
                    </SelectTrigger>
                    <SelectContent>
                      {salles.map((salle) => (
                        <SelectItem key={salle.id} value={salle.id}>
                          {salle.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="roleActuel">Rôle</Label>
                  <Select
                    value={formData.roleActuel || ''}
                    onValueChange={(value) =>
                      setFormData({ ...formData, roleActuel: value as any })
                    }
                    disabled={isLoading || roles.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Ajouter le moniteur'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
