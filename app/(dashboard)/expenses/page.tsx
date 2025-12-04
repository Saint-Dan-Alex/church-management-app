"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, TrendingDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpenseList } from "@/components/expenses/expense-list"
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog"

export default function ExpensesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    // Statistiques mockées
    const stats = {
        total_cdf: 850000,
        total_usd: 550,
        nombre_depenses: 4,
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dépenses</h1>
                    <p className="text-muted-foreground">Gestion des dépenses de l'église</p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle Dépense
                </Button>
            </div>

            {/* Statistiques */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total CDF</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat("fr-FR").format(stats.total_cdf)} CDF
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Toutes les dépenses en francs congolais
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total USD</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${new Intl.NumberFormat("fr-FR").format(stats.total_usd)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Toutes les dépenses en dollars
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nombre de dépenses</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.nombre_depenses}</div>
                        <p className="text-xs text-muted-foreground">
                            Dépenses enregistrées
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">Toutes</TabsTrigger>
                    <TabsTrigger value="cdf">CDF</TabsTrigger>
                    <TabsTrigger value="usd">USD</TabsTrigger>
                    <TabsTrigger value="transport">Transport</TabsTrigger>
                    <TabsTrigger value="alimentation">Alimentation</TabsTrigger>
                    <TabsTrigger value="matériel">Matériel</TabsTrigger>
                </TabsList>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher une dépense..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <TabsContent value="all">
                    <ExpenseList searchQuery={searchQuery} filter="all" />
                </TabsContent>

                <TabsContent value="cdf">
                    <ExpenseList searchQuery={searchQuery} filter="cdf" />
                </TabsContent>

                <TabsContent value="usd">
                    <ExpenseList searchQuery={searchQuery} filter="usd" />
                </TabsContent>

                <TabsContent value="transport">
                    <ExpenseList searchQuery={searchQuery} filter="transport" />
                </TabsContent>

                <TabsContent value="alimentation">
                    <ExpenseList searchQuery={searchQuery} filter="alimentation" />
                </TabsContent>

                <TabsContent value="matériel">
                    <ExpenseList searchQuery={searchQuery} filter="matériel" />
                </TabsContent>
            </Tabs>

            <AddExpenseDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
        </div>
    )
}
