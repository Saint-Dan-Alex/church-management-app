"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, CalendarIcon, List } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivitiesList } from "@/components/activities/activities-list"
import { CalendarView } from "@/components/activities/calendar-view"
import { AddActivityDialog } from "@/components/activities/add-activity-dialog"
import { PermissionGuard } from "@/components/auth/permission-guard"

export default function ActivitiesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleActivityAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activités</h1>
          <p className="text-muted-foreground">Gestion des activités et calendrier</p>
        </div>
        <PermissionGuard permission="activites.create">
          <Button onClick={() => setIsAddDialogOpen(true)} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Activité
          </Button>
        </PermissionGuard>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendrier
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            Liste
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <CalendarView key={refreshKey} />
        </TabsContent>

        <TabsContent value="list">
          <ActivitiesList key={refreshKey} />
        </TabsContent>
      </Tabs>

      <AddActivityDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleActivityAdded}
      />
    </div>
  )
}
