"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, FileText, MoreVertical, Edit, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const worshipServices = [
  {
    id: "1",
    title: "Culte Dominical",
    date: "2024-10-20",
    time: "10:00",
    duration: "2h",
    rooms: ["Salle Principale", "Salle Enfants", "Salle Jeunesse"],
    attendance: 245,
    status: "upcoming",
    theme: "La Foi qui Déplace les Montagnes",
  },
  {
    id: "2",
    title: "Culte du Mercredi",
    date: "2024-10-16",
    time: "19:00",
    duration: "1h30",
    rooms: ["Salle Principale"],
    attendance: 128,
    status: "completed",
    theme: "La Prière Efficace",
  },
  {
    id: "3",
    title: "Culte Dominical",
    date: "2024-10-13",
    time: "10:00",
    duration: "2h",
    rooms: ["Salle Principale", "Salle Enfants", "Salle Jeunesse"],
    attendance: 267,
    status: "completed",
    theme: "L'Amour de Dieu",
  },
]

export function WorshipList() {
  return (
    <div className="space-y-4">
      {worshipServices.map((service) => (
        <Card key={service.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    <Badge variant={service.status === "upcoming" ? "default" : "secondary"}>
                      {service.status === "upcoming" ? "À venir" : "Terminé"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{service.theme}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      Générer Rapport
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
                    {new Date(service.date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {service.time} ({service.duration})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{service.attendance} participants</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {service.rooms.map((room) => (
                  <Badge key={room} variant="outline" className="text-xs">
                    {room}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {service.status === "completed" && (
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Voir le Rapport
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
