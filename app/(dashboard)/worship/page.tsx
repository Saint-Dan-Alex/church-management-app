"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorshipList } from "@/components/worship/worship-list"
import { RoomManagement } from "@/components/worship/room-management"
import { AddWorshipDialog } from "@/components/worship/add-worship-dialog"

export default function WorshipPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cultes</h1>
          <p className="text-muted-foreground">Gestion des cultes et salles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter Rapports
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Culte
          </Button>
        </div>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Cultes</TabsTrigger>
          <TabsTrigger value="rooms">Salles</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <WorshipList />
        </TabsContent>

        <TabsContent value="rooms">
          <RoomManagement />
        </TabsContent>
      </Tabs>

      <AddWorshipDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}
