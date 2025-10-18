"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, MoreVertical, Edit, Trash, UserPlus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const activities = [
  {
    id: "1",
    title: "École du Dimanche",
    description: "Enseignement biblique pour les enfants",
    date: "2024-10-20",
    time: "09:00",
    duration: "1h",
    location: "Salle Enfants",
    category: "Enfants",
    participants: 56,
    maxParticipants: 80,
    status: "upcoming",
    organizer: "Sophie Bernard",
  },
  {
    id: "2",
    title: "Réunion de Prière",
    description: "Temps de prière collective",
    date: "2024-10-18",
    time: "19:00",
    duration: "1h30",
    location: "Salle Principale",
    category: "Prière",
    participants: 45,
    maxParticipants: 100,
    status: "upcoming",
    organizer: "Jean Martin",
  },
  {
    id: "3",
    title: "Groupe de Jeunesse",
    description: "Rencontre et partage pour les jeunes",
    date: "2024-10-19",
    time: "18:30",
    duration: "2h",
    location: "Salle Jeunesse",
    category: "Jeunesse",
    participants: 34,
    maxParticipants: 50,
    status: "upcoming",
    organizer: "Pierre Dubois",
  },
  {
    id: "4",
    title: "Atelier Louange",
    description: "Pratique et apprentissage de chants",
    date: "2024-10-21",
    time: "17:00",
    duration: "2h",
    location: "Salle Principale",
    category: "Louange",
    participants: 22,
    maxParticipants: 30,
    status: "upcoming",
    organizer: "Marie Dupont",
  },
]

const categoryColors: Record<string, string> = {
  Enfants: "bg-blue-500",
  Prière: "bg-purple-500",
  Jeunesse: "bg-green-500",
  Louange: "bg-orange-500",
}

export function ActivitiesList() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{activity.title}</h3>
                    <Badge className={categoryColors[activity.category]}>{activity.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Gérer Participants
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
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
    </div>
  )
}
