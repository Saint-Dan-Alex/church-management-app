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
import { EXPENSE_CATEGORIES } from "@/types/expense"

interface AddExpenseDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddExpenseDialog({ open, onOpenChange }: AddExpenseDialogProps) {
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        categorie: "",
        description: "",
        montant: "",
        devise: "CDF",
        date: new Date().toISOString().split("T")[0],
        beneficiaire: "",
        reference_facture: "",
        remarque: "",
        activity_nom: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.categorie || !formData.description || !formData.montant || !formData.beneficiaire) {
            toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs obligatoires",
                variant: "destructive",
            })
            return
        }

        toast({
            title: "Dépense enregistrée",
            description: `${formData.description} - ${formData.montant} ${formData.devise}`,
        })

        console.log("Nouvelle dépense:", formData)

        // Réinitialiser le formulaire
        setFormData({
            categorie: "",
            description: "",
            montant: "",
            devise: "CDF",
            date: new Date().toISOString().split("T")[0],
            beneficiaire: "",
            reference_facture: "",
            remarque: "",
            activity_nom: "",
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Enregistrer une dépense</DialogTitle>
                    <DialogDescription>
                        Ajoutez une nouvelle dépense au système
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="categorie">
                                Catégorie <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.categorie}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, categorie: value })
                                }
                            >
                                <SelectTrigger id="categorie">
                                    <SelectValue placeholder="Sélectionner une catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    {EXPENSE_CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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

                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="description"
                            placeholder="Description de la dépense"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="montant">
                                Montant <span className="text-red-500">*</span>
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
                            <Label htmlFor="beneficiaire">
                                Bénéficiaire <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="beneficiaire"
                                placeholder="Nom du bénéficiaire"
                                value={formData.beneficiaire}
                                onChange={(e) =>
                                    setFormData({ ...formData, beneficiaire: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData({ ...formData, date: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reference_facture">Référence facture (optionnel)</Label>
                        <Input
                            id="reference_facture"
                            placeholder="FACT-2024-001"
                            value={formData.reference_facture}
                            onChange={(e) =>
                                setFormData({ ...formData, reference_facture: e.target.value })
                            }
                        />
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
