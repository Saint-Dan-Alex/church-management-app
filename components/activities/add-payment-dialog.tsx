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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { ActivityPaymentConfig, Currency, PaymentMethod } from "@/types/payment"
import type { Participant } from "@/lib/utils/payment-helpers"

interface AddPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activiteId: string
  activiteNom: string
  config: ActivityPaymentConfig
  participants: Participant[] // Liste des participants (enfants + moniteurs)
}

export function AddPaymentDialog({
  open,
  onOpenChange,
  activiteId,
  activiteNom,
  config,
  participants,
}: AddPaymentDialogProps) {
  const [formData, setFormData] = useState({
    participantId: "",
    montantPaye: "",
    devise: config.devise as Currency,
    methodePaiement: "cash" as PaymentMethod,
    remarque: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const participant = participants.find(p => p.id === formData.participantId)
    if (!participant) return

    const montantRequis = formData.devise === config.devise 
      ? config.montantRequis 
      : (config.montantAlternatif || config.montantRequis)

    const montantPaye = parseFloat(formData.montantPaye)
    const montantRestant = Math.max(0, montantRequis - montantPaye)
    
    const statut = 
      montantPaye >= montantRequis ? "paid" :
      montantPaye > 0 ? "partial" :
      "pending"

    const numeroPaiement = `PAY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    const numeroRecu = statut === "paid" || statut === "partial" 
      ? `REC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
      : undefined

    const payment = {
      id: String(Date.now()),
      activiteId,
      activiteNom,
      participantId: formData.participantId,
      participantNom: participant.nom,
      participantPrenom: participant.prenom,
      participantNomComplet: participant.nomComplet,
      montant: montantRequis,
      devise: formData.devise,
      montantPaye,
      montantRestant,
      statut,
      methodePaiement: formData.methodePaiement,
      dateEcheance: config.dateEcheance,
      datePaiement: new Date().toISOString(),
      numeroPaiement,
      numeroRecu,
      remarque: formData.remarque,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("Paiement enregistré:", payment)
    // TODO: Enregistrer dans la base de données

    // Réinitialiser le formulaire
    setFormData({
      participantId: "",
      montantPaye: "",
      devise: config.devise,
      methodePaiement: "cash",
      remarque: "",
    })
    
    onOpenChange(false)
  }

  const selectedParticipant = participants.find(p => p.id === formData.participantId)

  const montantRequis = formData.devise === config.devise
    ? config.montantRequis
    : (config.montantAlternatif || config.montantRequis)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enregistrer un Paiement</DialogTitle>
          <DialogDescription>
            Enregistrez le paiement d'un participant pour cette activité
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Sélection du participant */}
            <div className="grid gap-2">
              <Label htmlFor="participant">Participant *</Label>
              <Select
                value={formData.participantId}
                onValueChange={(value) => setFormData({ ...formData, participantId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un participant" />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((participant) => (
                    <SelectItem key={participant.id} value={participant.id}>
                      <div className="flex items-center gap-2">
                        <span>{participant.nomComplet}</span>
                        <span className="text-xs text-gray-500">
                          ({participant.type === "enfant" ? "Enfant" : "Moniteur"})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Devise */}
            <div className="grid gap-2">
              <Label>Devise *</Label>
              <RadioGroup
                value={formData.devise}
                onValueChange={(value) => setFormData({ ...formData, devise: value as Currency })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={config.devise} id="devise-principale" />
                  <Label htmlFor="devise-principale" className="cursor-pointer font-normal">
                    {config.devise} ({config.montantRequis.toLocaleString("fr-FR")} {config.devise})
                  </Label>
                </div>
                {config.montantAlternatif && config.deviseAlternative && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={config.deviseAlternative} id="devise-alternative" />
                    <Label htmlFor="devise-alternative" className="cursor-pointer font-normal">
                      {config.deviseAlternative} ({config.montantAlternatif.toLocaleString("fr-FR")} {config.deviseAlternative})
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>

            {/* Montant payé */}
            <div className="grid gap-2">
              <Label htmlFor="montantPaye">Montant payé *</Label>
              <Input
                id="montantPaye"
                type="number"
                min="0"
                step="0.01"
                value={formData.montantPaye}
                onChange={(e) => setFormData({ ...formData, montantPaye: e.target.value })}
                placeholder={`Montant en ${formData.devise}`}
                required
              />
              {formData.montantPaye && (
                <div className="text-sm">
                  {parseFloat(formData.montantPaye) >= montantRequis ? (
                    <p className="text-green-600 font-medium">✓ Paiement complet</p>
                  ) : (
                    <p className="text-orange-600">
                      Reste à payer: {(montantRequis - parseFloat(formData.montantPaye)).toLocaleString("fr-FR")} {formData.devise}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Méthode de paiement */}
            <div className="grid gap-2">
              <Label htmlFor="methode">Méthode de paiement *</Label>
              <Select
                value={formData.methodePaiement}
                onValueChange={(value) => setFormData({ ...formData, methodePaiement: value as PaymentMethod })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Espèces</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money (M-Pesa, Airtel Money...)</SelectItem>
                  <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                  <SelectItem value="card">Carte bancaire</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Remarque */}
            <div className="grid gap-2">
              <Label htmlFor="remarque">Remarque</Label>
              <Textarea
                id="remarque"
                value={formData.remarque}
                onChange={(e) => setFormData({ ...formData, remarque: e.target.value })}
                placeholder="Informations complémentaires..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!formData.participantId || !formData.montantPaye}>
              Enregistrer le paiement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
