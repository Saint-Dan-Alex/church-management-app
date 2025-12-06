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
import { usersService } from "@/lib/services/users.service"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  telephone: string
  role: UserRole
  active: boolean
}

interface EditUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSuccess?: () => void
}

export function EditUserDialog({ open, onOpenChange, user, onSuccess }: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    role: UserRole.MONITEUR,
    active: true,
  })

  const [roles, setRoles] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Charger les données de l'utilisateur
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
        active: user.active,
      })
    }
  }, [user])

  // Charger les rôles depuis l'API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/roles`)
        if (response.ok) {
          const data = await response.json()
          setRoles(data)
        }
      } catch (error) {
        console.error("Erreur chargement roles:", error)
      }
    }
    fetchRoles()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    if (!formData.name || !formData.email) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      setIsSubmitting(true)

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.telephone,
        role: formData.role,
        active: formData.active,
      }

      await usersService.update(user.id, payload as any)

      toast.success(`Utilisateur "${formData.name}" modifié avec succès !`)
      onOpenChange(false)
      if (onSuccess) onSuccess()

      // Refresh global optional if managed by parent
      window.location.reload()

    } catch (error) {
      console.error("Erreur modification utilisateur:", error)
      toast.error("Erreur lors de la modification de l'utilisateur")
    } finally {
      setIsSubmitting(false)
    }
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
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nom complet *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom complet"
                required
              />
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
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roles.length > 0 ? (
                    roles.map((role: any) => (
                      <SelectItem key={role.id} value={role.name}>
                        {getRoleLabel(role.name as UserRole) || role.name}
                      </SelectItem>
                    ))
                  ) : (
                    // Fallback si pas de roles chargés
                    Object.values(UserRole).map((role) => (
                      <SelectItem key={role} value={role}>
                        {getRoleLabel(role)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="edit-active">Statut du compte</Label>
                <p className="text-xs text-gray-500">
                  {formData.active ? "Le compte est actif" : "Le compte est désactivé"}
                </p>
              </div>
              <Switch
                id="edit-active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
