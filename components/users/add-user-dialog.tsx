"use client"

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
import { UserRole, getRoleLabel } from "@/lib/permissions"

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    role: UserRole.MONITEUR,
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nom || !formData.prenom || !formData.email || !formData.password) {
      alert("⚠️ Veuillez remplir tous les champs obligatoires")
      return
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert("⚠️ Veuillez entrer un email valide")
      return
    }

    // Validation mot de passe (min 6 caractères)
    if (formData.password.length < 6) {
      alert("⚠️ Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    const newUser = {
      id: Date.now().toString(),
      ...formData,
      actif: true,
      dateCreation: new Date().toISOString(),
    }

    console.log("Nouvel utilisateur créé:", newUser)
    alert(`✅ Utilisateur "${formData.prenom} ${formData.nom}" créé avec succès !\n\nRôle: ${getRoleLabel(formData.role)}\nEmail: ${formData.email}`)

    // Reset
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      role: UserRole.MONITEUR,
      password: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvel Utilisateur</DialogTitle>
          <DialogDescription>
            Créez un nouveau compte utilisateur avec son rôle
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Nom de famille"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  placeholder="Prénom"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemple.cd"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                placeholder="+243 900 000 000"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Rôle *</Label>
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

            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 caractères"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500">
                L'utilisateur pourra changer son mot de passe après connexion
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer l'utilisateur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
