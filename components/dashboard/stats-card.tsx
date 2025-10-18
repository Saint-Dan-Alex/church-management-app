import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  color?: "blue" | "yellow" | "red" | "green" | "purple" | "sky" | "orange"
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend = "neutral",
  color = "blue",
}: StatsCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      border: "border-blue-200",
    },
    sky: {
      bg: "bg-sky-50",
      icon: "text-sky-600",
      border: "border-blue-200",
    },
    yellow: {
      bg: "bg-yellow-50",
      icon: "text-yellow-600",
      border: "border-yellow-200",
    },
    green: {
      bg: "bg-green-100",
      icon: "text-green-600",
      border: "border-green-200",
    },
    red: {
      bg: "bg-red-50",
      icon: "text-red-600",
      border: "border-red-200",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      border: "border-orange-200",
    },
    purple: {
      bg: "bg-purple-100",
      icon: "text-purple-600",
      border: "border-purple-200",
    },
  }

  const colors = colorClasses[color]

  return (
    <Card className="dashboard-card border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg}`}>
            <Icon className={`h-7 w-7 ${colors.icon}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
