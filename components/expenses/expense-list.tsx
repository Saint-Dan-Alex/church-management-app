"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash2, FileText, Loader2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Expense } from "@/types/expense"
import { useToast } from "@/hooks/use-toast"
import { expensesService } from "@/lib/services"

interface ExpenseListProps {
    searchQuery: string
    filter: string
}

export function ExpenseList({ searchQuery, filter }: ExpenseListProps) {
    const { toast } = useToast()
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Charger les dépenses au montage du composant
    useEffect(() => {
        loadExpenses()
    }, [])

    const loadExpenses = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await expensesService.getAll()
            setExpenses(Array.isArray(data) ? data : [])
        } catch (err: any) {
            const errorMessage = err.message || 'Erreur de chargement des dépenses'
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

    // Filtrage
    const filteredExpenses = expenses.filter((expense) => {
        const matchesSearch =
            expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expense.beneficiaire?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expense.categorie.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expense.activity_nom?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesFilter =
            filter === "all" ||
            (filter === "cdf" && expense.devise === "CDF") ||
            (filter === "usd" && expense.devise === "USD") ||
            expense.categorie.toLowerCase() === filter.toLowerCase()

        return matchesSearch && matchesFilter
    })

    const handleEdit = (expense: Expense) => {
        toast({
            title: "Modifier la dépense",
            description: `Édition de: ${expense.description}`,
        })
        console.log("Éditer dépense:", expense)
    }

    const handleDelete = async (expense: Expense) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer cette dépense ?\n\n${expense.description}`)) {
            try {
                await expensesService.delete(expense.id)
                toast({
                    title: "Dépense supprimée",
                    description: "La dépense a été supprimée avec succès.",
                })
                // Recharger les données
                loadExpenses()
            } catch (err: any) {
                toast({
                    title: "Erreur",
                    description: err.message || "Impossible de supprimer la dépense",
                    variant: "destructive"
                })
            }
        }
    }

    const handleViewDetails = (expense: Expense) => {
        toast({
            title: "Détails de la dépense",
            description: `${expense.description} - ${expense.montant} ${expense.devise}`,
        })
        console.log("Détails dépense:", expense)
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "decimal",
            minimumFractionDigits: 2,
        }).format(amount) + " " + currency
    }

    const getCategoryColor = (categorie: string) => {
        const colors: Record<string, string> = {
            Transport: "bg-blue-100 text-blue-800",
            Alimentation: "bg-green-100 text-green-800",
            Matériel: "bg-purple-100 text-purple-800",
            Location: "bg-orange-100 text-orange-800",
            Honoraires: "bg-pink-100 text-pink-800",
            Fournitures: "bg-cyan-100 text-cyan-800",
            Maintenance: "bg-yellow-100 text-yellow-800",
            Communication: "bg-indigo-100 text-indigo-800",
            Autre: "bg-gray-100 text-gray-800",
        }
        return colors[categorie] || colors.Autre
    }

    // État de chargement
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Chargement des dépenses...</span>
            </div>
        )
    }

    // État d'erreur
    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={loadExpenses} variant="outline">
                    Réessayer
                </Button>
            </div>
        )
    }

    // Aucune dépense
    if (filteredExpenses.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Aucune dépense trouvée</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredExpenses.map((expense) => (
                <Card key={expense.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                                <CardTitle className="text-lg line-clamp-1">
                                    {expense.description}
                                </CardTitle>
                                <CardDescription className="line-clamp-1">
                                    {expense.beneficiaire}
                                </CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewDetails(expense)}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        Détails
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEdit(expense)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Modifier
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleDelete(expense)}
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
                            <Badge className={getCategoryColor(expense.categorie)}>
                                {expense.categorie}
                            </Badge>
                            {expense.activity_nom && (
                                <Badge variant="outline" className="text-xs">
                                    {expense.activity_nom}
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Montant:</span>
                                <span className="font-bold text-lg">
                                    {formatCurrency(expense.montant, expense.devise)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Date:</span>
                                <span>{new Date(expense.date).toLocaleDateString("fr-FR")}</span>
                            </div>

                            {expense.reference_facture && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Facture:</span>
                                    <span className="font-mono text-xs">{expense.reference_facture}</span>
                                </div>
                            )}

                            {expense.ajoute_par_nom && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Ajouté par:</span>
                                    <span className="text-xs">{expense.ajoute_par_nom}</span>
                                </div>
                            )}

                            {expense.remarque && (
                                <div className="pt-2 border-t">
                                    <p className="text-xs text-muted-foreground italic line-clamp-2">
                                        {expense.remarque}
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
