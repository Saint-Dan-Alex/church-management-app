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
import { PermissionGuard } from "@/components/auth/permission-guard"
import { monitorsService } from "@/lib/services/monitors.service"
import { toast } from "sonner"
import { useUser } from "@/hooks/use-user"

export default function MonitorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedMonitorForQR, setSelectedMonitorForQR] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const { user } = useUser()

  const handleExport = async () => {
    console.log("Export triggered");
    try {
      setIsExporting(true)
      console.log("Exporting started...");
      toast.info("Préparation de l'export...")

      // Récupérer tous les moniteurs (on utilise le paramètre all pour tout avoir)
      console.log("Fetching monitors...");
      const response = await monitorsService.getAll({ all: true })
      console.log("Monitors fetched:", response);
      // Gérer le format de réponse qui peut varier (direct array ou { data: ... })
      const monitors = Array.isArray(response) ? response : (response as any).data || []

      // Filtrage selon le rôle (même logique que l'affichage)
      let dataToExport = monitors
      const isManager = user?.role === 'ADMIN' || user?.role === 'COORDINATION';

      console.log("User Role:", user?.role, "Is Manager:", isManager, "User Email:", user?.email);

      if (!isManager && user?.email) {
        // Si pas admin, on n'exporte que ses propres données
        dataToExport = monitors.filter((m: any) => m.email === user.email);
        console.log("Filtered data for user:", dataToExport.length);
      } else {
        console.log("Exporting all data (Manager or no email filter)");
      }

      if (dataToExport.length === 0) {
        console.warn("No data to export");
        toast.warning("Aucune donnée à exporter (Liste vide)")
        return
      }

      // Conversion en CSV
      const headers = ["Nom", "Prénom", "Email", "Téléphone", "Salle Actuelle", "Rôle", "Date Naissance"]
      const csvContent = [
        headers.join(","),
        ...dataToExport.map((m: any) => [
          `"${m.nom || ''}"`,
          `"${m.prenom || ''}"`,
          `"${m.email || ''}"`,
          `"${m.telephone || ''}"`,
          `"${m.salle_actuelle_nom || ''}"`,
          `"${m.roleActuel || ''}"`,
          `"${m.date_naissance ? new Date(m.date_naissance).toLocaleDateString() : ''}"`
        ].join(","))
      ].join("\n")

      // Création et téléchargement du fichier
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `moniteurs_export_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Export terminé avec succès")
    } catch (error) {
      console.error("Erreur lors de l'export:", error)
      toast.error("Une erreur est survenue lors de l'export")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Moniteurs</h1>
          <p className="text-muted-foreground">Gestion des moniteurs et pointage</p>
        </div>
        <div className="flex w-full gap-2 md:w-auto">
          <Button
            variant="outline"
            className="flex-1 md:flex-none"
            onClick={() => {
              console.log("Clic bouton Exporter !");
              handleExport();
            }}
            disabled={isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Patientez...' : 'Exporter (CSV)'}
          </Button>
          <PermissionGuard permission="moniteurs.create">
            <Button onClick={() => setIsAddDialogOpen(true)} className="flex-1 md:flex-none">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un Moniteur
            </Button>
          </PermissionGuard>
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

          <MonitorList
            searchQuery={searchQuery}
            onGenerateQR={setSelectedMonitorForQR}
            refreshTrigger={refreshTrigger}
          />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceHistory />
        </TabsContent>
      </Tabs>

      <AddMonitorDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onMonitorAdded={() => setRefreshTrigger(prev => prev + 1)}
      />
      <QRCodeDialog monitorId={selectedMonitorForQR} onOpenChange={() => setSelectedMonitorForQR(null)} />
    </div>
  )
}
