"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download, Printer, Loader2 } from "lucide-react"
import { cotisationsService, sortiesService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"

export function BilanFinancier() {
  const { toast } = useToast()
  const [entrees, setEntrees] = useState<any[]>([])
  const [sorties, setSorties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateDebut, setDateDebut] = useState("")
  const [dateFin, setDateFin] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Charger les entrées (cotisations) et sorties en parallèle
      const [entreesData, sortiesData] = await Promise.all([
        cotisationsService.getAll(),
        sortiesService.getAll()
      ])

      setEntrees(Array.isArray(entreesData) ? entreesData : [])
      setSorties(Array.isArray(sortiesData) ? sortiesData : [])
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur de chargement du bilan'
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

  // Calculs
  const totalEntrees = entrees.reduce((sum, e) => sum + (e.montant || 0), 0)
  const totalSorties = sorties.reduce((sum, s) => sum + (s.montant || 0), 0)
  const solde = totalEntrees - totalSorties
  const nombreEntrees = entrees.length
  const nombreSorties = sorties.length

  // Statistiques par catégorie de sorties
  const sortiesParCategorie = sorties.reduce((acc, s) => {
    const categorie = s.categorie || 'Autre'
    if (!acc[categorie]) {
      acc[categorie] = { montant: 0, nombre: 0 }
    }
    acc[categorie].montant += s.montant || 0
    acc[categorie].nombre++
    return acc
  }, {} as Record<string, { montant: number; nombre: number }>)

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Le bilan sera téléchargé en format Excel/PDF",
    })
    console.log("Export bilan")
  }

  const handlePrint = () => {
    window.print()
    console.log("Impression du bilan")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Chargement du bilan...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadData} variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtres de période */}
      <Card>
        <CardHeader>
          <CardTitle>Période du bilan</CardTitle>
          <CardDescription>Sélectionnez une période pour générer le bilan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
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
              <Button className="flex-1" onClick={loadData}>
                <Calendar className="mr-2 h-4 w-4" />
                Générer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vue d'ensemble */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-sm text-gray-600">Entrées totales</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{totalEntrees.toLocaleString()}</p>
              <p className="text-xs text-gray-500">CDF ({nombreEntrees} cotisations)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <p className="text-sm text-gray-600">Sorties totales</p>
              </div>
              <p className="text-2xl font-bold text-red-600">{totalSorties.toLocaleString()}</p>
              <p className="text-xs text-gray-500">CDF ({nombreSorties} dépenses)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className={`h-4 w-4 ${solde >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                <p className="text-sm text-gray-600">Solde</p>
              </div>
              <p className={`text-2xl font-bold ${solde >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {solde.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">CDF</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <p className="text-sm text-gray-600">Taux d'épargne</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {totalEntrees > 0 ? Math.round(((totalEntrees - totalSorties) / totalEntrees) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-500">Du budget</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détails entrées et sorties côte à côte */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Entrées détaillées */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-600">Entrées (Cotisations)</CardTitle>
                <CardDescription>Total: {totalEntrees.toLocaleString()} CDF</CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Moniteur</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entrees.slice(0, 5).map((entree) => (
                  <TableRow key={entree.id}>
                    <TableCell className="font-medium">{entree.membre_nom || entree.moniteur}</TableCell>
                    <TableCell className="text-right text-green-600">
                      +{entree.montant.toLocaleString()} CDF
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {entrees.length > 5 && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Et {entrees.length - 5} autre(s)...
              </p>
            )}
          </CardContent>
        </Card>

        {/* Sorties détaillées */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-red-600">Sorties (Dépenses)</CardTitle>
                <CardDescription>Total: {totalSorties.toLocaleString()} CDF</CardDescription>
              </div>
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Libellé</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorties.slice(0, 5).map((sortie) => (
                  <TableRow key={sortie.id}>
                    <TableCell className="font-medium">{sortie.libelle}</TableCell>
                    <TableCell className="text-right text-red-600">
                      -{sortie.montant.toLocaleString()} CDF
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {sorties.length > 5 && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Et {sorties.length - 5} autre(s)...
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Répartition des dépenses */}
      {Object.keys(sortiesParCategorie).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Répartition des dépenses par catégorie</CardTitle>
            <CardDescription>Analyse des sorties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(sortiesParCategorie)
                .sort(([, a], [, b]) => b.montant - a.montant)
                .map(([categorie, stats]) => {
                  const pourcentage = totalSorties > 0 ? Math.round((stats.montant / totalSorties) * 100) : 0
                  return (
                    <div key={categorie}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{categorie}</span>
                        <span className="text-sm font-bold">{stats.montant.toLocaleString()} CDF ({pourcentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${pourcentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résumé final */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Résumé financier</CardTitle>
              <CardDescription>Situation globale de la caisse</CardDescription>
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
          <div className="space-y-3 text-lg">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Entrées totales:</span>
              <span className="font-bold text-green-600">+{totalEntrees.toLocaleString()} CDF</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Sorties totales:</span>
              <span className="font-bold text-red-600">-{totalSorties.toLocaleString()} CDF</span>
            </div>
            <div className="flex justify-between border-t-2 pt-3">
              <span className="font-semibold text-gray-900">Solde final:</span>
              <span className={`font-bold text-xl ${solde >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {solde >= 0 ? '+' : ''}{solde.toLocaleString()} CDF
              </span>
            </div>
          </div>

          {solde < 0 && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                ⚠️ <strong>Attention:</strong> Le solde est négatif. Les dépenses dépassent les entrées.
              </p>
            </div>
          )}

          {solde >= 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ <strong>Bonne nouvelle:</strong> Le solde est positif. La caisse est en bonne santé.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
