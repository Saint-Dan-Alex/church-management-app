import { UserPlus, UserCheck, FileText, Calendar, DollarSign, Baby } from "lucide-react"

interface ActivityItem {
  id: string | number
  type: string
  user: string
  action: string
  time: string
}

interface RecentActivityProps {
  data?: ActivityItem[]
}

const getIcon = (type: string) => {
  switch (type) {
    case 'child': return Baby; // Ou UserPlus
    case 'monitor': return UserCheck;
    case 'report': return FileText;
    case 'activity': return Calendar;
    case 'payment': return DollarSign;
    default: return FileText;
  }
}

const getColor = (type: string) => {
  switch (type) {
    case 'child': return "bg-green-100 text-green-600";
    case 'payment': return "bg-emerald-100 text-emerald-600";
    case 'activity': return "bg-purple-100 text-purple-600";
    default: return "bg-blue-100 text-blue-600";
  }
}

export function RecentActivity({ data = [] }: RecentActivityProps) {
  if (!data || data.length === 0) {
    return <div className="text-sm text-gray-500 py-4">Aucune activité récente.</div>
  }

  return (
    <div className="space-y-4">
      {data.map((activity) => {
        const Icon = getIcon(activity.type)
        const colorClass = getColor(activity.type)

        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${colorClass}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
