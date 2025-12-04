"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash2, Receipt, Loader2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Payment } from "@/types/payment"
import { useToast } from "@/hooks/use-toast"
import { paymentsService } from "@/lib/services"

interface PaymentListProps {
    searchQuery: string
    filter: string
}

export function PaymentList({ searchQuery, filter }: PaymentListProps) {
    const { toast } = useToast()
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadPayments()
    }, [])

    const loadPayments = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await paymentsService.getAll()
            setPayments(Array.isArray(data) ? data : [])
        } catch (err: any) {
            const errorMessage = err.message || 'Erreur de chargement des paiements'
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

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.participant_nom_complet?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.activity_nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.numero_paiement?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesFilter =
            filter === "all" ||
            payment.statut === filter ||
            (filter === "cdf" && payment.devise === "CDF") ||
            (filter === "usd" && payment.devise === "USD")

        return matchesSearch && matchesFilter
    })

    const handleEdit = (payment: Payment) => {
        toast({
            title: "Modifier le paiement",
            description: `Édition de: ${payment.numero_paiement}`,
        })
        console.log("Éditer paiement:", payment)
    }

    const handleDelete = async (payment: Payment) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer ce paiement ?\n\n${payment.numero_paiement}`)) {
            try {
                await paymentsService.delete(payment.id)
                toast({
                    title: "Paiement supprimé",
                    description: "Le paiement a été supprimé avec succès.",
                })
                loadPayments()
            } catch (err: any) {
                toast({
                    title: "Erreur",
                    description: err.message || "Impossible de supprimer le paiement",
                    variant: "destructive"
                })
            }
        }
    }

    const handleViewReceipt = (payment: Payment) => {
        if (payment.numero_recu) {
            toast({
                title: "Reçu",
                description: `Reçu N° ${payment.numero_recu}`,
            })
            console.log("Voir reçu:", payment.numero_recu)
        } else {
            toast({
                title: "Aucun reçu",
                description: "Aucun reçu disponible pour ce paiement",
                variant: "destructive",
            })
        }
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "decimal",
            minimumFractionDigits: 2,
        }).format(amount) + " " + currency
    }

    const getStatusColor = (statut: string) => {
        const colors: Record<string, string> = {
            paid: "bg-green-100 text-green-800",
            pending: "bg-yellow-100 text-yellow-800",
            partial: "bg-blue-100 text-blue-800",
            overdue: "bg-red-100 text-red-800",
            cancelled: "bg-gray-100 text-gray-800",
        }
        return colors[statut] || colors.pending
    }

    const getStatusLabel = (statut: string) => {
        const labels: Record<string, string> = {
            paid: "Payé",
            pending: "En attente",
            partial: "Partiel",
            overdue: "En retard",
            cancelled: "Annulé",
        }
        return labels[statut] || statut
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Chargement des paiements...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={loadPayments} variant="outline">
                    Réessayer
                </Button>
            </div>
        )
    }

    if (filteredPayments.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun paiement trouvé</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPayments.map((payment) => (
                <Card key={payment.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                                <CardTitle className="text-lg line-clamp-1">
                                    {payment.participant_nom_complet}
                                </CardTitle>
                                <CardDescription className="line-clamp-1">
                                    {payment.numero_paiement}
                                </CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {payment.numero_recu && (
                                        <DropdownMenuItem onClick={() => handleViewReceipt(payment)}>
                                            <Receipt className="mr-2 h-4 w-4" />
                                            Voir reçu
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => handleEdit(payment)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Modifier
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleDelete(payment)}
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
                            <Badge className={getStatusColor(payment.statut)}>
                                {getStatusLabel(payment.statut)}
                            </Badge>
                            {payment.activity_nom && (
                                <Badge variant="outline" className="text-xs">
                                    {payment.activity_nom}
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Montant:</span>
                                <span className="font-bold">
                                    {formatCurrency(payment.montant, payment.devise)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Payé:</span>
                                <span className={payment.montant_paye > 0 ? "text-green-600 font-semibold" : ""}>
                                    {formatCurrency(payment.montant_paye, payment.devise)}
                                </span>
                            </div>

                            {payment.montant_paye < payment.montant && (
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Reste:</span>
                                    <span className="text-red-600 font-semibold">
                                        {formatCurrency(payment.montant - payment.montant_paye, payment.devise)}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Méthode:</span>
                                <span>{payment.methode_paiement}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Échéance:</span>
                                <span className={payment.statut === "overdue" ? "text-red-600" : ""}>
                                    {new Date(payment.date_echeance).toLocaleDateString("fr-FR")}
                                </span>
                            </div>

                            {payment.date_paiement && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Payé le:</span>
                                    <span>{new Date(payment.date_paiement).toLocaleDateString("fr-FR")}</span>
                                </div>
                            )}

                            {payment.remarque && (
                                <div className="pt-2 border-t">
                                    <p className="text-xs text-muted-foreground italic line-clamp-2">
                                        {payment.remarque}
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
