"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Check, ChevronsUpDown, X, ArrowLeft, Loader2 } from "lucide-react"
import { activitiesService, type Activity } from "@/lib/services/activities.service"
import { commissionsService } from "@/lib/services/commissions.service"
import { childrenService } from "@/lib/services/children.service"
import { monitorsService } from "@/lib/services/monitors.service"
import { toast } from "sonner"

export default function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "libre" as "libre" | "payante",
        date: "",
        end_date: "",
        startTime: "",
        endTime: "",
        location: "",
        category: "",
        maxParticipants: "",
        organizers: [] as string[],
        montantRequis: "",
        devise: "CDF" as "CDF" | "USD",
    })

    // Options pour les select
    const [categories, setCategories] = useState<Array<{ id: number, name: string }>>([])
    const [people, setPeople] = useState<Array<{ nom: string, type: string }>>([])
    const [isOrganizerOpen, setIsOrganizerOpen] = useState(false)

    useEffect(() => {
        loadData()
    }, [id])

    const loadData = async () => {
        try {
            setIsLoading(true)

            // Charger les données en parallèle
            const [activity, cats, children, monitors] = await Promise.all([
                activitiesService.getById(id),
                activitiesService.getCategories(),
                childrenService.getAll(),
                monitorsService.getAll()
            ])

            // Préparer les options
            setCategories(cats)

            const childrenData = Array.isArray(children) ? children : children.data || []
            const monitorsData = Array.isArray(monitors) ? monitors : monitors.data || []

            const allPeople = [
                ...childrenData.map((c: any) => ({ nom: `${c.prenom} ${c.nom}`, type: 'Enfant' })),
                ...monitorsData.map((m: any) => ({ nom: m.nom, type: 'Moniteur' }))
            ]
            setPeople(allPeople)

            // Pré-remplir le formulaire
            const organizersList = activity.organizer
                ? activity.organizer.split(',').map((o: string) => o.trim())
                : []

            setFormData({
                title: activity.title,
                description: activity.description || "",
                type: (activity.type === 'libre' || activity.type === 'gratuite') ? 'libre' : 'payante',
                date: activity.date ? new Date(activity.date).toISOString().split('T')[0] : "",
                end_date: activity.end_date ? new Date(activity.end_date).toISOString().split('T')[0] : "",
                startTime: activity.time ? activity.time.substring(0, 5) : "",
                // On ne peut pas facilement déduire l'heure de fin exacte sans la calculer,
                // mais si activity.duration existe, on peut essayer d'approximer ou laisser l'utilisateur re-saisir.
                // Pour l'instant, je mets une valeur vide ou j'essaie de parser duration si c'est simple.
                endTime: "", // TODO: Améliorer la gestion de l'heure de fin si possible
                location: activity.location,
                category: activity.category,
                maxParticipants: activity.maxParticipants ? activity.maxParticipants.toString() : "",
                organizers: organizersList,
                montantRequis: activity.price ? activity.price.toString() : "",
                devise: (activity.currency as "CDF" | "USD") || "CDF",
            })

        } catch (error) {
            console.error("Erreur lors du chargement:", error)
            toast.error("Impossible de charger l'activité")
        } finally {
            setIsLoading(false)
        }
    }

    const calculateDuration = () => {
        if (!formData.startTime || !formData.endTime) return ""

        const [startH, startM] = formData.startTime.split(':').map(Number)
        const [endH, endM] = formData.endTime.split(':').map(Number)

        const startMinutes = startH * 60 + startM
        const endMinutes = endH * 60 + endM

        let diffMinutes = endMinutes - startMinutes

        // Si on a des jours différents
        if (formData.date && formData.end_date && formData.date !== formData.end_date) {
            const start = new Date(`${formData.date}T${formData.startTime}`)
            const end = new Date(`${formData.end_date}T${formData.endTime}`)
            const diffMs = end.getTime() - start.getTime()
            diffMinutes = Math.floor(diffMs / 60000)
        } else if (diffMinutes < 0) {
            return "Invalide (fin avant début)"
        }

        if (diffMinutes <= 0 && (!formData.end_date || formData.date === formData.end_date)) return ""

        const days = Math.floor(diffMinutes / (24 * 60))
        const remainingMinutesAfterDays = diffMinutes % (24 * 60)
        const hours = Math.floor(remainingMinutesAfterDays / 60)
        const minutes = remainingMinutesAfterDays % 60

        let durationStr = ""
        if (days > 0) durationStr += `${days}j `
        if (hours > 0) durationStr += `${hours}h `
        if (minutes > 0) durationStr += `${minutes}min`

        return durationStr.trim()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.category) {
            toast.error("Veuillez sélectionner une catégorie")
            return
        }

        try {
            setIsSaving(true)

            const duration = calculateDuration()
            // Si l'utilisateur n'a pas changé les heures, on garde l'ancienne durée ? 
            // Non, on force la resaisie pour l'instant pour garantir la cohérence.
            if (!duration && formData.startTime && formData.endTime) {
                // Si duration vide mais heures remplies -> calcul invalide ou nul
            }

            const updateData: any = {
                title: formData.title,
                description: formData.description,
                date: formData.date,
                end_date: formData.end_date || null, // null pour effacer si vide
                time: formData.startTime,
                location: formData.location,
                category: formData.category,
                type: formData.type,
                maxParticipants: parseInt(formData.maxParticipants) || 100,
                organizer: formData.organizers.join(", ") || "Non spécifié",
                price: formData.type === "payante" ? parseFloat(formData.montantRequis) : null,
                currency: formData.type === "payante" ? formData.devise : null,
            }

            if (duration && !duration.startsWith("Invalide")) {
                updateData.duration = duration
            }

            await activitiesService.update(id, updateData)

            toast.success("Activité mise à jour avec succès")
            router.push(`/activities/${id}`)
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour:", error)
            toast.error(error.message || "Impossible de mettre à jour l'activité")
        } finally {
            setIsSaving(false)
        }
    }

    const toggleOrganizer = (name: string) => {
        setFormData(prev => ({
            ...prev,
            organizers: prev.organizers.includes(name)
                ? prev.organizers.filter(o => o !== name)
                : [...prev.organizers, name]
        }))
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Modifier l'activité</h1>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-4">
                            {/* Titre */}
                            <div className="grid gap-2">
                                <Label htmlFor="title">Titre *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            {/* Type */}
                            <div className="grid gap-2">
                                <Label>Type d'activité *</Label>
                                <RadioGroup
                                    value={formData.type}
                                    onValueChange={(value: "libre" | "payante") => setFormData({ ...formData, type: value })}
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="libre" id="libre" />
                                        <Label htmlFor="libre" className="font-normal cursor-pointer">
                                            <Badge variant="outline" className="bg-green-50 text-green-700">Libre</Badge>
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="payante" id="payante" />
                                        <Label htmlFor="payante" className="font-normal cursor-pointer">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700">Payante</Badge>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Prix (si payante) */}
                            {formData.type === "payante" && (
                                <div className="grid grid-cols-2 gap-4 border rounded-lg p-4 bg-blue-50/50">
                                    <div className="grid gap-2">
                                        <Label htmlFor="montantRequis">Prix *</Label>
                                        <Input
                                            id="montantRequis"
                                            type="number"
                                            min="0"
                                            value={formData.montantRequis}
                                            onChange={(e) => setFormData({ ...formData, montantRequis: e.target.value })}
                                            required={formData.type === "payante"}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="devise">Devise</Label>
                                        <Select
                                            value={formData.devise}
                                            onValueChange={(value: "CDF" | "USD") => setFormData({ ...formData, devise: value })}
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
                            )}

                            {/* Catégorie */}
                            <div className="grid gap-2">
                                <Label htmlFor="category">Catégorie *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="date">Date de début *</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end_date">Date de fin</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={formData.end_date}
                                        min={formData.date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Heures */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="startTime">Heure de début *</Label>
                                    <Input
                                        id="startTime"
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="endTime">Heure de fin *</Label>
                                    <Input
                                        id="endTime"
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        // required enlevé car on ne l'a pas forcément au chargement
                                        placeholder="Recalculer la durée..."
                                    />
                                </div>
                            </div>

                            {(formData.startTime && formData.endTime) && (
                                <div className="text-sm text-muted-foreground">
                                    Nouvelle durée calculée: <strong>{calculateDuration()}</strong>
                                </div>
                            )}

                            {/* Lieu */}
                            <div className="grid gap-2">
                                <Label htmlFor="location">Lieu *</Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Participants Max */}
                            <div className="grid gap-2">
                                <Label htmlFor="maxParticipants">Participants max</Label>
                                <Input
                                    id="maxParticipants"
                                    type="number"
                                    value={formData.maxParticipants}
                                    onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                                    min="1"
                                />
                            </div>

                            {/* Coordinateurs */}
                            <div className="grid gap-2">
                                <Label>Coordinateurs (optionnel)</Label>
                                <Popover open={isOrganizerOpen} onOpenChange={setIsOrganizerOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" className="justify-between w-full">
                                            {formData.organizers.length > 0
                                                ? `${formData.organizers.length} sélectionné(s)`
                                                : "Modifier les coordinateurs"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Rechercher..." />
                                            <CommandEmpty>Aucune personne trouvée</CommandEmpty>
                                            <CommandGroup className="max-h-64 overflow-auto">
                                                {people.map((person) => (
                                                    <CommandItem key={person.nom} onSelect={() => toggleOrganizer(person.nom)}>
                                                        <Check className={`mr-2 h-4 w-4 ${formData.organizers.includes(person.nom) ? "opacity-100" : "opacity-0"}`} />
                                                        {person.nom}
                                                        <Badge variant="outline" className="ml-auto text-xs">{person.type}</Badge>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                                {formData.organizers.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.organizers.map((org) => (
                                            <Badge key={org} variant="secondary" className="gap-1">
                                                {org}
                                                <X className="h-3 w-3 cursor-pointer" onClick={() => toggleOrganizer(org)} />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-6 bg-gray-50/50">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
