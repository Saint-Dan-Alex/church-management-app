"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Calendar, Users, TrendingUp, Download, TrendingDown, DollarSign, Loader2 } from "lucide-react"
import type { SalleType, SalleStats } from "@/types/worship-report"
import { worshipReportsService, type GlobalStats } from "@/lib/services/worship-reports.service"
import { sallesService } from "@/lib/services/salles.service"
import type { Salle } from "@/lib/types/api"
import { toast } from "sonner"

export default function RoomReportPage() {
  const router = useRouter()
  const [salles, setSalles] = useState<Salle[]>([])
  const [salleSelectionnee, setSalleSelectionnee] = useState<string>("")
  const [periode, setPeriode] = useState("annee")
  const [dateDebut, setDateDebut] = useState("2025-01-01")
  const [dateFin, setDateFin] = useState("2025-12-31")
  const [stats, setStats] = useState<GlobalStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingSalles, setIsLoadingSalles] = useState(true)

  useEffect(() => {
    loadSalles()
  }, [])

  useEffect(() => {
    if (salleSelectionnee) {
      fetchStatistics()
    }
  }, [salleSelectionnee, dateDebut, dateFin])

  const loadSalles = async () => {
    try {
      setIsLoadingSalles(true)
      const response = await sallesService.getAll()
      // L'API retourne une réponse paginée avec { data: [], current_page, total, etc. }
      const sallesData = Array.isArray(response) ? response : (response as any).data || []
      setSalles(sallesData)
      // Sélectionner la première salle par défaut
      if (sallesData.length > 0) {
        setSalleSelectionnee(sallesData[0].nom)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des salles:", error)
      toast.error("Impossible de charger les salles")
    } finally {
      setIsLoadingSalles(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      setIsLoading(true)
      const data = await worshipReportsService.getRoomStatistics({
        salle: salleSelectionnee,
        date_debut: dateDebut,
        date_fin: dateFin,
      })
      setStats(data)
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error)
      toast.error("Impossible de charger les statistiques")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading spinner only when salles are being loaded initially
  if (isLoadingSalles) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Chargement des salles...</span>
      </div>
    )
  }

  // Show message if no salles are available
  if (salles.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center flex-col gap-4">
        <p className="text-gray-500">Aucune salle disponible</p>
        <Button onClick={() => router.push("/salles")}>
          Gérer les salles
        </Button>
      </div>
    )
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

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "", "width=800,height=600")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Rapport - ${stats.salle}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            h1 { color: #1e40af; font-size: 28px; margin-bottom: 10px; text-align: center; }
            h2 { color: #2563eb; font-size: 20px; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; }
            .periode { color: #6b7280; font-size: 14px; margin-bottom: 5px; }
            .salle-badge { display: inline-block; padding: 8px 16px; background: #dbeafe; color: #1e40af; border-radius: 8px; font-weight: bold; }
            .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
            .stat-card { border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; background: #f9fafb; }
            .stat-label { color: #6b7280; font-size: 14px; margin-bottom: 8px; }
            .stat-value { color: #1f2937; font-size: 32px; font-weight: bold; }
            .stat-subtitle { color: #9ca3af; font-size: 12px; margin-top: 4px; }
            .highlight-box { background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="periode">📅 Période: ${dateDebut} au ${dateFin}</div>
            <h1>📊 Rapport de Salle</h1>
            <div class="salle-badge">${stats.salle ?? salleSelectionnee}</div>
          </div>

          <div class="highlight-box">
            <strong>${stats.nombreCultes ?? 0} culte${(stats.nombreCultes ?? 0) > 1 ? "s" : ""} enregistré${(stats.nombreCultes ?? 0) > 1 ? "s" : ""}</strong> pour cette période
          </div>

          <h2>📈 Statistiques Totales</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Total Effectif</div>
              <div class="stat-value">${stats.totalEffectif}</div>
              <div class="stat-subtitle">participants</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Nouveaux Venus</div>
              <div class="stat-value">${stats.totalNouveauxVenus}</div>
              <div class="stat-subtitle">personnes</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Frères</div>
              <div class="stat-value">${stats.totalFreres}</div>
              <div class="stat-subtitle">${((stats.totalFreres / stats.totalEffectif) * 100).toFixed(1)}% de l'effectif</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Sœurs</div>
              <div class="stat-value">${stats.totalSoeurs}</div>
              <div class="stat-subtitle">${((stats.totalSoeurs / stats.totalEffectif) * 100).toFixed(1)}% de l'effectif</div>
            </div>
          </div>

          <h2>💰 Offrandes</h2>
          <div class="stat-card" style="background: #d1fae5; border: 2px solid #10b981;">
            <div class="stat-label" style="color: #047857;">Total des Offrandes</div>
            <div class="stat-value" style="color: #065f46; font-size: 28px;">${stats.totalOffrandes}</div>
            <div class="stat-subtitle" style="color: #059669;">${stats.offrandes.length} culte${stats.offrandes.length > 1 ? "s" : ""}</div>
          </div>

          <h2>📊 Moyennes</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Moyenne Effectif</div>
              <div class="stat-value">${stats.moyenneEffectif.toFixed(2)}</div>
              <div class="stat-subtitle">par culte</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Moyenne Nouveaux Venus</div>
              <div class="stat-value">${stats.moyenneNouveauxVenus.toFixed(2)}</div>
              <div class="stat-subtitle">par culte</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Moyenne Frères</div>
              <div class="stat-value">${stats.moyenneFreres.toFixed(2)}</div>
              <div class="stat-subtitle">par culte</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Moyenne Sœurs</div>
              <div class="stat-value">${stats.moyenneSoeurs.toFixed(2)}</div>
              <div class="stat-subtitle">par culte</div>
            </div>
          </div>

          <h2>🏆 Records</h2>
          ${stats.meilleurePresence && stats.moinsPresence ? `
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">🔼 Meilleure Présence</div>
              <div class="stat-value">${stats.meilleurePresence!.effectif}</div>
              <div class="stat-subtitle">${new Date(stats.meilleurePresence!.date).toLocaleDateString("fr-FR")}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">🔽 Moins Bonne Présence</div>
              <div class="stat-value">${stats.moinsPresence!.effectif}</div>
              <div class="stat-subtitle">${new Date(stats.moinsPresence!.date).toLocaleDateString("fr-FR")}</div>
            </div>
          </div>
          ` : '<p style="text-align: center; color: #6b7280;">Aucun rapport disponible pour calculer les records</p>'}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Rapport par Salle</h1>
            <p className="text-gray-600">Statistiques détaillées par salle</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleDownloadPDF}>
          <Download className="mr-2 h-4 w-4" />
          Télécharger PDF
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="grid gap-2">
              <Label htmlFor="salle">Salle *</Label>
              <Select
                value={salleSelectionnee}
                onValueChange={(value: string) => setSalleSelectionnee(value)}
                disabled={isLoadingSalles}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingSalles ? "Chargement..." : "Sélectionner une salle"} />
                </SelectTrigger>
                <SelectContent>
                  {salles.map((salle) => (
                    <SelectItem key={salle.id} value={salle.nom}>
                      {salle.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="periode">Période</Label>
              <Select value={periode} onValueChange={setPeriode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jour">Jour</SelectItem>
                  <SelectItem value="semaine">Semaine</SelectItem>
                  <SelectItem value="mois">Mois</SelectItem>
                  <SelectItem value="trimestre">Trimestre</SelectItem>
                  <SelectItem value="annee">Année</SelectItem>
                  <SelectItem value="personnalisee">Personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {periode === "personnalisee" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="dateDebut">Date de début</Label>
                  <Input
                    id="dateDebut"
                    type="date"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateFin">Date de fin</Label>
                  <Input
                    id="dateFin"
                    type="date"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading state for statistics */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Chargement des statistiques...</span>
            </div>
          </CardContent>
        </Card>
      ) : !stats ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex h-[300px] items-center justify-center">
              <p className="text-gray-500">Aucune donnée disponible pour cette salle</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Salle sélectionnée */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 mb-2">Salle sélectionnée</p>
                  <Badge variant="outline" className={`text-lg py-2 px-4 ${getSalleBadgeColor(stats.salle ?? salleSelectionnee)}`}>
                    {stats.salle ?? salleSelectionnee}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-700">Nombre de cultes</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.nombreCultes ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques Totales */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistiques Totales</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Effectif</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalEffectif}</p>
                      <p className="text-xs text-gray-500 mt-1">participants</p>
                    </div>
                    <Users className="h-10 w-10 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Nouveaux Venus</p>
                      <p className="text-3xl font-bold text-yellow-600">{stats.totalNouveauxVenus}</p>
                      <p className="text-xs text-gray-500 mt-1">personnes</p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600">Total Frères</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.totalFreres}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((stats.totalFreres / stats.totalEffectif) * 100).toFixed(1)}% de l'effectif
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600">Total Sœurs</p>
                  <p className="text-3xl font-bold text-pink-600">{stats.totalSoeurs}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((stats.totalSoeurs / stats.totalEffectif) * 100).toFixed(1)}% de l'effectif
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700">Total Offrandes</p>
                      <p className="text-2xl font-bold text-green-900">{stats.totalOffrandes}</p>
                      <p className="text-xs text-green-600 mt-1">{stats.offrandes.length} cultes</p>
                    </div>
                    <DollarSign className="h-10 w-10 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Moyennes */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Moyennes par Culte</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <p className="text-sm text-green-700">Moyenne Effectif</p>
                  <p className="text-3xl font-bold text-green-900">{stats.moyenneEffectif.toFixed(2)}</p>
                  <p className="text-xs text-green-600 mt-1">participants/culte</p>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <p className="text-sm text-yellow-700">Moyenne Nouveaux Venus</p>
                  <p className="text-3xl font-bold text-yellow-900">{stats.moyenneNouveauxVenus.toFixed(2)}</p>
                  <p className="text-xs text-yellow-600 mt-1">personnes/culte</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <p className="text-sm text-blue-700">Moyenne Frères</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.moyenneFreres.toFixed(2)}</p>
                  <p className="text-xs text-blue-600 mt-1">frères/culte</p>
                </CardContent>
              </Card>

              <Card className="border-pink-200 bg-pink-50">
                <CardContent className="pt-6">
                  <p className="text-sm text-pink-700">Moyenne Sœurs</p>
                  <p className="text-3xl font-bold text-pink-900">{stats.moyenneSoeurs.toFixed(2)}</p>
                  <p className="text-xs text-pink-600 mt-1">sœurs/culte</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Records */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Records de Présence</h2>
            {stats.meilleurePresence && stats.moinsPresence ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-green-300 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <p className="text-sm font-medium text-green-700">Meilleure Présence</p>
                        </div>
                        <p className="text-4xl font-bold text-green-900">{stats.meilleurePresence.effectif}</p>
                        <p className="text-sm text-green-600 mt-2">
                          {new Date(stats.meilleurePresence.date).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-300 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="h-5 w-5 text-red-600" />
                          <p className="text-sm font-medium text-red-700">Moins Bonne Présence</p>
                        </div>
                        <p className="text-4xl font-bold text-red-900">{stats.moinsPresence.effectif}</p>
                        <p className="text-sm text-red-600 mt-2">
                          {new Date(stats.moinsPresence.date).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500 py-8">
                    Aucun rapport disponible pour calculer les records de présence
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  )
}
