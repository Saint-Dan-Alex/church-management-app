import { Calendar, Clock, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface EventItem {
  id: string | number
  title: string
  date: string
  time: string
  location: string
  type: string
}

interface UpcomingEventsProps {
  data?: EventItem[]
}

export function UpcomingEvents({ data = [] }: UpcomingEventsProps) {
  if (!data || data.length === 0) {
    return <div className="text-sm text-gray-500 py-4">Aucun événement à venir.</div>
  }

  // Formatage de la date
  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' }).format(date);
    } catch (e) {
      return dateStr;
    }
  }

  // Formatage de l'heure
  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    return timeStr.substring(0, 5); // HH:mm
  }

  return (
    <div className="space-y-4">
      {data.map((event) => (
        <div key={event.id} className="space-y-2 rounded-lg border border-blue-200 p-3 bg-blue-50">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm text-blue-900">{event.title}</h4>
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 capitalize">
              {event.type}
            </Badge>
          </div>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span className="capitalize">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>{formatTime(event.time)}</span>
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
