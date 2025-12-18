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
import { ArrowLeft, Calendar, Users, TrendingUp, Download, BarChart3, DollarSign, Loader2 } from "lucide-react"
import { worshipReportsService, type GlobalStats } from "@/lib/services/worship-reports.service"
import { toast } from "sonner"

export default function GlobalReportPage() {
  const router = useRouter()
  const [periode, setPeriode] = useState("annee")
  const [dateDebut, setDateDebut] = useState("2025-01-01")
  const [dateFin, setDateFin] = useState("2025-12-31")
  const [stats, setStats] = useState<GlobalStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [dateDebut, dateFin])

  const fetchStatistics = async () => {
    try {
      setIsLoading(true)
      const data = await worshipReportsService.getGlobalStatistics({
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

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    )
  }

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "", "width=800,height=600")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Rapport Global des Cultes</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            h1 { color: #1e40af; font-size: 28px; margin-bottom: 10px; text-align: center; }
            h2 { color: #2563eb; font-size: 20px; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; }
            .periode { color: #6b7280; font-size: 14px; margin-bottom: 5px; }
            .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
            .stat-card { border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; background: #f9fafb; }
            .stat-label { color: #6b7280; font-size: 14px; margin-bottom: 8px; }
            .stat-value { color: #1f2937; font-size: 32px; font-weight: bold; }
            .stat-subtitle { color: #9ca3af; font-size: 12px; margin-top: 4px; }
            .salle-stats { margin-top: 20px; }
            .salle-item { display: flex; justify-content: space-between; padding: 10px; background: #f3f4f6; margin-bottom: 8px; border-radius: 4px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="periode">📅 Période: ${dateDebut} au ${dateFin}</div>
            <h1>📊 Rapport Global des Cultes</h1>
            <div class="periode">Toutes salles confondues</div>
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

          <h2>🏢 Rapports par Salle</h2>
          <div class="salle-stats">
            ${Object.entries(stats.rapportsParSalle)
        .map(
          ([salle, count]) => `
              <div class="salle-item">
                <strong>${salle}</strong>
                <span>${count} rapport${count > 1 ? "s" : ""}</span>
              </div>
            `
        )
        .join("")}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Rapport Global</h1>
            <p className="text-gray-600">Statistiques toutes salles confondues</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleDownloadPDF} className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Télécharger PDF
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtres de Période
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
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

      {/* Statistiques Totales */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Statistiques Totales
        </h2>
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Frères</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.totalFreres}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((stats.totalFreres / stats.totalEffectif) * 100).toFixed(1)}% de l'effectif
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sœurs</p>
                  <p className="text-3xl font-bold text-pink-600">{stats.totalSoeurs}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((stats.totalSoeurs / stats.totalEffectif) * 100).toFixed(1)}% de l'effectif
                  </p>
                </div>
              </div>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Moyennes par Culte
        </h2>
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

      {/* Rapports par Salle */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports par Salle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stats.rapportsParSalle).map(([salle, count]) => (
              <div
                key={salle}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-sm">
                    {salle}
                  </Badge>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {count} rapport{count > 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
