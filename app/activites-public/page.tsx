import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"

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

async function getAllActivities() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
    try {
        const res = await fetch(`${apiUrl}/public/activities?per_page=100`, { cache: 'no-store' })
        if (!res.ok) return []
        return await res.json()
    } catch (error) {
        console.error("Error fetching activities:", error)
        return []
    }
}

export default async function ActivitiesPage() {
    const [settings, activities] = await Promise.all([
        getSettings(),
        getAllActivities()
    ])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
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
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-12 text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">Calendrier des Activités</h1>
                        <div className="h-1 w-24 bg-amber-500 rounded-full mx-auto"></div>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Retrouvez tous nos événements, cultes spéciaux et programmes à venir.
                        </p>
                    </div>

                    {activities.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activities.map((activity: any) => (
                                <Card key={activity.id} className="bg-slate-900 border-slate-800 overflow-hidden group hover:bg-slate-800/80 transition-all duration-300 hover:border-amber-600/30">
                                    <div className="h-2 w-full bg-gradient-to-r from-amber-500 to-orange-600" />

                                    <CardHeader className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className="border-slate-700 text-slate-300 uppercase tracking-wider text-xs px-2 py-0.5">
                                                {activity.type}
                                            </Badge>
                                            <div className="text-center bg-slate-800 rounded p-2 min-w-[3.5rem] border border-slate-700">
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
                                        <Button asChild className="w-full bg-slate-800 hover:bg-amber-600 text-white transition-colors group-hover:translate-x-1 duration-300 transform border border-slate-700 group-hover:border-amber-600">
                                            <Link href={`/activites-public/${activity.id}`} className="flex items-center justify-center gap-2">
                                                Détails <ArrowRight className="h-4 w-4 ml-1" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                            <Calendar className="h-16 w-16 text-slate-700 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-white mb-2">Aucune activité programmée</h3>
                            <p className="text-slate-500">Revenez plus tard pour découvrir nos prochains événements.</p>
                        </div>
                    )}
                </div>
            </main>

            <PublicFooter settings={settings} />
        </div>
    )
}
