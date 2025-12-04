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

interface AddPresenceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddPresenceDialog({ open, onOpenChange }: AddPresenceDialogProps) {
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        moniteur_nom: "",
        activity_nom: "",
        statut: "present",
        date_presence: new Date().toISOString().split("T")[0],
        heure_arrivee: "",
        remarque: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.moniteur_nom || !formData.activity_nom) {
            toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs obligatoires",
                variant: "destructive",
            })
            return
        }

        toast({
            title: "Présence enregistrée",
            description: `${formData.moniteur_nom} - ${formData.statut}`,
        })

        console.log("Nouvelle présence:", formData)

        setFormData({
            moniteur_nom: "",
            activity_nom: "",
            statut: "present",
            date_presence: new Date().toISOString().split("T")[0],
            heure_arrivee: "",
            remarque: "",
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Enregistrer une présence</DialogTitle>
                    <DialogDescription>
                        Marquez la présence d'un moniteur à une activité
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="moniteur_nom">
                                Moniteur <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="moniteur_nom"
                                placeholder="Nom du moniteur"
                                value={formData.moniteur_nom}
                                onChange={(e) =>
                                    setFormData({ ...formData, moniteur_nom: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="activity_nom">
                                Activité <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="activity_nom"
                                placeholder="Nom de l'activité"
                                value={formData.activity_nom}
                                onChange={(e) =>
                                    setFormData({ ...formData, activity_nom: e.target.value })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
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
                                    <SelectItem value="present">Présent</SelectItem>
                                    <SelectItem value="absent">Absent</SelectItem>
                                    <SelectItem value="retard">Retard</SelectItem>
                                    <SelectItem value="excuse">Excusé</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date_presence">Date</Label>
                            <Input
                                id="date_presence"
                                type="date"
                                value={formData.date_presence}
                                onChange={(e) =>
                                    setFormData({ ...formData, date_presence: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="heure_arrivee">Heure d'arrivée</Label>
                            <Input
                                id="heure_arrivee"
                                type="time"
                                value={formData.heure_arrivee}
                                onChange={(e) =>
                                    setFormData({ ...formData, heure_arrivee: e.target.value })
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
