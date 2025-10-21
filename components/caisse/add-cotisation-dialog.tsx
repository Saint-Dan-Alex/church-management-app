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
import { Textarea } from "@/components/ui/textarea"

interface AddCotisationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCotisationDialog({ open, onOpenChange }: AddCotisationDialogProps) {
  const [formData, setFormData] = useState({
    moniteur: "",
    montant: "5000",
    devise: "CDF",
    periode: "",
    datePaiement: "",
    modePaiement: "Espèces",
    statut: "Payé",
    remarque: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.moniteur || !formData.montant || !formData.periode) {
      alert("⚠️ Veuillez remplir tous les champs obligatoires")
      return
    }

    if (formData.statut === "Payé" && !formData.datePaiement) {
      alert("⚠️ Veuillez indiquer la date de paiement")
      return
    }

    const newCotisation = {
      id: Date.now().toString(),
      ...formData,
      montant: parseFloat(formData.montant),
      dateCreation: new Date().toISOString(),
    }

    console.log("Nouvelle cotisation enregistrée:", newCotisation)
    alert(`✅ Cotisation de ${formData.moniteur} enregistrée avec succès !\n\nMontant: ${formData.montant} ${formData.devise}\nPériode: ${formData.periode}`)

    // Reset
    setFormData({
      moniteur: "",
      montant: "5000",
      devise: "CDF",
      periode: "",
      datePaiement: "",
      modePaiement: "Espèces",
      statut: "Payé",
      remarque: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enregistrer une cotisation</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle cotisation de moniteur
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="moniteur">Moniteur *</Label>
              <Select
                value={formData.moniteur}
                onValueChange={(value) => setFormData({ ...formData, moniteur: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un moniteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sophie KAMANDA">Sophie KAMANDA</SelectItem>
                  <SelectItem value="Jacques MUKENDI">Jacques MUKENDI</SelectItem>
                  <SelectItem value="Paul NGEA">Paul NGEA</SelectItem>
                  <SelectItem value="Marie LENGE">Marie LENGE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="montant">Montant *</Label>
                <Input
                  id="montant"
                  type="number"
                  value={formData.montant}
                  onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                  placeholder="5000"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="devise">Devise</Label>
                <Select
                  value={formData.devise}
                  onValueChange={(value) => setFormData({ ...formData, devise: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDF">CDF</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="periode">Période *</Label>
              <Input
                id="periode"
                value={formData.periode}
                onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                placeholder="Janvier 2025"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="statut">Statut *</Label>
              <Select
                value={formData.statut}
                onValueChange={(value) => setFormData({ ...formData, statut: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Payé">Payé</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Retard">En retard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.statut === "Payé" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="datePaiement">Date de paiement *</Label>
                  <Input
                    id="datePaiement"
                    type="date"
                    value={formData.datePaiement}
                    onChange={(e) => setFormData({ ...formData, datePaiement: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="modePaiement">Mode de paiement</Label>
                  <Select
                    value={formData.modePaiement}
                    onValueChange={(value) => setFormData({ ...formData, modePaiement: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Espèces">Espèces</SelectItem>
                      <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                      <SelectItem value="Virement">Virement bancaire</SelectItem>
                      <SelectItem value="Chèque">Chèque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="remarque">Remarque</Label>
              <Textarea
                id="remarque"
                value={formData.remarque}
                onChange={(e) => setFormData({ ...formData, remarque: e.target.value })}
                placeholder="Notes ou observations..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
