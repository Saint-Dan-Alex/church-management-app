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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRole, getRoleLabel } from "@/lib/permissions"
import { Switch } from "@/components/ui/switch"

interface User {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  role: UserRole
  actif: boolean
}

interface EditUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export function EditUserDialog({ open, onOpenChange, user }: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    role: UserRole.MONITEUR,
    actif: true,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
        actif: user.actif,
      })
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nom || !formData.prenom || !formData.email) {
      alert("⚠️ Veuillez remplir tous les champs obligatoires")
      return
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert("⚠️ Veuillez entrer un email valide")
      return
    }

    const updatedUser = {
      ...user,
      ...formData,
      dateModif: new Date().toISOString(),
    }

    console.log("Utilisateur modifié:", updatedUser)
    alert(`✅ Utilisateur "${formData.prenom} ${formData.nom}" modifié avec succès !\n\nRôle: ${getRoleLabel(formData.role)}\nStatut: ${formData.actif ? 'Actif' : 'Inactif'}`)

    onOpenChange(false)
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'utilisateur
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-nom">Nom *</Label>
                <Input
                  id="edit-nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Nom de famille"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-prenom">Prénom *</Label>
                <Input
                  id="edit-prenom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  placeholder="Prénom"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemple.cd"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-telephone">Téléphone</Label>
              <Input
                id="edit-telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                placeholder="+243 900 000 000"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-role">Rôle *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>{getRoleLabel(UserRole.ADMIN)}</SelectItem>
                  <SelectItem value={UserRole.COORDINATION}>{getRoleLabel(UserRole.COORDINATION)}</SelectItem>
                  <SelectItem value={UserRole.CHEF_SALLE}>{getRoleLabel(UserRole.CHEF_SALLE)}</SelectItem>
                  <SelectItem value={UserRole.MONITEUR}>{getRoleLabel(UserRole.MONITEUR)}</SelectItem>
                  <SelectItem value={UserRole.FINANCIER}>{getRoleLabel(UserRole.FINANCIER)}</SelectItem>
                  <SelectItem value={UserRole.PARENT}>{getRoleLabel(UserRole.PARENT)}</SelectItem>
                  <SelectItem value={UserRole.ENFANT}>{getRoleLabel(UserRole.ENFANT)}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="edit-actif">Statut du compte</Label>
                <p className="text-xs text-gray-500">
                  {formData.actif ? "Le compte est actif" : "Le compte est désactivé"}
                </p>
              </div>
              <Switch
                id="edit-actif"
                checked={formData.actif}
                onCheckedChange={(checked) => setFormData({ ...formData, actif: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
