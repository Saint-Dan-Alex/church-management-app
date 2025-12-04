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
import { useToast } from "@/hooks/use-toast"

interface AddPaymentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddPaymentDialog({ open, onOpenChange }: AddPaymentDialogProps) {
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        participant_nom_complet: "",
        activity_nom: "",
        montant: "",
        devise: "CDF",
        montant_paye: "",
        statut: "pending",
        methode_paiement: "Espèces",
        date_echeance: new Date().toISOString().split("T")[0],
        date_paiement: "",
        remarque: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.participant_nom_complet || !formData.montant) {
            toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs obligatoires",
                variant: "destructive",
            })
            return
        }

        toast({
            title: "Paiement enregistré",
            description: `${formData.participant_nom_complet} - ${formData.montant} ${formData.devise}`,
        })

        console.log("Nouveau paiement:", formData)

        // Réinitialiser le formulaire
        setFormData({
            participant_nom_complet: "",
            activity_nom: "",
            montant: "",
            devise: "CDF",
            montant_paye: "",
            statut: "pending",
            methode_paiement: "Espèces",
            date_echeance: new Date().toISOString().split("T")[0],
            date_paiement: "",
            remarque: "",
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Enregistrer un paiement</DialogTitle>
                    <DialogDescription>
                        Ajoutez un nouveau paiement au système
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="participant_nom_complet">
                                Participant <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="participant_nom_complet"
                                placeholder="Nom complet du participant"
                                value={formData.participant_nom_complet}
                                onChange={(e) =>
                                    setFormData({ ...formData, participant_nom_complet: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="activity_nom">Activité (optionnel)</Label>
                            <Input
                                id="activity_nom"
                                placeholder="Nom de l'activité"
                                value={formData.activity_nom}
                                onChange={(e) =>
                                    setFormData({ ...formData, activity_nom: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="montant">
                                Montant dû <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="montant"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.montant}
                                onChange={(e) =>
                                    setFormData({ ...formData, montant: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="montant_paye">Montant payé</Label>
                            <Input
                                id="montant_paye"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.montant_paye}
                                onChange={(e) =>
                                    setFormData({ ...formData, montant_paye: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="devise">Devise</Label>
                            <Select
                                value={formData.devise}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, devise: value })
                                }
                            >
                                <SelectTrigger id="devise">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CDF">CDF</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="statut">Statut</Label>
                            <Select
                                value={formData.statut}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, statut: value })
                                }
                            >
                                <SelectTrigger id="statut">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">En attente</SelectItem>
                                    <SelectItem value="paid">Payé</SelectItem>
                                    <SelectItem value="partial">Partiel</SelectItem>
                                    <SelectItem value="overdue">En retard</SelectItem>
                                    <SelectItem value="cancelled">Annulé</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="methode_paiement">Méthode de paiement</Label>
                            <Select
                                value={formData.methode_paiement}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, methode_paiement: value })
                                }
                            >
                                <SelectTrigger id="methode_paiement">
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
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="date_echeance">Date d'échéance</Label>
                            <Input
                                id="date_echeance"
                                type="date"
                                value={formData.date_echeance}
                                onChange={(e) =>
                                    setFormData({ ...formData, date_echeance: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date_paiement">Date de paiement (optionnel)</Label>
                            <Input
                                id="date_paiement"
                                type="date"
                                value={formData.date_paiement}
                                onChange={(e) =>
                                    setFormData({ ...formData, date_paiement: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="remarque">Remarque (optionnel)</Label>
                        <Textarea
                            id="remarque"
                            placeholder="Informations complémentaires..."
                            value={formData.remarque}
                            onChange={(e) =>
                                setFormData({ ...formData, remarque: e.target.value })
                            }
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
