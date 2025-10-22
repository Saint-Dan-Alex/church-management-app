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

interface AddSortieDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddSortieDialog({ open, onOpenChange }: AddSortieDialogProps) {
  const [formData, setFormData] = useState({
    libelle: "",
    montant: "",
    devise: "CDF",
    categorie: "Matériel",
    dateSortie: "",
    beneficiaire: "",
    modePaiement: "Espèces",
    remarque: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.libelle || !formData.montant || !formData.beneficiaire || !formData.dateSortie) {
      alert("⚠️ Veuillez remplir tous les champs obligatoires")
      return
    }

    const newSortie = {
      id: Date.now().toString(),
      ...formData,
      montant: parseFloat(formData.montant),
      dateCreation: new Date().toISOString(),
    }

    console.log("Nouvelle sortie enregistrée:", newSortie)
    alert(`✅ Sortie enregistrée avec succès !\n\nLibellé: ${formData.libelle}\nMontant: ${formData.montant} ${formData.devise}\nBénéficiaire: ${formData.beneficiaire}`)

    // Reset
    setFormData({
      libelle: "",
      montant: "",
      devise: "CDF",
      categorie: "Matériel",
      dateSortie: "",
      beneficiaire: "",
      modePaiement: "Espèces",
      remarque: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enregistrer une sortie</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle dépense ou sortie d'argent
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="libelle">Libellé *</Label>
              <Input
                id="libelle"
                value={formData.libelle}
                onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                placeholder="Achat fournitures, transport, etc."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="montant">Montant *</Label>
                <Input
                  id="montant"
                  type="number"
                  value={formData.montant}
                  onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                  placeholder="10000"
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
              <Label htmlFor="categorie">Catégorie *</Label>
              <Select
                value={formData.categorie}
                onValueChange={(value) => setFormData({ ...formData, categorie: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Matériel">Matériel</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Événement">Événement</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="beneficiaire">Bénéficiaire *</Label>
              <Input
                id="beneficiaire"
                value={formData.beneficiaire}
                onChange={(e) => setFormData({ ...formData, beneficiaire: e.target.value })}
                placeholder="Nom du fournisseur ou bénéficiaire"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dateSortie">Date de sortie *</Label>
              <Input
                id="dateSortie"
                type="date"
                value={formData.dateSortie}
                onChange={(e) => setFormData({ ...formData, dateSortie: e.target.value })}
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
