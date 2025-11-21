"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, MoreVertical, Edit, Trash, UserPlus, QrCode, Eye, DollarSign } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { EditActivityDialog } from "./edit-activity-dialog"
import { activitiesService, type Activity } from "@/lib/services/activities.service"
import { toast } from "sonner"

interface ActivitiesListProps {
  searchQuery?: string
  type?: string
  status?: string
  Enfants: "bg-blue-500",
  Prière: "bg-purple-500",
  Jeunesse: "bg-green-500",
  Louange: "bg-orange-500",
}

export function ActivitiesList() {
  const router = useRouter()
  const [editingActivity, setEditingActivity] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEdit = (activity: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingActivity(activity)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (activityId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      console.log("Suppression de l'activité:", activityId)
      // TODO: Implémenter la suppression
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card 
          key={activity.id} 
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push(`/activities/${activity.id}`)}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold">{activity.title}</h3>
                    <Badge className={categoryColors[activity.category]}>{activity.category}</Badge>
                    {activity.type === "gratuite" ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                        🎉 Gratuite
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                        💰 {activity.montantRequis?.toLocaleString("fr-FR")} {activity.devise}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                </div>
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
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/activities/${activity.id}?tab=presence`)
                    }}>
                      <QrCode className="mr-2 h-4 w-4" />
                      Gérer Présence
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/activities/${activity.id}?tab=participants`)
                    }}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Gérer Participants
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/activities/${activity.id}?tab=paiements`)
                    }}>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Gérer Paiements
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => handleEdit(activity, e)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={(e) => handleDelete(activity.id, e)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(activity.date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
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
                <div className="text-sm text-muted-foreground">Organisateur: {activity.organizer}</div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(activity.participants / activity.maxParticipants) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {editingActivity && (
        <EditActivityDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          activity={{
            id: editingActivity.id,
            titre: editingActivity.title,
            description: editingActivity.description,
            date: new Date(editingActivity.date),
            heureDebut: editingActivity.time,
            heureFin: "",
            lieu: editingActivity.location,
            type: editingActivity.category.toLowerCase(),
            statut: editingActivity.status,
            responsable: editingActivity.organizer,
          }}
        />
      )}
    </div>
  )
}
