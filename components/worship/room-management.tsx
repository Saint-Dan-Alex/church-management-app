"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MapPin, Plus, Edit } from "lucide-react"

const rooms = [
  {
    id: "1",
    name: "Salle Principale",
    capacity: 300,
    currentOccupancy: 245,
    status: "active",
    monitors: ["Marie Dupont", "Jean Martin"],
    equipment: ["Sonorisation", "Projecteur", "Climatisation"],
  },
  {
    id: "2",
    name: "Salle Enfants",
    capacity: 80,
    currentOccupancy: 56,
    status: "active",
    monitors: ["Sophie Bernard"],
    equipment: ["Jouets", "Tableau", "Climatisation"],
  },
  {
    id: "3",
    name: "Salle Jeunesse",
    capacity: 100,
    currentOccupancy: 67,
    status: "active",
    monitors: ["Pierre Dubois"],
    equipment: ["Sonorisation", "Écran TV", "Instruments"],
  },
  {
    id: "4",
    name: "Salle de Réunion",
    capacity: 30,
    currentOccupancy: 0,
    status: "available",
    monitors: [],
    equipment: ["Table", "Chaises", "Tableau blanc"],
  },
]

export function RoomManagement() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une Salle
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {room.name}
                  </CardTitle>
                  <CardDescription className="mt-1">Capacité: {room.capacity} personnes</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Occupation actuelle</span>
                  <Badge variant={room.status === "active" ? "default" : "secondary"}>
                    {room.status === "active" ? "En cours" : "Disponible"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(room.currentOccupancy / room.capacity) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {room.currentOccupancy}/{room.capacity}
                  </span>
                </div>
              </div>

              {room.monitors.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Moniteurs assignés</p>
                  <div className="flex flex-wrap gap-2">
                    {room.monitors.map((monitor) => (
                      <Badge key={monitor} variant="outline" className="text-xs">
                        <Users className="mr-1 h-3 w-3" />
                        {monitor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Équipements</p>
                <div className="flex flex-wrap gap-2">
                  {room.equipment.map((item) => (
                    <Badge key={item} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
