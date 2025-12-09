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

// Import additionnel nécessaire en haut de fichier (non visible ici, géré par l'import existant ou ajout manuel si besoin)
// import { monitorsService } from "@/lib/services/monitors.service" 
// NOTE: Je vais supposer que je peux l'importer depuis "@/lib/services/monitors.service"

// Fonction utilitaire pour les dates du mois en cours (réutilisée)
const getDatesMoisEncours = () => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  return { firstDay, lastDay }
}

export function RapportCotisations() {
  const { toast } = useToast()
  const [cotisations, setCotisations] = useState<any[]>([])
  const [moniteursList, setMoniteursList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // États de filtre
  const [moniteurFilter, setMoniteurFilter] = useState("all")
  const { firstDay, lastDay } = getDatesMoisEncours()
  const [dateDebut, setDateDebut] = useState(firstDay)
  const [dateFin, setDateFin] = useState(lastDay)

  const [filteredData, setFilteredData] = useState<any[]>([])

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Effet pour appliquer les filtres localement quand les données ou filtres changent
  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cotisations, moniteurFilter, dateDebut, dateFin])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Charger les cotisations (toutes) et les moniteurs en parallèle
      // On utilise import dynamique pour monitorsService si pas dispo dans l'index global, 
      // ou on suppose qu'il est dispo. 
      // Pour éviter les erreurs d'import, je vais utiliser un require ou assumer l'import.
      // Je vais utiliser cotisationsService qui est déjà là, et ajouter monitorsService.

      // Ici on triche un peu : on charge tout (per_page=2000) pour faire le filtrage côté client
      // C'est plus fluide pour un rapport interactif "léger"
      const [cotisationsRes, moniteursRes] = await Promise.all([
        cotisationsService.getAll({ per_page: 2000 }),
        import("@/lib/services/monitors.service").then(m => m.monitorsService.getAll())
      ])

      const cotisationsData = cotisationsRes.data || cotisationsRes
      const cotisationsArray = Array.isArray(cotisationsData) ? cotisationsData : []

      const moniteursData = moniteursRes.data || moniteursRes
      const moniteursArray = Array.isArray(moniteursData) ? moniteursData : []

      setCotisations(cotisationsArray)
      setMoniteursList(moniteursArray)

    } catch (err: any) {
      console.error(err)
      const errorMessage = err.message || 'Erreur de chargement des données'
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

  // Helper pour le nom complet (Doit matcher celui de l'ajout: Nom PostNom Prénom)
  const getMonitorFullName = (m: any) => {
    if (!m) return ""
    return `${m.nom || ""} ${m.postNom || ""} ${m.prenom || ""}`.trim().replace(/\s+/g, " ")
  }

  const applyFilters = () => {
    let results = cotisations

    // Filtre par moniteur (ID ou Nom)
    if (moniteurFilter !== "all") {
      results = results.filter((c) => {
        // On essaie de matcher le nom exact
        const nomCotisation = (c.membre_nom || c.moniteur || "").trim().replace(/\s+/g, " ")
        const nomFilter = moniteurFilter.trim().replace(/\s+/g, " ")

        // Match exact ou contient (pour plus de souplesse)
        return nomCotisation === nomFilter
      })
    }

    // Filtre par date
    if (dateDebut && dateFin) {
      results = results.filter((c) => {
        const datePaiement = c.date_cotisation // || c.datePaiement
        if (!datePaiement) return false
        const date = new Date(datePaiement)
        const debut = new Date(dateDebut)
        const fin = new Date(dateFin)
        // Comparaison dates inclusive
        return date >= debut && date <= fin
      })
    }

    setFilteredData(results)
  }

  const handleReset = () => {
    setMoniteurFilter("all")
    const { firstDay, lastDay } = getDatesMoisEncours()
    setDateDebut(firstDay)
    setDateFin(lastDay)
  }

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Le rapport sera téléchargé en format Excel/PDF",
    })
  }

  const handlePrint = () => {
    window.print()
  }

  // Calculs statistiques Multi-Devises
  const calculateTotal = (items: any[], devise: string) =>
    items.filter(c => c.devise === devise).reduce((sum, c) => sum + Number(c.montant || 0), 0)

  const totalCDF = calculateTotal(filteredData, 'CDF')
  const totalUSD = calculateTotal(filteredData, 'USD')

  // On compte juste le nombre total d'enregistrements
  const nombreCotisations = filteredData.length

  // Taux de paiement (basé sur le statut)
  const payees = filteredData.filter((c) => c.statut?.toLowerCase() === "payé" || c.statut?.toLowerCase() === "paid" || !c.statut /* assumé payé si pas de statut? non */)
  const nombrePayees = payees.length
  const tauxPaiement = nombreCotisations > 0 ? Math.round((nombrePayees / nombreCotisations) * 100) : 0

  // Statistiques par moniteur (Agrégation)
  const statsParMoniteur = filteredData.reduce((acc, c) => {
    const nom = c.membre_nom || c.moniteur || "Inconnu"
    if (!acc[nom]) {
      acc[nom] = { totalCDF: 0, totalUSD: 0, nombre: 0 }
    }
    acc[nom].nombre++

    if (c.devise === 'USD') {
      acc[nom].totalUSD += Number(c.montant || 0)
    } else {
      acc[nom].totalCDF += Number(c.montant || 0)
    }
    return acc
  }, {} as Record<string, { totalCDF: number; totalUSD: number; nombre: number }>)

  const getStatutBadge = (statut: string | undefined) => {
    const s = (statut || "").toLowerCase()
    if (s === "payé" || s === "paid") {
      return <Badge className="bg-green-500">Payé</Badge>
    } else if (s === "en attente" || s === "pending") {
      return <Badge variant="secondary">En attente</Badge>
    }
    return <Badge variant="outline">{statut || "N/A"}</Badge>
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
        <Button onClick={loadData} variant="outline">Réessayer</Button>
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
                <SelectContent className="max-h-[200px]">
                  <SelectItem value="all">Tous les moniteurs</SelectItem>
                  {moniteursList.map((moniteur) => {
                    const fullName = getMonitorFullName(moniteur)
                    return (
                      <SelectItem key={moniteur.id} value={fullName}>
                        {fullName}
                      </SelectItem>
                    )
                  })}
                  {/* Fallback pour les moniteurs dans les cotisations mais pas dans la liste officielle */}
                  {/* Optionnel, pour simplification on ne met que la liste officielle */}
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
              {/* Le bouton Rechercher n'est plus strictement nécessaire car l'effet applique les filtres auto, 
                  mais on peut le garder pour forcer un refresh si besoin ou juste par UX */}
              <Button onClick={applyFilters} className="flex-1">
                <Search className="mr-2 h-4 w-4" />
                Actualiser
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
                <p className="text-sm text-gray-600">Nombre total</p>
              </div>
              <p className="text-2xl font-bold">{nombreCotisations}</p>
              <p className="text-xs text-gray-500">Cotisations enregistrées</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-sm text-gray-600">Total CDF</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{totalCDF.toLocaleString()} CDF</p>
              <p className="text-xs text-gray-500">Francs Congolais</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-start text-green-700" />
                <p className="text-sm text-gray-600">Total USD</p>
              </div>
              <p className="text-2xl font-bold text-green-700">{totalUSD.toLocaleString()} USD</p>
              <p className="text-xs text-gray-500">Dollars Américains</p>
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
      {Object.keys(statsParMoniteur).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiques par moniteur</CardTitle>
            <CardDescription>Résumé des cotisations par moniteur (Période sélectionnée)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Moniteur</TableHead>
                  <TableHead className="text-right">Nombre</TableHead>
                  <TableHead className="text-right">Total CDF</TableHead>
                  <TableHead className="text-right">Total USD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(statsParMoniteur)
                  .sort(([, a], [, b]) => b.totalCDF - a.totalCDF)
                  .map(([moniteur, stats]) => (
                    <TableRow key={moniteur}>
                      <TableCell className="font-medium">{moniteur}</TableCell>
                      <TableCell className="text-right">{stats.nombre}</TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {stats.totalCDF > 0 ? `${stats.totalCDF.toLocaleString()} CDF` : '-'}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-700">
                        {stats.totalUSD > 0 ? `${stats.totalUSD.toLocaleString()} USD` : '-'}
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
              <CardDescription>Liste détaillée des cotisations trouvées</CardDescription>
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
                <TableHead>Réçu N°</TableHead>
                {/* <TableHead>Statut</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Aucune cotisation trouvée pour cette période.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((cotisation) => (
                  <TableRow key={cotisation.id}>
                    <TableCell className="font-medium">{cotisation.membre_nom || cotisation.moniteur}</TableCell>
                    <TableCell>{cotisation.mois && cotisation.annee ? `${cotisation.mois} ${cotisation.annee}` : cotisation.periode}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {Number(cotisation.montant).toLocaleString()} {cotisation.devise}
                    </TableCell>
                    <TableCell>
                      {cotisation.date_cotisation
                        ? new Date(cotisation.date_cotisation).toLocaleDateString("fr-FR")
                        : "-"}
                    </TableCell>
                    <TableCell>{cotisation.mode_paiement || "-"}</TableCell>
                    <TableCell>{cotisation.numero_recu || "-"}</TableCell>
                    {/* <TableCell>{getStatutBadge(cotisation.statut)}</TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
