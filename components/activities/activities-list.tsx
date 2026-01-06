"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, MoreVertical, Edit, Trash, Eye, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { activitiesService, type Activity } from "@/lib/services/activities.service"
import { toast } from "sonner"
import { useUser } from "@/hooks/use-user"

const categoryColors: Record<string, string> = {
  Enfants: "bg-blue-500",
  Prière: "bg-purple-500",
  Jeunesse: "bg-green-500",
  Louange: "bg-orange-500",
  Formation: "bg-pink-500",
  Sortie: "bg-cyan-500",
}

export function ActivitiesList() {
  const router = useRouter()
  const { can, user } = useUser()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Roles qui peuvent voir toutes les activités
  const monitorRoles = ['ADMIN', 'SUPER_ADMIN', 'COORDINATION', 'CHEF_SALLE', 'MONITEUR', 'MONITOR', 'FINANCIER', 'COM_ACTIVITES']
  const isMonitor = user?.role && monitorRoles.includes(user.role.toUpperCase())

  // Roles qui peuvent voir les détails et gérer les activités
  const managementRoles = ['ADMIN', 'SUPER_ADMIN', 'COORDINATION', 'COM_ACTIVITES']
  const canManage = user?.role && managementRoles.includes(user.role.toUpperCase())

  useEffect(() => {
    loadActivities()
  }, [user, isMonitor])

  const loadActivities = async () => {
    try {
      setIsLoading(true)
      const response = await activitiesService.getAll()
      let data = Array.isArray(response) ? response : (response as any).data || []

      // Filtrage basé sur le rôle : les non-moniteurs voient seulement les activités "public"
      if (!isMonitor) {
        data = data.filter((activity: any) =>
          activity.audience === 'public' || !activity.audience
        )
      }

      setActivities(data)
    } catch (error) {
      console.error("Erreur lors du chargement des activités:", error)
      toast.error("Impossible de charger les activités")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (activityId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) return

    try {
      await activitiesService.delete(activityId)
      toast.success("Activité supprimée avec succès")
      loadActivities()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      toast.error("Impossible de supprimer l'activité")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Aucune activité trouvée</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card
          key={activity.id}
          className={`p-6 hover:shadow-lg transition-shadow ${canManage ? 'cursor-pointer' : ''}`}
          onClick={() => canManage && router.push(`/activities/${activity.id}`)}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold">{activity.title}</h3>
                    <Badge className={categoryColors[activity.category] || "bg-gray-500"}>
                      {activity.category}
                    </Badge>
                    <Badge variant="outline" className={
                      activity.type === "libre"
                        ? "bg-green-50 text-green-700 border-green-300"
                        : "bg-blue-50 text-blue-700 border-blue-300"
                    }>
                      {activity.type === "libre" ? "Libre" :
                        (activity.price ? `Payante (${activity.price} ${activity.currency || 'CDF'})` : "Payante")}
                    </Badge>
                    <Badge variant="outline" className={
                      activity.status === "planned" || activity.status === "upcoming" ? "bg-yellow-50 text-yellow-700" :
                        activity.status === "ongoing" ? "bg-blue-50 text-blue-700" :
                          activity.status === "completed" ? "bg-green-50 text-green-700" :
                            "bg-gray-50 text-gray-700"
                    }>
                      {activity.status === "planned" || activity.status === "upcoming" ? "Planifiée" :
                        activity.status === "ongoing" ? "En cours" :
                          activity.status === "completed" ? "Terminée" : activity.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                </div>
                {canManage && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/activities/${activity.id}`)
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir Détails
                      </DropdownMenuItem>

                      {can("activites.update") && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/activities/${activity.id}/edit`)
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                        </>
                      )}
                      {can("activites.delete") && (
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => handleDelete(activity.id, e)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(activity.date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {activity.end_date && activity.end_date !== activity.date && (
                      <> - {new Date(activity.end_date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}</>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {activity.time} ({activity.duration})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{activity.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {activity.participants}/{activity.maxParticipants} participants
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Organisateur: {activity.organizer}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(Number(activity.participants) / Number(activity.maxParticipants)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
