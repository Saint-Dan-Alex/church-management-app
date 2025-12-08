"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { sallesService } from "@/lib/services/salles.service"
import { monitorsService } from "@/lib/services/monitors.service"
import { childrenService } from "@/lib/services/children.service"
import { worshipReportsService } from "@/lib/services/worship-reports.service"
import type { Salle, Monitor } from "@/lib/types/api"
import { toast } from "sonner"

interface Person {
    id: string
    nom: string
    type: 'moniteur' | 'enfant'
}

export default function EditWorshipReportPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const [salles, setSalles] = useState<Salle[]>([])
    const [personnes, setPersonnes] = useState<Person[]>([])
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [openModerateurs, setOpenModerateurs] = useState(false)
    const [openAssistants, setOpenAssistants] = useState(false)
    const [openOrateurs, setOpenOrateurs] = useState(false)

    const [formData, setFormData] = useState({
        date: "",
        salle: "",
        moderateurs: [] as string[],
        assistants: [] as string[],
        orateurs: [] as string[],
        effectif_freres: "",
        effectif_soeurs: "",
        offrandes: "",
        nombre_nouveaux_venus: 0,
    })

    useEffect(() => {
        loadData()
        loadReport()
    }, [id])

    const loadData = async () => {
        try {
            setIsLoadingData(true)
            const [sallesResponse, moniteursResponse, enfantsResponse] = await Promise.all([
                sallesService.getAll(),
                monitorsService.getAll(),
                childrenService.getAll()
            ])

            const sallesData = Array.isArray(sallesResponse) ? sallesResponse : (sallesResponse as any).data || []
            const moniteursData = Array.isArray(moniteursResponse) ? moniteursResponse : (moniteursResponse as any).data || []
            const enfantsData = Array.isArray(enfantsResponse) ? enfantsResponse : (enfantsResponse as any).data || []

            const personnesList: Person[] = [
                ...moniteursData.map((m: any) => ({
                    id: m.id,
                    nom: m.nom_complet,
                    type: 'moniteur' as const
                })),
                ...enfantsData.map((e: any) => ({
                    id: e.id,
                    nom: `${e.prenom} ${e.nom}`,
                    type: 'enfant' as const
                }))
            ]

            setSalles(sallesData)
            setPersonnes(personnesList)
        } catch (error) {
            console.error("Erreur lors du chargement des données:", error)
            toast.error("Impossible de charger les données")
        } finally {
            setIsLoadingData(false)
        }
    }

    const loadReport = async () => {
        try {
            const report = await worshipReportsService.getById(id)

            const parseJsonArray = (jsonString: string | string[] | null | undefined): string[] => {
                if (!jsonString) return []
                if (Array.isArray(jsonString)) return jsonString
                try {
                    const parsed = JSON.parse(jsonString)
                    return Array.isArray(parsed) ? parsed : []
                } catch {
                    return []
                }
            }

            const orateurs = parseJsonArray(report.orateurs)
            const moderateurs = parseJsonArray(report.moderateurs)
            const assistants = parseJsonArray(report.assistants)

            // Format date to YYYY-MM-DD for input[type="date"]
            const formatDate = (dateString: string) => {
                const date = new Date(dateString)
                return date.toISOString().split('T')[0]
            }

            setFormData({
                date: formatDate(report.date),
                salle: report.salle,
                moderateurs: moderateurs,
                assistants: assistants,
                orateurs: orateurs,
                effectif_freres: report.effectif_freres?.toString() || "",
                effectif_soeurs: report.effectif_soeurs?.toString() || "",
                offrandes: report.offrandes || "",
                nombre_nouveaux_venus: report.nombre_nouveaux_venus || 0,
            })
        } catch (error: any) {
            console.error("Erreur lors du chargement du rapport:", error)
            toast.error("Impossible de charger le rapport")
            router.push("/worship")
        }
    }

    const addPersonne = (field: 'moderateurs' | 'assistants' | 'orateurs', nom: string) => {
        if (!formData[field].includes(nom)) {
            setFormData({ ...formData, [field]: [...formData[field], nom] })
        }
    }

    const removePersonne = (field: 'moderateurs' | 'assistants' | 'orateurs', nom: string) => {
        setFormData({ ...formData, [field]: formData[field].filter(p => p !== nom) })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.salle) {
            toast.error("Veuillez sélectionner une salle")
            return
        }

        try {
            setIsSaving(true)

            const dataToSend = {
                date: formData.date,
                salle: formData.salle,
                orateurs: formData.orateurs,
                predicateur: formData.orateurs[0] || "",
                moderateurs: formData.moderateurs,
                assistants: formData.assistants,
                effectif_freres: parseInt(formData.effectif_freres) || 0,
                effectif_soeurs: parseInt(formData.effectif_soeurs) || 0,
                offrandes: formData.offrandes,
                nombre_nouveaux_venus: formData.nombre_nouveaux_venus,
            }

            await worshipReportsService.update(id, dataToSend)

            toast.success("Rapport modifié avec succès")
            router.push(`/worship/${id}`)
        } catch (error: any) {
            console.error("Erreur lors de la modification:", error)
            toast.error(error.message || "Impossible de modifier le rapport")
        } finally {
            setIsSaving(false)
        }
    }

    const effectifTotal = (parseInt(formData.effectif_freres) || 0) + (parseInt(formData.effectif_soeurs) || 0)

    const PersonneCombobox = ({
        field,
        label,
        open,
        setOpen
    }: {
        field: 'moderateurs' | 'assistants' | 'orateurs'
        label: string
        open: boolean
        setOpen: (open: boolean) => void
    }) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {formData[field].length > 0
                            ? `${formData[field].length} sélectionné(s)`
                            : "Sélectionner..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Rechercher..." />
                        <CommandEmpty>Aucune personne trouvée.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                            {personnes.map((personne) => (
                                <CommandItem
                                    key={personne.id}
                                    value={personne.nom}
                                    onSelect={() => {
                                        if (formData[field].includes(personne.nom)) {
                                            removePersonne(field, personne.nom)
                                        } else {
                                            addPersonne(field, personne.nom)
                                        }
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            formData[field].includes(personne.nom) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {personne.nom}
                                    <Badge variant="outline" className="ml-2 text-xs">
                                        {personne.type}
                                    </Badge>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

            {formData[field].length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData[field].map((nom, index) => (
                        <Badge key={`${field}-${nom}-${index}`} variant="secondary" className="gap-1">
                            {nom}
                            <X
                                className="h-3 w-3 cursor-pointer hover:text-red-600"
                                onClick={() => removePersonne(field, nom)}
                            />
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )

    if (isLoadingData) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-blue-900">Modifier le Rapport</h1>
                    <p className="text-gray-600">Modifiez les informations du rapport de culte</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informations du rapport</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Date et Salle */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="date">Date du culte *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="salle">Salle *</Label>
                                <Select
                                    value={formData.salle}
                                    onValueChange={(value) => setFormData({ ...formData, salle: value })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une salle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {salles.map((salle) => (
                                            <SelectItem key={salle.id} value={salle.nom}>
                                                {salle.nom}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Modérateurs */}
                        <PersonneCombobox
                            field="moderateurs"
                            label="Modérateurs"
                            open={openModerateurs}
                            setOpen={setOpenModerateurs}
                        />

                        {/* Assistants */}
                        <PersonneCombobox
                            field="assistants"
                            label="Assistants"
                            open={openAssistants}
                            setOpen={setOpenAssistants}
                        />

                        {/* Orateurs */}
                        <PersonneCombobox
                            field="orateurs"
                            label="Orateurs / Prédicateurs"
                            open={openOrateurs}
                            setOpen={setOpenOrateurs}
                        />

                        {/* Effectifs */}
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="font-semibold text-gray-900">Effectifs</h3>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="effectif_freres">Frères *</Label>
                                    <Input
                                        id="effectif_freres"
                                        type="number"
                                        min="0"
                                        value={formData.effectif_freres}
                                        onChange={(e) => setFormData({ ...formData, effectif_freres: e.target.value })}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="effectif_soeurs">Sœurs *</Label>
                                    <Input
                                        id="effectif_soeurs"
                                        type="number"
                                        min="0"
                                        value={formData.effectif_soeurs}
                                        onChange={(e) => setFormData({ ...formData, effectif_soeurs: e.target.value })}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="effectif_total">Total</Label>
                                    <Input
                                        id="effectif_total"
                                        type="number"
                                        value={effectifTotal}
                                        disabled
                                        className="bg-gray-100 font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Offrandes */}
                        <div className="grid gap-2">
                            <Label htmlFor="offrandes">Offrandes</Label>
                            <Input
                                id="offrandes"
                                value={formData.offrandes}
                                onChange={(e) => setFormData({ ...formData, offrandes: e.target.value })}
                                placeholder="Ex: 171,700 FC + 1 GN"
                            />
                        </div>

                        {/* Nouveaux venus */}
                        <div className="grid gap-2">
                            <Label htmlFor="nombre_nouveaux_venus">Nombre de nouveaux venus</Label>
                            <Input
                                id="nombre_nouveaux_venus"
                                type="number"
                                min="0"
                                value={formData.nombre_nouveaux_venus}
                                onChange={(e) => setFormData({ ...formData, nombre_nouveaux_venus: parseInt(e.target.value) || 0 })}
                                placeholder="0"
                            />
                        </div>

                        <div className="flex gap-2 justify-end pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Enregistrer
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
