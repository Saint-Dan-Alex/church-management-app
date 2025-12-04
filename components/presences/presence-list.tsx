"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash2, UserCheck, UserX, Clock, Loader2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Presence } from "@/types/presence"
import { useToast } from "@/hooks/use-toast"
import { presencesService } from "@/lib/services"

interface PresenceListProps {
    searchQuery: string
    filter: string
}

export function PresenceList({ searchQuery, filter }: PresenceListProps) {
    const { toast } = useToast()
    const [presences, setPresences] = useState<Presence[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadPresences()
    }, [])

    const loadPresences = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await presencesService.getAll()
            setPresences(Array.isArray(data) ? data : [])
        } catch (err: any) {
            const errorMessage = err.message || 'Erreur de chargement des présences'
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

    const filteredPresences = presences.filter((presence) => {
        const matchesSearch =
            presence.moniteur_nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            presence.activity_nom?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesFilter = filter === "all" || presence.statut === filter

        return matchesSearch && matchesFilter
    })

    const handleEdit = (presence: Presence) => {
        toast({
            title: "Modifier la présence",
            description: `${presence.moniteur_nom} - ${presence.activity_nom}`,
        })
        console.log("Éditer présence:", presence)
    }

    const handleDelete = async (presence: Presence) => {
        if (confirm(`Supprimer cette présence ?\n\n${presence.moniteur_nom} - ${presence.activity_nom}`)) {
            try {
                await presencesService.delete(presence.id)
                toast({
                    title: "Présence supprimée",
                    description: "La présence a été supprimée avec succès.",
                })
                loadPresences()
            } catch (err: any) {
                toast({
                    title: "Erreur",
                    description: err.message || "Impossible de supprimer la présence",
                    variant: "destructive"
                })
            }
        }
    }

    const getStatusColor = (statut: string) => {
        const colors: Record<string, string> = {
            present: "bg-green-100 text-green-800",
            absent: "bg-red-100 text-red-800",
            retard: "bg-yellow-100 text-yellow-800",
            excuse: "bg-blue-100 text-blue-800",
        }
        return colors[statut] || colors.present
    }

    const getStatusIcon = (statut: string) => {
        switch (statut) {
            case "present":
                return <UserCheck className="h-4 w-4" />
            case "absent":
                return <UserX className="h-4 w-4" />
            case "retard":
                return <Clock className="h-4 w-4" />
            default:
                return <UserCheck className="h-4 w-4" />
        }
    }

    const getStatusLabel = (statut: string) => {
        const labels: Record<string, string> = {
            present: "Présent",
            absent: "Absent",
            retard: "Retard",
            excuse: "Excusé",
        }
        return labels[statut] || statut
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Chargement des présences...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={loadPresences} variant="outline">
                    Réessayer
                </Button>
            </div>
        )
    }

    if (filteredPresences.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Aucune présence trouvée</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPresences.map((presence) => (
                <Card key={presence.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                                <CardTitle className="text-lg line-clamp-1">
                                    {presence.moniteur_nom}
                                </CardTitle>
                                <CardDescription className="line-clamp-1">
                                    {presence.activity_nom}
                                </CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEdit(presence)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Modifier
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleDelete(presence)}
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
                            <Badge className={getStatusColor(presence.statut)}>
                                <span className="mr-1">{getStatusIcon(presence.statut)}</span>
                                {getStatusLabel(presence.statut)}
                            </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Date:</span>
                                <span className="font-medium">
                                    {new Date(presence.date_presence).toLocaleDateString("fr-FR")}
                                </span>
                            </div>

                            {presence.heure_arrivee && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Heure:</span>
                                    <span>{presence.heure_arrivee}</span>
                                </div>
                            )}

                            {presence.remarque && (
                                <div className="pt-2 border-t">
                                    <p className="text-xs text-muted-foreground italic line-clamp-2">
                                        {presence.remarque}
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
