"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const events = [
  { id: "1", title: "École du Dimanche", date: "2024-10-20", category: "Enfants", color: "bg-blue-500" },
  { id: "2", title: "Réunion de Prière", date: "2024-10-18", category: "Prière", color: "bg-purple-500" },
  { id: "3", title: "Groupe de Jeunesse", date: "2024-10-19", category: "Jeunesse", color: "bg-green-500" },
  { id: "4", title: "Atelier Louange", date: "2024-10-21", category: "Louange", color: "bg-orange-500" },
  { id: "5", title: "Culte Dominical", date: "2024-10-20", category: "Culte", color: "bg-primary" },
  { id: "6", title: "Réunion Moniteurs", date: "2024-10-23", category: "Réunion", color: "bg-accent" },
]

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 1))

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((event) => event.date === dateStr)
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: adjustedFirstDay }, (_, i) => i)

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

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
            const dayEvents = getEventsForDay(day)
            const isToday =
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()

            return (
              <div
                key={day}
                className={`aspect-square border rounded-lg p-2 ${isToday ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <div className="text-sm font-medium mb-1">{day}</div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div key={event.id} className={`text-xs p-1 rounded ${event.color} text-white truncate`}>
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} plus</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Badge className="bg-blue-500">Enfants</Badge>
          <Badge className="bg-purple-500">Prière</Badge>
          <Badge className="bg-green-500">Jeunesse</Badge>
          <Badge className="bg-orange-500">Louange</Badge>
          <Badge className="bg-primary">Culte</Badge>
          <Badge className="bg-accent text-accent-foreground">Réunion</Badge>
        </div>
      </div>
    </Card>
  )
}
