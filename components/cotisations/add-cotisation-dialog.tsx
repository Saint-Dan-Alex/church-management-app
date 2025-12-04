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

interface AddCotisationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const MOIS = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
]

export function AddCotisationDialog({ open, onOpenChange }: AddCotisationDialogProps) {
    const { toast } = useToast()
    const currentYear = new Date().getFullYear()
    const currentMonth = MOIS[new Date().getMonth()]

    const [formData, setFormData] = useState({
        membre_nom: "",
        type_cotisation: "Mensuelle",
        montant: "",
        devise: "CDF",
        mois: currentMonth,
        annee: currentYear.toString(),
        date_cotisation: new Date().toISOString().split("T")[0],
        methode_paiement: "Espèces",
        remarque: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.membre_nom || !formData.montant) {
            toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs obligatoires",
                variant: "destructive",
            })
            return
        }

        toast({
            title: "Cotisation enregistrée",
            description: `${formData.membre_nom} - ${formData.montant} ${formData.devise}`,
        })

        console.log("Nouvelle cotisation:", formData)

        setFormData({
            membre_nom: "",
            type_cotisation: "Mensuelle",
            montant: "",
            devise: "CDF",
            mois: currentMonth,
            annee: currentYear.toString(),
            date_cotisation: new Date().toISOString().split("T")[0],
            methode_paiement: "Espèces",
            remarque: "",
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Enregistrer une cotisation</DialogTitle>
                    <DialogDescription>
                        Ajoutez une nouvelle cotisation au système
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="membre_nom">
                            Membre <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="membre_nom"
                            placeholder="Nom du membre"
                            value={formData.membre_nom}
                            onChange={(e) =>
                                setFormData({ ...formData, membre_nom: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="type_cotisation">Type de cotisation</Label>
                            <Select
                                value={formData.type_cotisation}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, type_cotisation: value })
                                }
                            >
                                <SelectTrigger id="type_cotisation">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Mensuelle">Mensuelle</SelectItem>
                                    <SelectItem value="Trimestrielle">Trimestrielle</SelectItem>
                                    <SelectItem value="Annuelle">Annuelle</SelectItem>
                                    <SelectItem value="Spéciale">Spéciale</SelectItem>
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

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
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

                        <div className="space-y-2">
                            <Label htmlFor="date_cotisation">Date</Label>
                            <Input
                                id="date_cotisation"
                                type="date"
                                value={formData.date_cotisation}
                                onChange={(e) =>
                                    setFormData({ ...formData, date_cotisation: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="mois">Mois</Label>
                            <Select
                                value={formData.mois}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, mois: value })
                                }
                            >
                                <SelectTrigger id="mois">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {MOIS.map((mois) => (
                                        <SelectItem key={mois} value={mois}>
                                            {mois}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="annee">Année</Label>
                            <Select
                                value={formData.annee}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, annee: value })
                                }
                            >
                                <SelectTrigger id="annee">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
