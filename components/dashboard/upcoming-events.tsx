import { Calendar, Clock, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const events = [
  {
    id: 1,
    title: "Culte Dominical",
    date: "Dimanche 20 Oct",
    time: "10:00",
    location: "Salle Principale",
    type: "culte",
  },
  {
    id: 2,
    title: "École du Dimanche",
    date: "Dimanche 20 Oct",
    time: "09:00",
    location: "Salle Enfants",
    type: "activité",
  },
  {
    id: 3,
    title: "Réunion Moniteurs",
    date: "Mercredi 23 Oct",
    time: "19:00",
    location: "Salle de Réunion",
    type: "réunion",
  },
  {
    id: 4,
    title: "Culte de Jeunesse",
    date: "Vendredi 25 Oct",
    time: "18:30",
    location: "Salle Jeunesse",
    type: "culte",
  },
]

export function UpcomingEvents() {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="space-y-2 rounded-lg border border-blue-200 p-3 bg-blue-50">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm text-blue-900">{event.title}</h4>
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
              {event.type}
            </Badge>
          </div>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
