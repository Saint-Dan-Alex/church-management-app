"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Users, UserCheck, UserX, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PresenceList } from "@/components/presences/presence-list"
import { AddPresenceDialog } from "@/components/presences/add-presence-dialog"

export default function PresencesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    // Statistiques mockées
    const stats = {
        total: 4,
        presents: 1,
        absents: 1,
        retards: 1,
        excuses: 1,
    }

    const tauxPresence = ((stats.presents / stats.total) * 100).toFixed(1)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Présences</h1>
                    <p className="text-muted-foreground">Suivi des présences aux activités</p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Enregistrer Présence
                </Button>
            </div>

            {/* Statistiques */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            Enregistrements
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Présents</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.presents}</div>
                        <p className="text-xs text-muted-foreground">
                            Taux: {tauxPresence}%
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Absents</CardTitle>
                        <UserX className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.absents}</div>
                        <p className="text-xs text-muted-foreground">
                            Non présents
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Retards</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.retards}</div>
                        <p className="text-xs text-muted-foreground">
                            En retard
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Excusés</CardTitle>
                        <UserCheck className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.excuses}</div>
                        <p className="text-xs text-muted-foreground">
                            Absence justifiée
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">Toutes</TabsTrigger>
                    <TabsTrigger value="present">Présents</TabsTrigger>
                    <TabsTrigger value="absent">Absents</TabsTrigger>
                    <TabsTrigger value="retard">Retards</TabsTrigger>
                    <TabsTrigger value="excuse">Excusés</TabsTrigger>
                </TabsList>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher une présence..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <TabsContent value="all">
                    <PresenceList searchQuery={searchQuery} filter="all" />
                </TabsContent>

                <TabsContent value="present">
                    <PresenceList searchQuery={searchQuery} filter="present" />
                </TabsContent>

                <TabsContent value="absent">
                    <PresenceList searchQuery={searchQuery} filter="absent" />
                </TabsContent>

                <TabsContent value="retard">
                    <PresenceList searchQuery={searchQuery} filter="retard" />
                </TabsContent>

                <TabsContent value="excuse">
                    <PresenceList searchQuery={searchQuery} filter="excuse" />
                </TabsContent>
            </Tabs>

            <AddPresenceDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
        </div>
    )
}
