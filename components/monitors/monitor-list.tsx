"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QrCode, Mail, Phone, MoreVertical, Edit, Trash, Eye, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditMonitorDialog } from "@/components/monitors/edit-monitor-dialog"
import { monitorsService } from "@/lib/services/monitors.service"
import type { Monitor } from "@/types/monitor"
import { toast } from "sonner"

interface MonitorListProps {
  searchQuery: string
  onGenerateQR: (monitorId: string) => void
  refreshTrigger?: number
}

export function MonitorList({ searchQuery, onGenerateQR, refreshTrigger = 0 }: MonitorListProps) {
  const router = useRouter()
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingMonitor, setEditingMonitor] = useState<Monitor | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // État pour la pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 25, // Augmenté de 15 à 25 moniteurs par page
    total: 0,
    totalPages: 1
  })

  const fetchMonitors = async (page: number = 1) => {
    try {
      console.log(`Chargement de la page ${page}...`)
      setLoading(true)
      const response = await monitorsService.getAll({
        page,
        per_page: pagination.perPage
      })

      console.log('Réponse du service:', response)

      // La réponse de Laravel contient directement les données et les métadonnées de pagination
      // Vérifions la structure de la réponse
      if (response.data && Array.isArray(response.data)) {
        // Si la réponse contient un tableau data et des métadonnées
        setMonitors(response.data)

        setPagination(prev => ({
          ...prev,
          currentPage: response.current_page || page,
          total: response.total || 0,
          totalPages: response.last_page || 1
        }))
      } else if (Array.isArray(response)) {
        // Si la réponse est directement un tableau (sans pagination)
        setMonitors(response)
        setPagination(prev => ({
          ...prev,
          currentPage: 1,
          total: response.length,
          totalPages: 1
        }))
      }
    } catch (err) {
      console.error("Erreur lors du chargement des moniteurs:", err)
      setError("Impossible de charger les moniteurs. Veuillez réessayer plus tard.")
      toast.error("Erreur lors du chargement des moniteurs")
    } finally {
      setLoading(false)
    }
  }

  // Chargement initial et au refresh
  useEffect(() => {
    fetchMonitors(1)
  }, [refreshTrigger])

  const handleEdit = (monitor: Monitor) => {
    setEditingMonitor(monitor)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (monitorId: string, monitorName: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${monitorName} ?`)) {
      try {
        await monitorsService.delete(monitorId)
        setMonitors(monitors.filter(monitor => monitor.id !== monitorId))
        toast.success("Moniteur supprimé avec succès")
      } catch (err) {
        console.error("Erreur lors de la suppression du moniteur:", err)
        toast.error("Erreur lors de la suppression du moniteur")
      }
    }
  }
  const filteredMonitors = Array.isArray(monitors) ? monitors.filter(
    (monitor) =>
      monitor.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      monitor.prenom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      monitor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      monitor.salle_actuelle_nom?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des moniteurs...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    )
  }

  // Gestion du changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchMonitors(newPage)
    }
  }

  if (filteredMonitors.length === 0 && !loading) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Aucun moniteur trouvé</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Affichage de {monitors.length} sur {pagination.total} moniteurs (Page {pagination.currentPage}/{pagination.totalPages})
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMonitors.map((monitor) => (
          <Card
            key={monitor.id}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/monitors/${monitor.id}`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={monitor.photo || undefined} alt={`${monitor.prenom} ${monitor.nom}`} />
                  <AvatarFallback>
                    {monitor.prenom?.[0]}{monitor.nom?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{monitor.prenom} {monitor.nom}</h3>
                    <Badge
                      variant={monitor.etat_civil === 'Marié(e)' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {monitor.etat_civil || 'Non spécifié'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{monitor.role_actuel} • {monitor.salle_actuelle_nom}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Mail className="mr-1 h-3 w-3" />
                      {monitor.email || 'Non spécifié'}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Phone className="mr-1 h-3 w-3" />
                      {monitor.telephone || 'Non spécifié'}
                    </span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/monitors/${monitor.id}`)
                  }}>
                    <Eye className="mr-2 h-4 w-4" />
                    Voir détails
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(monitor)
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation()
                    onGenerateQR(monitor.id)
                  }}>
                    <QrCode className="mr-2 h-4 w-4" />
                    Générer QR Code
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(monitor.id, monitor.name)
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span className="truncate">{monitor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{monitor.phone}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <div>
                <p className="text-xs text-muted-foreground">Département</p>
                <p className="text-sm font-medium">{monitor.department}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Dernier pointage</p>
                <p className="text-sm font-medium">{monitor.lastAttendance}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <EditMonitorDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        monitor={editingMonitor}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Précédent
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                // Afficher les numéros de page autour de la page courante
                let pageNum = i + 1;
                if (pagination.currentPage > 3) {
                  pageNum = pagination.currentPage - 2 + i;
                  if (pageNum > pagination.totalPages) return null;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded ${pagination.currentPage === pageNum
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                <span className="px-2">...</span>
              )}

              {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  className="w-8 h-8 rounded hover:bg-gray-100"
                >
                  {pagination.totalPages}
                </button>
              )}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Suivant
            </button>

            <span className="ml-4 text-sm text-muted-foreground">
              {monitors.length} sur {pagination.total} moniteurs
            </span>
          </nav>
        </div>
      )}
    </>
  )
}
