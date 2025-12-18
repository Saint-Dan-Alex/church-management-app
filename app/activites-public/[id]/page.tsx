import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getSettings() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
    try {
        const res = await fetch(`${apiUrl}/public-settings`, { cache: 'no-store' })
        if (!res.ok) return {}
        return await res.json()
    } catch (error) {
        console.error("Error fetching settings:", error)
        return {}
    }
}

async function getActivity(id: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
    try {
        const res = await fetch(`${apiUrl}/public/activities/${id}`, { cache: 'no-store' })
        if (!res.ok) return null
        return await res.json()
    } catch (error) {
        console.error("Error fetching activity:", error)
        return null
    }
}

export default async function ActivityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const [settings, activity] = await Promise.all([
        getSettings(),
        getActivity(id)
    ])

    if (!activity) {
        notFound()
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            weekday: "long"
        }).format(date)
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <PublicHeader settings={settings} />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Button asChild variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800 mb-8 pl-0">
                        <Link href="/activites-public">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au calendrier
                        </Link>
                    </Button>

                    <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                        <div className="h-4 w-full bg-gradient-to-r from-amber-500 to-orange-600" />
                        <div className="p-8 md:p-12 space-y-8">
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-4">
                                    <Badge className="bg-amber-600 hover:bg-amber-700 text-white border-none text-sm px-3 py-1">
                                        {activity.type}
                                    </Badge>
                                    {activity.statut && (
                                        <Badge variant="outline" className="border-slate-600 text-slate-400">
                                            {activity.statut}
                                        </Badge>
                                    )}
                                </div>

                                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                                    {activity.nom}
                                </h1>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-amber-500/10 rounded-xl">
                                        <Calendar className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 uppercase font-bold tracking-wider mb-1">Date</p>
                                        <p className="text-white font-medium capitalize">{formatDate(activity.date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-amber-500/10 rounded-xl">
                                        <Clock className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 uppercase font-bold tracking-wider mb-1">Heure</p>
                                        <p className="text-white font-medium">{formatTime(activity.date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 md:col-span-2">
                                    <div className="p-3 bg-amber-500/10 rounded-xl">
                                        <MapPin className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 uppercase font-bold tracking-wider mb-1">Lieu</p>
                                        <p className="text-white font-medium">{activity.lieu || "À définir"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white uppercase tracking-tight">À propos de cet événement</h2>
                                <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                                    {activity.description ? (
                                        <p className="whitespace-pre-wrap">{activity.description}</p>
                                    ) : (
                                        <p className="text-slate-500 italic">Aucune description disponible.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>

            <PublicFooter settings={settings} />
        </div>
    )
}
