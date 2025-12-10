"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Activity {
    id: string
    nom: string
    date: string
    lieu: string
    type: string
    description?: string
    statut: string
}

interface ActivitiesSectionProps {
    activities: Activity[]
}

export function ActivitiesSection({ activities = [] }: ActivitiesSectionProps) {
    // Fonction pour formater la date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date)
    }

    // Fonction pour formater l'heure
    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    return (
        <section id="activites" className="py-24 px-4 bg-slate-900 border-t border-slate-800">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">Nos Activités</h2>
                        <div className="h-1 w-20 bg-amber-500 rounded-full"></div>
                        <p className="text-slate-400 max-w-xl">
                            Rejoignez-nous pour nos prochains événements et célébrations. Il y a toujours quelque chose de spécial qui se passe à l'Arche.
                        </p>
                    </div>
                    <Button asChild variant="outline" className="text-amber-500 border-amber-600 hover:bg-amber-600/10 hidden md:flex">
                        <Link href="/activites-public">Voir tout le calendrier</Link>
                    </Button>
                </div>

                {activities.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activities.map((activity) => (
                            <Card key={activity.id} className="bg-slate-800 border-none overflow-hidden group hover:bg-slate-800/80 transition-all duration-300">
                                {/* Bande de couleur selon le type (optionnel, pour l'instant amber par défaut) */}
                                <div className="h-2 w-full bg-gradient-to-r from-amber-500 to-orange-600" />

                                <CardHeader className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="border-slate-600 text-slate-300 uppercase tracking-wider text-xs px-2 py-0.5">
                                            {activity.type}
                                        </Badge>
                                        {/* Afficher jour en gros encadré */}
                                        <div className="text-center bg-slate-900/50 rounded p-2 min-w-[3.5rem] border border-slate-700/50">
                                            <span className="block text-2xl font-bold text-white leading-none">
                                                {new Date(activity.date).getDate()}
                                            </span>
                                            <span className="block text-[10px] text-slate-400 uppercase font-bold">
                                                {new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(new Date(activity.date))}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                                        {activity.nom}
                                    </h3>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="space-y-2 text-sm text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-amber-500" />
                                            <span>{formatDate(activity.date)} à {formatTime(activity.date)}</span>
                                        </div>
                                        {activity.lieu && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-amber-500" />
                                                <span className="truncate">{activity.lieu}</span>
                                            </div>
                                        )}
                                    </div>

                                    {activity.description && (
                                        <p className="text-slate-500 text-sm line-clamp-3">
                                            {activity.description}
                                        </p>
                                    )}
                                </CardContent>

                                <CardFooter>
                                    <Button asChild className="w-full bg-slate-700 hover:bg-amber-600 text-white transition-colors group-hover:translate-x-1 duration-300 transform">
                                        <Link href={`/activites-public/${activity.id}`} className="flex items-center justify-center gap-2">
                                            Détails <ArrowRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-800 border-dashed">
                        <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">Aucune activité programmée pour le moment.</p>
                    </div>
                )}

                <div className="mt-8 text-center md:hidden">
                    <Button asChild variant="outline" className="text-amber-500 border-amber-600 hover:bg-amber-600/10 w-full">
                        <Link href="/activites-public">Voir tout le calendrier</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
