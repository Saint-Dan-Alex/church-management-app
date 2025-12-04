"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Printer, Calendar, TrendingUp, TrendingDown, DollarSign, Loader2 } from "lucide-react"
import { cotisationsService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"

export function RapportCotisations() {
  const { toast } = useToast()
  const [cotisations, setCotisations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [moniteurFilter, setMoniteurFilter] = useState("all")
  const [dateDebut, setDateDebut] = useState("")
  const [dateFin, setDateFin] = useState("")
  const [filteredData, setFilteredData] = useState<any[]>([])

  useEffect(() => {
    loadCotisations()
  }, [])

  const loadCotisations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await cotisationsService.getAll()
      const cotisationsArray = Array.isArray(data) ? data : []
      setCotisations(cotisationsArray)
      setFilteredData(cotisationsArray)
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur de chargement des cotisations'
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

  // Liste unique des moniteurs
  const moniteurs = Array.from(new Set(cotisations.map((c) => c.membre_nom || c.moniteur))).sort()

  const handleSearch = () => {
    let results = cotisations

    // Filtre par moniteur
    if (moniteurFilter !== "all") {
      results = results.filter((c) => (c.membre_nom || c.moniteur) === moniteurFilter)
    }

    // Filtre par date
    if (dateDebut && dateFin) {
      results = results.filter((c) => {
        const datePaiement = c.date_cotisation || c.datePaiement
        if (!datePaiement) return false
        const date = new Date(datePaiement)
        const debut = new Date(dateDebut)
        const fin = new Date(dateFin)
        return date >= debut && date <= fin
      })
    }

    setFilteredData(results)
    toast({
      title: "Recherche effectuée",
      description: `${results.length} cotisation(s) trouvée(s)`,
    })
  }

  const handleReset = () => {
    setMoniteurFilter("all")
    setDateDebut("")
    setDateFin("")
    setFilteredData(cotisations)
  }

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Le rapport sera téléchargé en format Excel/PDF",
    })
    console.log("Export rapport:", filteredData)
  }

  const handlePrint = () => {
    window.print()
    console.log("Impression du rapport")
  }

  // Calculs statistiques
  const totalMontant = filteredData.reduce((sum, c) => sum + (c.montant || 0), 0)
  const totalPaye = filteredData.filter((c) => c.statut === "Payé" || c.statut === "paid").reduce((sum, c) => sum + (c.montant || 0), 0)
  const totalEnAttente = filteredData.filter((c) => c.statut === "En attente" || c.statut === "pending").reduce((sum, c) => sum + (c.montant || 0), 0)
  const nombreCotisations = filteredData.length
  const nombrePayees = filteredData.filter((c) => c.statut === "Payé" || c.statut === "paid").length
  const tauxPaiement = nombreCotisations > 0 ? Math.round((nombrePayees / nombreCotisations) * 100) : 0

  // Statistiques par moniteur
  const statsParMoniteur = filteredData.reduce((acc, c) => {
    const nom = c.membre_nom || c.moniteur
    if (!acc[nom]) {
      acc[nom] = { total: 0, paye: 0, enAttente: 0, nombre: 0 }
    }
    acc[nom].nombre++
    acc[nom].total += c.montant || 0
    if (c.statut === "Payé" || c.statut === "paid") {
      acc[nom].paye += c.montant || 0
    } else {
      acc[nom].enAttente += c.montant || 0
    }
    return acc
  }, {} as Record<string, { total: number; paye: number; enAttente: number; nombre: number }>)

  const getStatutBadge = (statut: string) => {
    if (statut === "Payé" || statut === "paid") {
      return <Badge className="bg-green-500">Payé</Badge>
    } else if (statut === "En attente" || statut === "pending") {
      return <Badge variant="secondary">En attente</Badge>
    }
    return <Badge variant="outline">{statut}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Chargement du rapport...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadCotisations} variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtres de recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres de recherche</CardTitle>
          <CardDescription>Recherchez les cotisations par moniteur et période</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="grid gap-2">
              <Label htmlFor="moniteur">Moniteur</Label>
              <Select value={moniteurFilter} onValueChange={setMoniteurFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les moniteurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les moniteurs</SelectItem>
                  {moniteurs.map((moniteur) => (
                    <SelectItem key={moniteur} value={moniteur}>
                      {moniteur}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dateDebut">Date début</Label>
              <Input
                id="dateDebut"
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dateFin">Date fin</Label>
              <Input
                id="dateFin"
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} className="flex-1">
                <Search className="mr-2 h-4 w-4" />
                Rechercher
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques générales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-gray-600">Cotisations</p>
              </div>
              <p className="text-2xl font-bold">{nombreCotisations}</p>
              <p className="text-xs text-gray-500">Total enregistré</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-sm text-gray-600">Montant payé</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{totalPaye.toLocaleString()}</p>
              <p className="text-xs text-gray-500">CDF</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-orange-600" />
                <p className="text-sm text-gray-600">En attente</p>
              </div>
              <p className="text-2xl font-bold text-orange-600">{totalEnAttente.toLocaleString()}</p>
              <p className="text-xs text-gray-500">CDF</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                <p className="text-sm text-gray-600">Taux de paiement</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">{tauxPaiement}%</p>
              <p className="text-xs text-gray-500">{nombrePayees}/{nombreCotisations} payées</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques par moniteur */}
      {moniteurFilter === "all" && Object.keys(statsParMoniteur).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiques par moniteur</CardTitle>
            <CardDescription>Résumé des cotisations par moniteur</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Moniteur</TableHead>
                  <TableHead className="text-right">Nombre</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Payé</TableHead>
                  <TableHead className="text-right">En attente</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(statsParMoniteur)
                  .sort(([, a], [, b]) => b.total - a.total)
                  .map(([moniteur, stats]) => (
                    <TableRow key={moniteur}>
                      <TableCell className="font-medium">{moniteur}</TableCell>
                      <TableCell className="text-right">{stats.nombre}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {stats.total.toLocaleString()} CDF
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {stats.paye.toLocaleString()} CDF
                      </TableCell>
                      <TableCell className="text-right text-orange-600">
                        {stats.enAttente.toLocaleString()} CDF
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Tableau détaillé */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Détails des cotisations</CardTitle>
              <CardDescription>Liste complète des cotisations trouvées</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Moniteur</TableHead>
                <TableHead>Période</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Date paiement</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Aucune cotisation trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((cotisation) => (
                  <TableRow key={cotisation.id}>
                    <TableCell className="font-medium">{cotisation.membre_nom || cotisation.moniteur}</TableCell>
                    <TableCell>{cotisation.mois && cotisation.annee ? `${cotisation.mois} ${cotisation.annee}` : cotisation.periode}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {cotisation.montant.toLocaleString()} {cotisation.devise}
                    </TableCell>
                    <TableCell>
                      {cotisation.date_cotisation || cotisation.datePaiement
                        ? new Date(cotisation.date_cotisation || cotisation.datePaiement).toLocaleDateString("fr-FR")
                        : "-"}
                    </TableCell>
                    <TableCell>{cotisation.methode_paiement || cotisation.modePaiement || "-"}</TableCell>
                    <TableCell>{getStatutBadge(cotisation.statut)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {filteredData.length > 0 && (
            <div className="mt-4 flex justify-end border-t pt-4">
              <div className="space-y-1 text-right">
                <p className="text-sm text-gray-600">
                  Total: <span className="font-bold text-lg">{totalMontant.toLocaleString()} CDF</span>
                </p>
                <p className="text-xs text-green-600">
                  Payé: {totalPaye.toLocaleString()} CDF
                </p>
                <p className="text-xs text-orange-600">
                  En attente: {totalEnAttente.toLocaleString()} CDF
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
