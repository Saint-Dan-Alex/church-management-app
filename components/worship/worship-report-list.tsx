"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash, Eye, Calendar, Users, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { WorshipReport } from "@/types/worship-report"
import { worshipReportsService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { useUser } from "@/hooks/use-user"

interface WorshipReportListProps {
  searchQuery: string
}

export function WorshipReportList({ searchQuery }: WorshipReportListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { can } = useUser()
  const [reports, setReports] = useState<WorshipReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await worshipReportsService.getAll()
      // L'API retourne une réponse paginée avec { data: [], current_page, total, etc. }
      const reportsData = Array.isArray(response) ? response : (response as any).data || []
      setReports(reportsData)
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur de chargement des rapports de culte'
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (reportId: string, salle: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le rapport de ${salle} ?`)) {
      try {
        await worshipReportsService.delete(reportId)
        toast({
          title: "Rapport supprimé",
          description: "Le rapport de culte a été supprimé avec succès.",
        })
        loadReports()
      } catch (err: any) {
        toast({
          title: "Erreur",
          description: err.message || "Impossible de supprimer le rapport",
          variant: "destructive"
        })
      }
    }
  }

  const filteredReports = reports.filter(
    (report) =>
      !searchQuery || // Si pas de recherche, afficher tout
      report.salle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(report.date).toLocaleDateString("fr-FR").includes(searchQuery)
  )

  const getSalleBadgeColor = (salle: string) => {
    const colors: { [key: string]: string } = {
      Jardin: "bg-green-100 text-green-800 border-green-300",
      Ainés: "bg-blue-100 text-blue-800 border-blue-300",
      Juniors: "bg-purple-100 text-purple-800 border-purple-300",
      Cadets: "bg-orange-100 text-orange-800 border-orange-300",
      Adolescents: "bg-red-100 text-red-800 border-red-300",
    }
    return colors[salle] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const parseJsonArray = (jsonString: string | string[] | null | undefined): string[] => {
    if (!jsonString) return []
    if (Array.isArray(jsonString)) return jsonString
    try {
      const parsed = JSON.parse(jsonString)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Chargement des rapports...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadReports} variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  if (filteredReports.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun rapport de culte trouvé</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredReports.map((report) => (
        <Card
          key={report.id}
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(`/worship/${report.id}`)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{formatDate(report.date)}</span>
              </div>

              <Badge variant="outline" className={`${getSalleBadgeColor(report.salle)} mb-3`}>
                {report.salle}
              </Badge>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-3 w-3 text-gray-500" />
                  <span className="font-semibold text-gray-900">{report.effectif_total}</span>
                  <span className="text-gray-600">participants</span>
                </div>

                <div className="text-sm text-gray-600">
                  <span className="text-blue-600 font-medium">{report.effectif_freres}</span> Frères •{" "}
                  <span className="text-pink-600 font-medium">{report.effectif_soeurs}</span> Sœurs
                </div>

                {report.nombre_nouveaux_venus > 0 && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    ✨ {report.nombre_nouveaux_venus} nouveau{report.nombre_nouveaux_venus > 1 ? "x" : ""}
                  </Badge>
                )}
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-gray-600">
                  <div>
                    <strong>Prédicateur:</strong> {report.predicateur}
                  </div>
                  {(() => {
                    const moderateurs = parseJsonArray(report.moderateurs)
                    const assistants = parseJsonArray(report.assistants)
                    const allPersonnel = [...moderateurs, ...assistants]
                    return allPersonnel.length > 0 && (
                      <div className="mt-1">
                        <strong>Personnel:</strong> {allPersonnel.slice(0, 2).join(", ")}
                        {allPersonnel.length > 2 && ` +${allPersonnel.length - 2}`}
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/worship/${report.id}`)
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Voir détails
                </DropdownMenuItem>
                {can("presences.update") && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      // TODO: Ouvrir le dialog d'édition
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                )}
                {can("presences.delete") && (
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(report.id, report.salle)
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}
    </div>
  )
}
