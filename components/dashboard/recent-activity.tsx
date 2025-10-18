import { UserPlus, UserCheck, FileText, Calendar } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "monitor",
    user: "Marie Dupont",
    action: "a pointé pour le culte du dimanche",
    time: "Il y a 2 heures",
    icon: UserCheck,
  },
  {
    id: 2,
    type: "child",
    user: "Admin",
    action: "a ajouté 3 nouveaux enfants",
    time: "Il y a 5 heures",
    icon: UserPlus,
  },
  {
    id: 3,
    type: "report",
    user: "Jean Martin",
    action: "a généré un rapport de culte",
    time: "Hier",
    icon: FileText,
  },
  {
    id: 4,
    type: "activity",
    user: "Sophie Bernard",
    action: "a créé une nouvelle activité",
    time: "Hier",
    icon: Calendar,
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
            <activity.icon className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
