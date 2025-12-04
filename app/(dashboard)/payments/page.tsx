"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, DollarSign, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentList } from "@/components/payments/payment-list"
import { AddPaymentDialog } from "@/components/payments/add-payment-dialog"

export default function PaymentsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    // Statistiques mockées
    const stats = {
        total_paiements: 4,
        payes: 1,
        en_attente: 1,
        partiels: 1,
        total_cdf: 55000,
        total_usd: 175,
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Paiements</h1>
                    <p className="text-muted-foreground">Gestion des paiements et revenus</p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Paiement
                </Button>
            </div>

            {/* Statistiques */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total paiements</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_paiements}</div>
                        <p className="text-xs text-muted-foreground">
                            Tous les paiements enregistrés
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Payés</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.payes}</div>
                        <p className="text-xs text-muted-foreground">
                            Paiements complétés
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En attente</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.en_attente}</div>
                        <p className="text-xs text-muted-foreground">
                            À recevoir
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Partiels</CardTitle>
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.partiels}</div>
                        <p className="text-xs text-muted-foreground">
                            Paiements partiels
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Totaux par devise */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Total CDF</CardTitle>
                        <CardDescription>Montants payés en francs congolais</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {new Intl.NumberFormat("fr-FR").format(stats.total_cdf)} CDF
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total USD</CardTitle>
                        <CardDescription>Montants payés en dollars</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            ${new Intl.NumberFormat("fr-FR").format(stats.total_usd)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">Tous</TabsTrigger>
                    <TabsTrigger value="paid">Payés</TabsTrigger>
                    <TabsTrigger value="pending">En attente</TabsTrigger>
                    <TabsTrigger value="partial">Partiels</TabsTrigger>
                    <TabsTrigger value="overdue">En retard</TabsTrigger>
                </TabsList>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher un paiement..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <TabsContent value="all">
                    <PaymentList searchQuery={searchQuery} filter="all" />
                </TabsContent>

                <TabsContent value="paid">
                    <PaymentList searchQuery={searchQuery} filter="paid" />
                </TabsContent>

                <TabsContent value="pending">
                    <PaymentList searchQuery={searchQuery} filter="pending" />
                </TabsContent>

                <TabsContent value="partial">
                    <PaymentList searchQuery={searchQuery} filter="partial" />
                </TabsContent>

                <TabsContent value="overdue">
                    <PaymentList searchQuery={searchQuery} filter="overdue" />
                </TabsContent>
            </Tabs>

            <AddPaymentDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
        </div>
    )
}
