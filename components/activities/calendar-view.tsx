"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { activitiesService, type Activity } from "@/lib/services/activities.service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { DayActivitiesDialog } from "./day-activities-dialog"
import { useUser } from "@/hooks/use-user"

export function CalendarView() {
  const router = useRouter()
  const { user } = useUser()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activities, setActivities] = useState<Activity[]>([])
  const [categories, setCategories] = useState<Array<{ id: number, name: string, color: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedDayActivities, setSelectedDayActivities] = useState<Activity[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Roles qui peuvent voir toutes les activités (y compris celles réservées aux moniteurs)
  const monitorRoles = ['ADMIN', 'SUPER_ADMIN', 'COORDINATION', 'CHEF_SALLE', 'MONITEUR', 'MONITOR', 'FINANCIER', 'COM_ACTIVITES']
  const isMonitor = user?.role && monitorRoles.includes(user.role.toUpperCase())

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadActivities()
  }, [currentDate, isMonitor])

  const loadCategories = async () => {
    try {
      const data = await activitiesService.getCategories()
      setCategories(data as any)
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error)
    }
  }

  const loadActivities = async () => {
    try {
      setIsLoading(true)

      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()

      // Premier jour du mois (Local)
      const firstDayDate = new Date(year, month, 1)
      const date_debut = `${firstDayDate.getFullYear()}-${String(firstDayDate.getMonth() + 1).padStart(2, '0')}-${String(firstDayDate.getDate()).padStart(2, '0')}`

      // Dernier jour du mois (Local)
      const lastDayDate = new Date(year, month + 1, 0)
      const date_fin = `${lastDayDate.getFullYear()}-${String(lastDayDate.getMonth() + 1).padStart(2, '0')}-${String(lastDayDate.getDate()).padStart(2, '0')}`

      const response = await activitiesService.getAll({
        date_debut,
        date_fin,
        per_page: 100 // On augmente la limite pour être sûr d'avoir tout le mois
      })

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

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getActivitiesForDay = (day: number) => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return activities.filter((activity) => {
      // Pour comparer correctement les dates sous forme de chaîne "YYYY-MM-DD"
      // On prend les 10 premiers caractères pour ignorer l'heure si présent (ex: ISO string)
      const activityStart = activity.date.substring(0, 10);
      const activityEnd = activity.end_date ? activity.end_date.substring(0, 10) : activityStart;

      return dateStr >= activityStart && dateStr <= activityEnd;
    })
  }

  // Create a mapping of category names to colors
  const categoryColorsMap = categories.reduce((acc, cat) => {
    acc[cat.name] = cat.color
    return acc
  }, {} as Record<string, string>)

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: adjustedFirstDay }, (_, i) => i)

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold capitalize">
            {currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </h2>
          <div className="flex gap-2 justify-center sm:justify-end">
            <Button variant="outline" onClick={goToToday} size="sm">
              Aujourd'hui
            </Button>
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-2">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-muted-foreground p-2">
                  {day}
                </div>
              ))}

              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {days.map((day) => {
                const dayActivities = getActivitiesForDay(day)
                const isToday =
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear()

                return (
                  <div
                    key={day}
                    className={`aspect-square border rounded-lg p-2 hover:bg-accent/50 transition-colors cursor-pointer ${isToday ? "border-primary bg-primary/5 ring-2 ring-primary" : "border-border"
                      }`}
                    onClick={() => {
                      const clickedDate = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                      )
                      setSelectedDate(clickedDate)
                      setSelectedDayActivities(dayActivities)
                      setIsDialogOpen(true)
                    }}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary font-bold" : ""}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayActivities.slice(0, 2).map((activity) => (
                        <div
                          key={activity.id}
                          className="text-xs p-1 rounded text-white truncate"
                          style={{ backgroundColor: categoryColorsMap[activity.category] || '#6B7280' }}
                          title={activity.title}
                        >
                          {activity.title}
                        </div>
                      ))}
                      {dayActivities.length > 2 && (
                        <div className="text-xs text-muted-foreground font-medium">
                          +{dayActivities.length - 2} plus
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <div className="text-sm font-semibold text-muted-foreground mr-2">Catégories:</div>
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  style={{ backgroundColor: category.color, color: 'white' }}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </>
        )}
      </div>

      <DayActivitiesDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        date={selectedDate}
        activities={selectedDayActivities}
        categoryColors={categoryColorsMap}
      />
    </Card>
  )
}
