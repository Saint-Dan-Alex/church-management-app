"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const attendanceData = [
  {
    id: "1",
    monitorName: "Marie Dupont",
    date: "2024-10-13",
    time: "09:45",
    event: "Culte Dominical",
    status: "present",
  },
  {
    id: "2",
    monitorName: "Jean Martin",
    date: "2024-10-13",
    time: "09:50",
    event: "Culte Dominical",
    status: "present",
  },
  {
    id: "3",
    monitorName: "Sophie Bernard",
    date: "2024-10-13",
    time: "09:42",
    event: "Culte Dominical",
    status: "present",
  },
  {
    id: "4",
    monitorName: "Marie Dupont",
    date: "2024-10-06",
    time: "09:48",
    event: "Culte Dominical",
    status: "present",
  },
  {
    id: "5",
    monitorName: "Jean Martin",
    date: "2024-10-06",
    time: "09:55",
    event: "Culte Dominical",
    status: "present",
  },
  {
    id: "6",
    monitorName: "Sophie Bernard",
    date: "2024-10-06",
    time: "09:40",
    event: "Culte Dominical",
    status: "present",
  },
]

export function AttendanceHistory() {
  const [filterPeriod, setFilterPeriod] = useState("all")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Historique des Pointages</h3>
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tout l'historique</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {attendanceData.map((record) => (
          <Card key={record.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{record.monitorName}</h4>
                  <p className="text-sm text-muted-foreground">{record.event}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(record.date).toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{record.time}</span>
                </div>
                <Badge variant="default" className="bg-green-600">
                  Présent
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
