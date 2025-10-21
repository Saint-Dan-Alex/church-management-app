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
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Currency } from "@/types/payment"

interface PaymentConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activiteId: string
  activiteNom: string
}

export function PaymentConfigDialog({
  open,
  onOpenChange,
  activiteId,
  activiteNom,
}: PaymentConfigDialogProps) {
  const [formData, setFormData] = useState({
    montantRequis: "",
    devise: "CDF" as Currency,
    montantAlternatif: "",
    deviseAlternative: "USD" as Currency,
    descriptionPaiement: "",
    dateEcheance: "",
    paiementObligatoire: true,
    permettreDeviseAlternative: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const config = {
      id: String(Date.now()),
      activiteId,
      activiteNom,
      montantRequis: parseFloat(formData.montantRequis),
      devise: formData.devise,
      montantAlternatif: formData.permettreDeviseAlternative && formData.montantAlternatif
        ? parseFloat(formData.montantAlternatif)
        : undefined,
      deviseAlternative: formData.permettreDeviseAlternative
        ? formData.deviseAlternative
        : undefined,
      descriptionPaiement: formData.descriptionPaiement,
      dateEcheance: formData.dateEcheance,
      paiementObligatoire: formData.paiementObligatoire,
      active: true,
      createdAt: new Date().toISOString(),
    }

    console.log("Configuration de paiement créée:", config)
    // TODO: Enregistrer dans la base de données

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configurer le Paiement de l'Activité</DialogTitle>
          <DialogDescription>
            Définissez les paramètres de paiement pour cette activité
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Description du paiement */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description du paiement *</Label>
              <Textarea
                id="description"
                value={formData.descriptionPaiement}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionPaiement: e.target.value })
                }
                placeholder="Ex: Cotisation pour la sortie, Frais de participation..."
                rows={2}
                required
              />
            </div>

            {/* Devise principale */}
            <div className="grid gap-2">
              <Label>Devise principale *</Label>
              <RadioGroup
                value={formData.devise}
                onValueChange={(value) => setFormData({ ...formData, devise: value as Currency })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CDF" id="cdf" />
                  <Label htmlFor="cdf" className="cursor-pointer font-normal">
                    Francs Congolais (CDF)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="USD" id="usd" />
                  <Label htmlFor="usd" className="cursor-pointer font-normal">
                    Dollars US (USD)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Montant principal */}
            <div className="grid gap-2">
              <Label htmlFor="montant">Montant requis *</Label>
              <Input
                id="montant"
                type="number"
                min="0"
                step="0.01"
                value={formData.montantRequis}
                onChange={(e) => setFormData({ ...formData, montantRequis: e.target.value })}
                placeholder={`Montant en ${formData.devise}`}
                required
              />
            </div>

            {/* Option devise alternative */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="alternative"
                checked={formData.permettreDeviseAlternative}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, permettreDeviseAlternative: checked as boolean })
                }
              />
              <Label htmlFor="alternative" className="cursor-pointer">
                Permettre une devise alternative
              </Label>
            </div>

            {/* Devise alternative */}
            {formData.permettreDeviseAlternative && (
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <div className="grid gap-2">
                  <Label htmlFor="montantAlt">
                    Montant en {formData.devise === "CDF" ? "USD" : "CDF"}
                  </Label>
                  <Input
                    id="montantAlt"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.montantAlternatif}
                    onChange={(e) =>
                      setFormData({ ...formData, montantAlternatif: e.target.value })
                    }
                    placeholder={`Montant en ${formData.devise === "CDF" ? "USD" : "CDF"}`}
                  />
                </div>
                <p className="text-xs text-blue-700">
                  Les participants pourront choisir de payer en {formData.devise} ou en{" "}
                  {formData.devise === "CDF" ? "USD" : "CDF"}
                </p>
              </div>
            )}

            {/* Date d'échéance */}
            <div className="grid gap-2">
              <Label htmlFor="echeance">Date d'échéance *</Label>
              <Input
                id="echeance"
                type="date"
                value={formData.dateEcheance}
                onChange={(e) => setFormData({ ...formData, dateEcheance: e.target.value })}
                required
              />
            </div>

            {/* Paiement obligatoire */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="obligatoire"
                checked={formData.paiementObligatoire}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, paiementObligatoire: checked as boolean })
                }
              />
              <Label htmlFor="obligatoire" className="cursor-pointer">
                Paiement obligatoire pour participer
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer la configuration</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
