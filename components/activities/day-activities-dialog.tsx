"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Activity } from "@/lib/services/activities.service"

interface DayActivitiesDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    date: Date | null
    activities: Activity[]
    categoryColors: Record<string, string>
}

export function DayActivitiesDialog({
    open,
    onOpenChange,
    date,
    activities,
    categoryColors,
}: DayActivitiesDialogProps) {
    const router = useRouter()

    if (!date) return null

    const formattedDate = date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 capitalize">
                        <Calendar className="h-5 w-5" />
                        {formattedDate}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {activities.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Aucune activité prévue
                            </h3>
                            <p className="text-sm text-gray-500">
                                Il n'y a pas d'activité planifiée pour cette date.
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-muted-foreground">
                                {activities.length} activité{activities.length > 1 ? "s" : ""} prévue{activities.length > 1 ? "s" : ""}
                            </p>

                            <div className="space-y-3">
                                {activities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                                    <h4 className="font-semibold text-lg">{activity.title}</h4>
                                                    <Badge
                                                        style={{
                                                            backgroundColor: categoryColors[activity.category] || "#6B7280",
                                                            color: "white",
                                                        }}
                                                    >
                                                        {activity.category}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            activity.type === "libre"
                                                                ? "bg-green-50 text-green-700 border-green-300"
                                                                : "bg-blue-50 text-blue-700 border-blue-300"
                                                        }
                                                    >
                                                        {activity.type === "libre" ? "Libre" :
                                                            (activity.price ? `Payante (${activity.price} ${activity.currency || 'CDF'})` : "Payante")}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-3">{activity.description}</p>

                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        <span>
                                                            {activity.time} ({activity.duration})
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{activity.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-4 w-4" />
                                                        <span>
                                                            {activity.participants}/{activity.maxParticipants} participants
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t">
                                            <span className="text-sm text-gray-500">
                                                Organisateur: {activity.organizer}
                                            </span>
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    router.push(`/activities/${activity.id}`)
                                                    onOpenChange(false)
                                                }}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                Voir détails
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
