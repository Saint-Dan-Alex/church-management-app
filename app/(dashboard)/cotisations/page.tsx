"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Wallet, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CotisationList } from "@/components/cotisations/cotisation-list"
import { AddCotisationDialog } from "@/components/cotisations/add-cotisation-dialog"

export default function CotisationsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    // Statistiques mockées
    const stats = {
        total_cotisations: 4,
        total_cdf: 90000,
        total_usd: 650,
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cotisations</h1>
                    <p className="text-muted-foreground">Gestion des cotisations des membres</p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle Cotisation
                </Button>
            </div>

            {/* Statistiques */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total cotisations</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_cotisations}</div>
                        <p className="text-xs text-muted-foreground">
                            Cotisations enregistrées
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total CDF</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {new Intl.NumberFormat("fr-FR").format(stats.total_cdf)} CDF
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Montant total en francs
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total USD</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            ${new Intl.NumberFormat("fr-FR").format(stats.total_usd)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Montant total en dollars
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">Toutes</TabsTrigger>
                    <TabsTrigger value="mensuelle">Mensuelles</TabsTrigger>
                    <TabsTrigger value="trimestrielle">Trimestrielles</TabsTrigger>
                    <TabsTrigger value="annuelle">Annuelles</TabsTrigger>
                    <TabsTrigger value="cdf">CDF</TabsTrigger>
                    <TabsTrigger value="usd">USD</TabsTrigger>
                </TabsList>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher une cotisation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <TabsContent value="all">
                    <CotisationList searchQuery={searchQuery} filter="all" />
                </TabsContent>

                <TabsContent value="mensuelle">
                    <CotisationList searchQuery={searchQuery} filter="mensuelle" />
                </TabsContent>

                <TabsContent value="trimestrielle">
                    <CotisationList searchQuery={searchQuery} filter="trimestrielle" />
                </TabsContent>

                <TabsContent value="annuelle">
                    <CotisationList searchQuery={searchQuery} filter="annuelle" />
                </TabsContent>

                <TabsContent value="cdf">
                    <CotisationList searchQuery={searchQuery} filter="cdf" />
                </TabsContent>

                <TabsContent value="usd">
                    <CotisationList searchQuery={searchQuery} filter="usd" />
                </TabsContent>
            </Tabs>

            <AddCotisationDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
        </div>
    )
}
