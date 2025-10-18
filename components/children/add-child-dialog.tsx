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
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AddChildDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddChildDialog({ open, onOpenChange }: AddChildDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    group: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    allergies: "",
    medicalNotes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Child form submitted:", formData)
    onOpenChange(false)
    setFormData({
      firstName: "",
      lastName: "",
      birthDate: "",
      group: "",
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      allergies: "",
      medicalNotes: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un Enfant</DialogTitle>
          <DialogDescription>Remplissez les informations de l'enfant et de son parent/tuteur</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 pr-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Informations de l'enfant</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Lucas"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Martin"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="birthDate">Date de naissance</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="group">Groupe d'âge</Label>
                      <Select
                        value={formData.group}
                        onValueChange={(value) => setFormData({ ...formData, group: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-2 ans">0-2 ans</SelectItem>
                          <SelectItem value="3-5 ans">3-5 ans</SelectItem>
                          <SelectItem value="5-7 ans">5-7 ans</SelectItem>
                          <SelectItem value="8-10 ans">8-10 ans</SelectItem>
                          <SelectItem value="11-13 ans">11-13 ans</SelectItem>
                          <SelectItem value="14+ ans">14+ ans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Informations du parent/tuteur</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="parentName">Nom complet</Label>
                    <Input
                      id="parentName"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="Jean Martin"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="parentPhone">Téléphone</Label>
                      <Input
                        id="parentPhone"
                        type="tel"
                        value={formData.parentPhone}
                        onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                        placeholder="+33 6 12 34 56 78"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="parentEmail">Email</Label>
                      <Input
                        id="parentEmail"
                        type="email"
                        value={formData.parentEmail}
                        onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                        placeholder="parent@email.com"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Informations médicales</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      placeholder="Aucune ou spécifier les allergies"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="medicalNotes">Notes médicales</Label>
                    <Textarea
                      id="medicalNotes"
                      value={formData.medicalNotes}
                      onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                      placeholder="Informations médicales importantes..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="pr-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
