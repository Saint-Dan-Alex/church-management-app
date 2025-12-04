"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash2, Calendar, Loader2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { cotisationsService, type Cotisation } from "@/lib/services"

interface CotisationListProps {
    searchQuery: string
    filter: string
}

export function CotisationList({ searchQuery, filter }: CotisationListProps) {
    const { toast } = useToast()
    const [cotisations, setCotisations] = useState<Cotisation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadCotisations()
    }, [])

    const loadCotisations = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await cotisationsService.getAll()
            setCotisations(Array.isArray(data) ? data : [])
        } catch (err: any) {
            const errorMessage = err.message || 'Erreur de chargement des cotisations'
            setError(errorMessage)
            toast({
                title: "Erreur",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const filteredCotisations = cotisations.filter((cotisation) => {
        const matchesSearch =
            cotisation.membre_nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cotisation.type_cotisation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cotisation.mois.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesFilter =
            filter === "all" ||
            (filter === "cdf" && cotisation.devise === "CDF") ||
            (filter === "usd" && cotisation.devise === "USD") ||
            cotisation.type_cotisation.toLowerCase() === filter.toLowerCase()

        return matchesSearch && matchesFilter
    })

    const handleEdit = (cotisation: Cotisation) => {
        toast({
            title: "Modifier la cotisation",
            description: `${cotisation.membre_nom} - ${cotisation.mois} ${cotisation.annee}`,
        })
        console.log("Éditer cotisation:", cotisation)
    }

    const handleDelete = async (cotisation: Cotisation) => {
        if (confirm(`Supprimer cette cotisation ?\n\n${cotisation.membre_nom} - ${cotisation.mois} ${cotisation.annee}`)) {
            try {
                await cotisationsService.delete(cotisation.id)
                toast({
                    title: "Cotisation supprimée",
                    description: "La cotisation a été supprimée avec succès.",
                })
                loadCotisations()
            } catch (err: any) {
                toast({
                    title: "Erreur",
                    description: err.message || "Impossible de supprimer la cotisation",
                    variant: "destructive"
                })
            }
        }
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "decimal",
            minimumFractionDigits: 2,
        }).format(amount) + " " + currency
    }

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            Mensuelle: "bg-blue-100 text-blue-800",
            Trimestrielle: "bg-green-100 text-green-800",
            Annuelle: "bg-purple-100 text-purple-800",
            Spéciale: "bg-orange-100 text-orange-800",
        }
        return colors[type] || colors.Mensuelle
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Chargement des cotisations...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={loadCotisations} variant="outline">
                    Réessayer
                </Button>
            </div>
        )
    }

    if (filteredCotisations.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Aucune cotisation trouvée</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCotisations.map((cotisation) => (
                <Card key={cotisation.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                                <CardTitle className="text-lg line-clamp-1">
                                    {cotisation.membre_nom}
                                </CardTitle>
                                <CardDescription className="line-clamp-1">
                                    {cotisation.mois} {cotisation.annee}
                                </CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEdit(cotisation)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Modifier
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleDelete(cotisation)}
                                        className="text-red-600"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Supprimer
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Badge className={getTypeColor(cotisation.type_cotisation)}>
                                {cotisation.type_cotisation}
                            </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Montant:</span>
                                <span className="font-bold text-lg">
                                    {formatCurrency(cotisation.montant, cotisation.devise)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Méthode:</span>
                                <span>{cotisation.methode_paiement}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Date:</span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(cotisation.date_cotisation).toLocaleDateString("fr-FR")}
                                </span>
                            </div>

                            {cotisation.remarque && (
                                <div className="pt-2 border-t">
                                    <p className="text-xs text-muted-foreground italic line-clamp-2">
                                        {cotisation.remarque}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
