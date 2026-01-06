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
import { useUser } from "@/hooks/use-user"

interface EditMonitorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  monitor: Monitor | null
  onSave: (monitor: Monitor) => void
}

export function EditMonitorDialog({ open, onOpenChange, monitor, onSave }: EditMonitorDialogProps) {
  const { user } = useUser()
  const [formData, setFormData] = useState<Partial<Monitor>>({})
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [salles, setSalles] = useState<{ id: string, nom: string }[]>([])
  const [roles, setRoles] = useState<{ id: string, name: string }[]>([])

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

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
      }
    }

    const fetchRoles = async () => {
      try {
        const data = await rolesService.getAll()
        const rolesArray = Array.isArray(data)
          ? data
          : Array.isArray((data as any).data)
            ? (data as any).data
            : []
        setRoles(rolesArray)
      } catch (err) {
        console.error('Erreur lors du chargement des rôles:', err)
      }
    }

    if (open) {
      fetchSalles()
      fetchRoles()

      if (monitor) {
        console.log("Loading monitor for edit:", monitor)
        setFormData({
          ...monitor,
          // Ensure dates are formatted YYYY-MM-DD for inputs
          dateNaissance: monitor.dateNaissance ? new Date(monitor.dateNaissance).toISOString().split('T')[0] : '',
          dateAdhesion: monitor.dateAdhesion ? new Date(monitor.dateAdhesion).toISOString().split('T')[0] : '',
          dateConversion: monitor.dateConversion ? new Date(monitor.dateConversion).toISOString().split('T')[0] : '',
          dateBapteme: monitor.dateBapteme ? new Date(monitor.dateBapteme).toISOString().split('T')[0] : '',
          dateAffectationActuelle: monitor.dateAffectationActuelle ? new Date(monitor.dateAffectationActuelle).toISOString().split('T')[0] : '',
          salleActuelleId: monitor.salleActuelleId || undefined,
          roleActuel: monitor.roleActuel || undefined
        })
        setPhotoPreview(monitor.photo || null)
      }
    }

    return () => {
      setFormData({})
      setPhotoPreview(null)
      setError(null)
      handleStopCamera()
    }
  }, [open, monitor])

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
    if (!formData.id) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await monitorsService.update(formData.id, formData)
      // L'API retourne parfois l'objet enveloppé dans "data"
      const updatedMonitor = (response as any).data ? (response as any).data : response
      onSave(updatedMonitor)
      toast.success("Moniteur mis à jour avec succès")
      onOpenChange(false)
      handleStopCamera()
    } catch (err) {
      console.error('Erreur lors de la mise à jour du moniteur:', err)
      setError('Une erreur est survenue lors de la mise à jour du moniteur')
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setIsLoading(false)
    }
  }

  if (!monitor) return null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        handleStopCamera()
      }
      onOpenChange(isOpen)
    }}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le Moniteur</DialogTitle>
          <DialogDescription>Modifiez les informations du moniteur</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
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
                      <Label htmlFor="photo-edit" className="cursor-pointer">
                        <div className="flex items-center gap-2 text-sm text-blue-600 hover:underline px-3 py-2 bg-blue-50 rounded-md">
                          <Upload className="h-4 w-4" />
                          {photoPreview ? 'Changer' : 'Importer'}
                        </div>
                      </Label>
                      <Input
                        id="photo-edit"
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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Informations personnelles */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom || ''}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
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
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom || ''}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
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
                rows={2}
                required
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
                    value={(formData.dateConversion as string) || ""}
                    onChange={(e) => setFormData({ ...formData, dateConversion: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateBapteme">Date de baptême</Label>
                  <Input
                    id="dateBapteme"
                    type="date"
                    value={(formData.dateBapteme as string) || ""}
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
                  value={(formData.dateAdhesion as string) || ""}
                  onChange={(e) => setFormData({ ...formData, dateAdhesion: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Affectation à une salle - Visible uniquement pour ADMIN et COORDINATION */}
            {(user?.role === 'ADMIN' || user?.role === 'COORDINATION') && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">Affectation à une salle</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="salleActuelleId">Salle</Label>
                    <Select
                      value={formData.salleActuelleId || ""}
                      onValueChange={(value) => {
                        const salle = salles.find(s => s.id === value)
                        setFormData({
                          ...formData,
                          salleActuelleId: value === "none" ? undefined : value,
                          salleActuelleNom: salle?.nom,
                          dateAffectationActuelle: value !== "none" ? new Date().toISOString().split('T')[0] : undefined
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une salle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" className="text-muted-foreground">
                          Aucune salle
                        </SelectItem>
                        {salles.map((salle) => (
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
                      value={formData.roleActuel || "none"}
                      onValueChange={(value: string) =>
                        setFormData({ ...formData, roleActuel: value === "none" ? undefined : value as any })
                      }
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
            )}
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
