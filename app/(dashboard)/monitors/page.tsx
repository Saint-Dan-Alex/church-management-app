"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Download } from "lucide-react"
import { MonitorList } from "@/components/monitors/monitor-list"
import { AddMonitorDialog } from "@/components/monitors/add-monitor-dialog"
import { QRCodeDialog } from "@/components/monitors/qr-code-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendanceHistory } from "@/components/monitors/attendance-history"

export default function MonitorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedMonitorForQR, setSelectedMonitorForQR] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Moniteurs</h1>
          <p className="text-muted-foreground">Gestion des moniteurs et pointage</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un Moniteur
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste des Moniteurs</TabsTrigger>
          <TabsTrigger value="attendance">Historique de Présence</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un moniteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <MonitorList searchQuery={searchQuery} onGenerateQR={setSelectedMonitorForQR} />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceHistory />
        </TabsContent>
      </Tabs>

      <AddMonitorDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      <QRCodeDialog monitorId={selectedMonitorForQR} onOpenChange={() => setSelectedMonitorForQR(null)} />
    </div>
  )
}
