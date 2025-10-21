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
import { Textarea } from "@/components/ui/textarea"

interface Cotisation {
  id: string
  moniteur: string
  montant: number
  devise: string
  periode: string
  datePaiement: string | null
  statut: string
  modePaiement: string
  remarque: string
}

interface EditCotisationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cotisation: Cotisation | null
}

export function EditCotisationDialog({ open, onOpenChange, cotisation }: EditCotisationDialogProps) {
  const [formData, setFormData] = useState({
    moniteur: "",
    montant: "",
    devise: "CDF",
    periode: "",
    datePaiement: "",
    modePaiement: "Espèces",
    statut: "Payé",
    remarque: "",
  })

  useEffect(() => {
    if (cotisation) {
      setFormData({
        moniteur: cotisation.moniteur,
        montant: cotisation.montant.toString(),
        devise: cotisation.devise,
        periode: cotisation.periode,
        datePaiement: cotisation.datePaiement || "",
        modePaiement: cotisation.modePaiement || "Espèces",
        statut: cotisation.statut,
        remarque: cotisation.remarque || "",
      })
    }
  }, [cotisation])

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

    const updatedCotisation = {
      ...cotisation,
      ...formData,
      montant: parseFloat(formData.montant),
      dateModif: new Date().toISOString(),
    }

    console.log("Cotisation modifiée:", updatedCotisation)
    alert(`✅ Cotisation de ${formData.moniteur} modifiée avec succès !\n\nMontant: ${formData.montant} ${formData.devise}\nPériode: ${formData.periode}\nStatut: ${formData.statut}`)

    onOpenChange(false)
  }

  if (!cotisation) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier la cotisation</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la cotisation
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-moniteur">Moniteur *</Label>
              <Select
                value={formData.moniteur}
                onValueChange={(value) => setFormData({ ...formData, moniteur: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue />
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
                <Label htmlFor="edit-montant">Montant *</Label>
                <Input
                  id="edit-montant"
                  type="number"
                  value={formData.montant}
                  onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                  placeholder="5000"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-devise">Devise</Label>
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
              <Label htmlFor="edit-periode">Période *</Label>
              <Input
                id="edit-periode"
                value={formData.periode}
                onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                placeholder="Janvier 2025"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-statut">Statut *</Label>
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
                  <Label htmlFor="edit-datePaiement">Date de paiement *</Label>
                  <Input
                    id="edit-datePaiement"
                    type="date"
                    value={formData.datePaiement}
                    onChange={(e) => setFormData({ ...formData, datePaiement: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-modePaiement">Mode de paiement</Label>
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
              <Label htmlFor="edit-remarque">Remarque</Label>
              <Textarea
                id="edit-remarque"
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
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
