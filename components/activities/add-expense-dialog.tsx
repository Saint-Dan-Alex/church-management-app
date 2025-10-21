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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EXPENSE_CATEGORIES } from "@/types/expense"
import type { ExpenseCategory, Currency } from "@/types/expense"

interface AddExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activiteId: string
  activiteNom: string
  devise: Currency
}

export function AddExpenseDialog({
  open,
  onOpenChange,
  activiteId,
  activiteNom,
  devise,
}: AddExpenseDialogProps) {
  const [formData, setFormData] = useState({
    categorie: "" as ExpenseCategory | "",
    description: "",
    montant: "",
    date: new Date().toISOString().split("T")[0],
    beneficiaire: "",
    referenceFacture: "",
    remarque: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.categorie || !formData.description || !formData.montant) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    const newExpense = {
      id: Date.now().toString(),
      activiteId,
      activiteNom,
      categorie: formData.categorie as ExpenseCategory,
      description: formData.description,
      montant: parseFloat(formData.montant),
      devise,
      date: formData.date,
      beneficiaire: formData.beneficiaire || undefined,
      referenceFacture: formData.referenceFacture || undefined,
      remarque: formData.remarque || undefined,
      ajoutePar: "user1",
      ajouteParNom: "Admin",
      createdAt: new Date(),
    }

    console.log("Nouvelle dépense:", newExpense)
    // TODO: Enregistrer dans la base de données
    
    // Réinitialiser le formulaire
    setFormData({
      categorie: "",
      description: "",
      montant: "",
      date: new Date().toISOString().split("T")[0],
      beneficiaire: "",
      referenceFacture: "",
      remarque: "",
    })
    
    onOpenChange(false)
    alert("Dépense enregistrée avec succès !")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une Dépense</DialogTitle>
          <DialogDescription>
            Enregistrer une nouvelle dépense pour {activiteNom}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Catégorie */}
            <div className="grid gap-2">
              <Label htmlFor="categorie">Catégorie *</Label>
              <Select
                value={formData.categorie}
                onValueChange={(value: ExpenseCategory) =>
                  setFormData({ ...formData, categorie: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Ex: Rafraîchissements pour les participants"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                required
              />
            </div>

            {/* Montant et Date */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="montant">Montant *</Label>
                <div className="flex gap-2">
                  <Input
                    id="montant"
                    type="number"
                    placeholder="15000"
                    value={formData.montant}
                    onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                  <div className="flex items-center px-3 border rounded-md bg-gray-50 text-gray-700 font-medium">
                    {devise}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Bénéficiaire */}
            <div className="grid gap-2">
              <Label htmlFor="beneficiaire">Bénéficiaire</Label>
              <Input
                id="beneficiaire"
                placeholder="Ex: Restaurant La Paix"
                value={formData.beneficiaire}
                onChange={(e) => setFormData({ ...formData, beneficiaire: e.target.value })}
              />
            </div>

            {/* Référence facture */}
            <div className="grid gap-2">
              <Label htmlFor="referenceFacture">Référence facture</Label>
              <Input
                id="referenceFacture"
                placeholder="Ex: FACT-2025-001"
                value={formData.referenceFacture}
                onChange={(e) => setFormData({ ...formData, referenceFacture: e.target.value })}
              />
            </div>

            {/* Remarque */}
            <div className="grid gap-2">
              <Label htmlFor="remarque">Remarque</Label>
              <Textarea
                id="remarque"
                placeholder="Notes supplémentaires (optionnel)"
                value={formData.remarque}
                onChange={(e) => setFormData({ ...formData, remarque: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer la dépense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
