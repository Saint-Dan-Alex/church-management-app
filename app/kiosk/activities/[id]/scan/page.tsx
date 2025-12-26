"use client"

import { useState, useEffect, use } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    QrCode,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    Calendar,
    MapPin,
    Loader2,
    Search
} from "lucide-react"
import { activitiesService } from "@/lib/services/activities.service"
import { toast } from "sonner"

interface Activity {
    id: string
    title: string
    date: string
    end_date?: string
    time: string
    location: string
    participants?: any[]
}

export default function ActivityScanPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [activity, setActivity] = useState<Activity | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [scanResult, setScanResult] = useState<{
        success: boolean
        message: string
        participant?: any
    } | null>(null)

    useEffect(() => {
        loadActivity()
    }, [id])

    const loadActivity = async () => {
        try {
            setIsLoading(true)
            const data = await activitiesService.getById(id)
            setActivity(data)
            // Set initial date to activity date if in range
            if (data.date) {
                setSelectedDate(data.date)
            }
        } catch (error) {
            console.error("Erreur:", error)
            toast.error("Impossible de charger l'activité")
        } finally {
            setIsLoading(false)
        }
    }

    const handleManualSearch = async () => {
        if (!searchQuery.trim()) return

        const participants = activity?.participants || []
        const found = participants.find((p: any) =>
            p.participant_nom_complet?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.participant_nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.participant_prenom?.toLowerCase().includes(searchQuery.toLowerCase())
        )

        if (found) {
            // Marquer présent
            try {
                await activitiesService.markPresence({
                    activity_id: id,
                    participant_id: found.participant_id || found.id,
                    participant_type: found.participant_type || 'enfant',
                    statut: 'present',
                    date_presence: selectedDate,
                    heure_arrivee: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                    mode_enregistrement: 'manuel'
                })

                setScanResult({
                    success: true,
                    message: `${found.participant_nom_complet || found.participant_nom} marqué(e) présent(e)`,
                    participant: found
                })
                toast.success("Présence enregistrée!")
            } catch (error) {
                setScanResult({
                    success: false,
                    message: "Erreur lors de l'enregistrement",
                })
                toast.error("Erreur lors de l'enregistrement")
            }
        } else {
            setScanResult({
                success: false,
                message: "Participant non trouvé"
            })
        }

        setSearchQuery("")
        setTimeout(() => setScanResult(null), 3000)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
        )
    }

    if (!activity) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="pt-6 text-center">
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-lg">Activité introuvable</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <QrCode className="h-8 w-8 text-blue-400" />
                            <CardTitle className="text-2xl">Pointage</CardTitle>
                        </div>
                        <CardDescription className="text-white/70 text-lg">
                            {activity.title}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-400" />
                                <span>{formatDate(activity.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-400" />
                                <span>{activity.time}</span>
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-blue-400" />
                                <span>{activity.location}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Date selector for multi-day activities */}
                {activity.end_date && activity.end_date !== activity.date && (
                    <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                        <CardContent className="pt-6">
                            <Label htmlFor="date" className="text-white/80">Date de pointage</Label>
                            <Input
                                id="date"
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={activity.date}
                                max={activity.end_date}
                                className="mt-2 bg-white/10 border-white/20 text-white"
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Scan Result */}
                {scanResult && (
                    <Card className={`${scanResult.success ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'} backdrop-blur-lg text-white`}>
                        <CardContent className="pt-6 flex items-center justify-center gap-4">
                            {scanResult.success ? (
                                <CheckCircle2 className="h-12 w-12 text-green-400" />
                            ) : (
                                <XCircle className="h-12 w-12 text-red-400" />
                            )}
                            <div>
                                <p className="text-xl font-semibold">{scanResult.message}</p>
                                {scanResult.participant && (
                                    <p className="text-white/70">
                                        {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Manual Search */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Search className="h-5 w-5" />
                            Recherche manuelle
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Nom du participant..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                            <Button onClick={handleManualSearch} className="bg-blue-600 hover:bg-blue-700">
                                <User className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="text-center text-white/60 text-sm">
                            <p>Entrez le nom du participant et appuyez sur Entrée</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                        <CardContent className="pt-6 text-center">
                            <p className="text-3xl font-bold text-blue-400">
                                {activity.participants?.length || 0}
                            </p>
                            <p className="text-white/70">Inscrits</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                        <CardContent className="pt-6 text-center">
                            <p className="text-3xl font-bold text-green-400">
                                {activity.participants?.filter((p: any) => p.est_present).length || 0}
                            </p>
                            <p className="text-white/70">Présents</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <p className="text-center text-white/40 text-sm">
                    Church Management System • Mode Kiosk
                </p>
            </div>
        </div>
    )
}
