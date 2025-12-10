"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Calendar, Users, DollarSign, Star, Printer, Loader2 } from "lucide-react"
import { worshipReportsService } from "@/lib/services/worship-reports.service"
import { toast } from "sonner"
import { ReportHeader } from "@/components/reports/report-header"
import { ReportAnalysis } from "@/components/reports/report-analysis"

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

  const handlePrint = () => {
    window.print()
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

  const percentFreres = report.effectif_total > 0 ? (report.effectif_freres / report.effectif_total) * 100 : 0
  const percentSoeurs = report.effectif_total > 0 ? (report.effectif_soeurs / report.effectif_total) * 100 : 0

  return (
    <div className="space-y-6" id="worship-report-print">
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #worship-report-print, #worship-report-print * { visibility: visible; }
          #worship-report-print { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header Print Only */}
      <div className="hidden print:block mb-8">
        <ReportHeader
          title="Rapport de Culte"
          subtitle={`${report.salle} - ${formatDate(report.date)}`}
        />
      </div>

      {/* Header Screen */}
      <div className="flex items-center justify-between print:hidden">
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
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
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
          <Card className="print:shadow-none print:border-none">
            <CardContent className="pt-6 print:p-0">
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
          <Card className="border-blue-200 bg-blue-50 print:bg-transparent print:border-black">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900 print:text-black">
                <Users className="h-5 w-5" />
                Effectifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 print:text-black">Frères</span>
                  <span className="text-2xl font-bold text-blue-900 print:text-black">{report.effectif_freres}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-pink-700 print:text-black">Sœurs</span>
                  <span className="text-2xl font-bold text-pink-900 print:text-black">{report.effectif_soeurs}</span>
                </div>
                <div className="pt-3 border-t border-blue-200 print:border-black">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-900 print:text-black">TOTAL</span>
                    <span className="text-3xl font-bold text-blue-900 print:text-black">{report.effectif_total}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offrandes */}
          {report.offrandes && (
            <Card className="border-green-200 bg-green-50 print:bg-transparent print:border-black">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900 print:text-black">
                  <DollarSign className="h-5 w-5" />
                  Offrandes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-green-900 print:text-black">{report.offrandes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne droite - Détails */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personnel */}
          <Card className="print:shadow-none print:border-black">
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
                        <Badge key={index} variant="outline" className="bg-blue-50 print:bg-transparent print:border-black">
                          {orateur}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Prédicateur</h4>
                  <Badge variant="outline" className="bg-purple-50 text-purple-800 print:bg-transparent print:text-black print:border-black">
                    {report.predicateur}
                  </Badge>
                </div>

                {moderateurs.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Modérateurs</h4>
                    <div className="flex flex-wrap gap-2">
                      {moderateurs.map((moderateur, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 print:bg-transparent print:border-black">
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
                        <Badge key={index} variant="outline" className="bg-yellow-50 print:bg-transparent print:border-black">
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
            <Card className="border-yellow-200 bg-yellow-50 print:bg-transparent print:border-black">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-900 print:text-black">
                  <Star className="h-5 w-5" />
                  Nouveaux Venus ({report.nombre_nouveaux_venus})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 print:text-black">
                  {report.nombre_nouveaux_venus} nouveau{report.nombre_nouveaux_venus > 1 ? 'x' : ''} venu{report.nombre_nouveaux_venus > 1 ? 's' : ''} enregistré{report.nombre_nouveaux_venus > 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ReportAnalysis
        title="Analyse du Culte"
        metrics={[
          { label: "Total Participants", value: report.effectif_total, unit: "", previousValue: undefined },
          { label: "Proportion Frères", value: percentFreres, unit: "%" },
          { label: "Proportion Sœurs", value: percentSoeurs, unit: "%" },
          ...(report.nombre_nouveaux_venus > 0 ? [{ label: "Nouveaux Venus", value: report.nombre_nouveaux_venus, unit: "" }] : [])
        ]}
        customComment={
          report.nombre_nouveaux_venus > 0
            ? `Nous avons eu la joie d'accueillir ${report.nombre_nouveaux_venus} nouvelles personnes. Un suivi s'impose pour leur intégration.`
            : "Aucun nouveau venu n'a été enregistré lors de ce culte."
        }
      />
    </div>
  )
}
