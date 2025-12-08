"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Calendar, Users, DollarSign, Star, Download, Loader2 } from "lucide-react"
import { worshipReportsService } from "@/lib/services/worship-reports.service"
import { toast } from "sonner"

export default function WorshipReportDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [report, setReport] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadReport()
  }, [id])

  const loadReport = async () => {
    try {
      setIsLoading(true)
      const data = await worshipReportsService.getById(id)
      setReport(data)
    } catch (error: any) {
      console.error("Erreur lors du chargement du rapport:", error)
      toast.error("Impossible de charger le rapport")
      router.push("/worship")
    } finally {
      setIsLoading(false)
    }
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

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce rapport ?")) return

    try {
      await worshipReportsService.delete(id)
      toast.success("Rapport supprimé avec succès")
      router.push("/worship")
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error)
      toast.error("Impossible de supprimer le rapport")
    }
  }

  const handleDownloadPDF = () => {
    if (!report) return

    const orateurs = parseJsonArray(report.orateurs)
    const moniteurs = parseJsonArray(report.moniteurs)

    const printWindow = window.open("", "", "width=800,height=600")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Rapport de Culte - ${report.salle}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            h1 { color: #1e40af; font-size: 28px; margin-bottom: 10px; text-align: center; }
            h2 { color: #2563eb; font-size: 20px; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; }
            .date { color: #6b7280; font-size: 14px; margin-bottom: 5px; }
            .salle-badge { display: inline-block; padding: 8px 16px; background: #fee2e2; color: #991b1b; border-radius: 8px; font-weight: bold; margin: 10px 0; }
            .section { margin-bottom: 25px; page-break-inside: avoid; }
            .info-line { padding: 8px; margin-bottom: 5px; background: #f9fafb; border-radius: 4px; }
            .info-label { font-weight: bold; color: #4b5563; }
            .effectif-box { background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; }
            .effectif-line { font-size: 18px; margin: 5px 0; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="date">📅 ${formatDate(report.date)}</div>
            <h1>Rapport de Culte du Dimanche</h1>
            <div class="salle-badge">${report.salle}</div>
          </div>

          <div class="section">
            <h2>👥 Personnel</h2>
            ${orateurs.length > 0
        ? `
              <div class="info-line">
                <span class="info-label">Orateur(s):</span> ${orateurs.join(", ")}
              </div>
            `
        : ""
      }
            <div class="info-line">
              <span class="info-label">Prédicateur:</span> ${report.predicateur}
            </div>
            ${moderateurs.length > 0
        ? `
              <div class="info-line">
                <span class="info-label">Modérateurs:</span> ${moderateurs.join(", ")}
              </div>
            `
        : ""
      }
            ${assistants.length > 0
        ? `
              <div class="info-line">
                <span class="info-label">Assistants:</span> ${assistants.join(", ")}
              </div>
            `
        : ""
      }
          </div>

          <div class="section">
            <h2>📊 Effectifs</h2>
            <div class="effectif-box">
              <div class="effectif-line">
                <strong>Frères:</strong> ${report.effectif_freres}
              </div>
              <div class="effectif-line">
                <strong>Sœurs:</strong> ${report.effectif_soeurs}
              </div>
              <div class="effectif-line" style="font-size: 22px; margin-top: 10px;">
                <strong>TOTAL:</strong> ${report.effectif_total}
              </div>
            </div>
          </div>

          ${report.offrandes
        ? `
            <div class="section">
              <h2>💰 Offrandes</h2>
              <div class="info-line" style="font-size: 18px;">
                ${report.offrandes}
              </div>
            </div>
          `
        : ""
      }

          ${report.nombre_nouveaux_venus > 0
        ? `
            <div class="section">
              <h2>✨ Nouveaux Venus (${report.nombre_nouveaux_venus})</h2>
            </div>
          `
        : ""
      }

          <div style="margin-top: 50px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>Ministère Auprès des Enfants et Adolescents</p>
            <p>Centre Évangélique / Arche de l'Alliance, Masina</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-gray-500">Rapport non trouvé</p>
      </div>
    )
  }

  const orateurs = parseJsonArray(report.orateurs)
  const moderateurs = parseJsonArray(report.moderateurs)
  const assistants = parseJsonArray(report.assistants)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Détails du Rapport</h1>
            <p className="text-gray-600">Rapport de culte du {formatDate(report.date)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
          <Button variant="outline" onClick={() => router.push(`/worship/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne gauche - Infos principales */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">{formatDate(report.date)}</span>
                </div>
                <Badge variant="outline" className={`${getSalleBadgeColor(report.salle)} text-lg py-2 px-4`}>
                  {report.salle}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Effectifs */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Users className="h-5 w-5" />
                Effectifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Frères</span>
                  <span className="text-2xl font-bold text-blue-900">{report.effectif_freres}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-pink-700">Sœurs</span>
                  <span className="text-2xl font-bold text-pink-900">{report.effectif_soeurs}</span>
                </div>
                <div className="pt-3 border-t border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-900">TOTAL</span>
                    <span className="text-3xl font-bold text-blue-900">{report.effectif_total}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offrandes */}
          {report.offrandes && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <DollarSign className="h-5 w-5" />
                  Offrandes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-green-900">{report.offrandes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne droite - Détails */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personnel */}
          <Card>
            <CardHeader>
              <CardTitle>Personnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orateurs.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Orateur(s)</h4>
                    <div className="flex flex-wrap gap-2">
                      {orateurs.map((orateur, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {orateur}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Prédicateur</h4>
                  <Badge variant="outline" className="bg-purple-50 text-purple-800">
                    {report.predicateur}
                  </Badge>
                </div>

                {moderateurs.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Modérateurs</h4>
                    <div className="flex flex-wrap gap-2">
                      {moderateurs.map((moderateur, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50">
                          {moderateur}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {assistants.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Assistants</h4>
                    <div className="flex flex-wrap gap-2">
                      {assistants.map((assistant, index) => (
                        <Badge key={index} variant="outline" className="bg-yellow-50">
                          {assistant}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Nouveaux venus */}
          {report.nombre_nouveaux_venus > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-900">
                  <Star className="h-5 w-5" />
                  Nouveaux Venus ({report.nombre_nouveaux_venus})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {report.nombre_nouveaux_venus} nouveau{report.nombre_nouveaux_venus > 1 ? 'x' : ''} venu{report.nombre_nouveaux_venus > 1 ? 's' : ''} enregistré{report.nombre_nouveaux_venus > 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
