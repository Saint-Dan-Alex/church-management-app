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

import { ReportHeader } from "../reports/report-header"

export function BilanFinancier() {
  const { toast } = useToast()
  // ... (rest of the state and logic remains the same)

  // Initialisation avec le mois en cours
  const getDatesMoisEncours = () => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
    return { firstDay, lastDay }
  }

  const [entrees, setEntrees] = useState<any[]>([])
  const [sorties, setSorties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { firstDay, lastDay } = getDatesMoisEncours()
  const [dateDebut, setDateDebut] = useState(firstDay)
  const [dateFin, setDateFin] = useState(lastDay)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Préparation des paramètres de filtre
      const params: any = {}
      if (dateDebut) params.date_debut = dateDebut
      if (dateFin) params.date_fin = dateFin

      // Charger les entrées (cotisations) et sorties en parallèle avec pagination large pour tout récupérer
      const [entreesResponse, sortiesResponse]: [any, any] = await Promise.all([
        cotisationsService.getAll({ ...params, per_page: 1000 }),
        sortiesService.getAll({ ...params, per_page: 1000 })
      ])

      // Gestion de la réponse paginée
      const entreesData = entreesResponse.data || entreesResponse
      const sortiesData = sortiesResponse.data || sortiesResponse

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

  // Calculs par devise
  const calculateTotal = (items: any[], devise: string) =>
    items
      .filter(item => item.devise === devise)
      .reduce((sum, item) => sum + Number(item.montant || 0), 0)

  const totalEntreesCDF = calculateTotal(entrees, 'CDF')
  const totalEntreesUSD = calculateTotal(entrees, 'USD')

  const totalSortiesCDF = calculateTotal(sorties, 'CDF')
  const totalSortiesUSD = calculateTotal(sorties, 'USD')

  const soldeCDF = totalEntreesCDF - totalSortiesCDF
  const soldeUSD = totalEntreesUSD - totalSortiesUSD

  const handlePrint = () => {
    window.print()
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
      {/* Header d'impression uniquement */}
      <div className="hidden print:block">
        <ReportHeader
          title="Bilan Financier Global"
          subtitle={`Période du ${new Date(dateDebut).toLocaleDateString("fr-FR")} au ${new Date(dateFin).toLocaleDateString("fr-FR")}`}
        />
      </div>

      {/* Filtres de période - Masqué à l'impression */}
      <Card className="print:hidden">
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

      {/* Vue d'ensemble DOUBLE (CDF et USD) */}
      <div className="grid gap-6 md:grid-cols-2 print:grid-cols-2 print:gap-8">
        {/* Colonne CDF */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-blue-900 border-b pb-2 print:text-black print:border-black">Bilan CDF (Franc Congolais)</h3>
          <div className="grid gap-4">
            <Card className="print:shadow-none print:border-black">
              <CardContent className="p-6 print:py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500 print:text-black">Entrées</p>
                    <p className="text-2xl font-bold text-green-600 print:text-black">+{totalEntreesCDF.toLocaleString()} CDF</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-100 bg-green-600 rounded-full p-1.5 print:hidden" />
                </div>
              </CardContent>
            </Card>
            <Card className="print:shadow-none print:border-black">
              <CardContent className="p-6 print:py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500 print:text-black">Sorties</p>
                    <p className="text-2xl font-bold text-red-600 print:text-black">-{totalSortiesCDF.toLocaleString()} CDF</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-100 bg-red-600 rounded-full p-1.5 print:hidden" />
                </div>
              </CardContent>
            </Card>
            <Card className={`${soldeCDF >= 0 ? "bg-blue-50 border-blue-200" : "bg-orange-50 border-orange-200"} print:bg-white print:border-black print:shadow-none`}>
              <CardContent className="p-6 print:py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-600 print:text-black">Solde CDF</p>
                    <p className={`text-3xl font-bold ${soldeCDF >= 0 ? 'text-blue-700' : 'text-orange-700'} print:text-black`}>
                      {soldeCDF >= 0 ? '+' : ''}{soldeCDF.toLocaleString()} CDF
                    </p>
                  </div>
                  <DollarSign className={`h-10 w-10 ${soldeCDF >= 0 ? 'text-blue-500' : 'text-orange-500'} print:hidden`} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Colonne USD */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-green-900 border-b pb-2 print:text-black print:border-black">Bilan USD (Dollar Américain)</h3>
          <div className="grid gap-4">
            <Card className="print:shadow-none print:border-black">
              <CardContent className="p-6 print:py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500 print:text-black">Entrées</p>
                    <p className="text-2xl font-bold text-green-600 print:text-black">+{totalEntreesUSD.toLocaleString()} USD</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-100 bg-green-600 rounded-full p-1.5 print:hidden" />
                </div>
              </CardContent>
            </Card>
            <Card className="print:shadow-none print:border-black">
              <CardContent className="p-6 print:py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500 print:text-black">Sorties</p>
                    <p className="text-2xl font-bold text-red-600 print:text-black">-{totalSortiesUSD.toLocaleString()} USD</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-100 bg-red-600 rounded-full p-1.5 print:hidden" />
                </div>
              </CardContent>
            </Card>
            <Card className={`${soldeUSD >= 0 ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"} print:bg-white print:border-black print:shadow-none`}>
              <CardContent className="p-6 print:py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-600 print:text-black">Solde USD</p>
                    <p className={`text-3xl font-bold ${soldeUSD >= 0 ? 'text-green-700' : 'text-orange-700'} print:text-black`}>
                      {soldeUSD >= 0 ? '+' : ''}{soldeUSD.toLocaleString()} USD
                    </p>
                  </div>
                  <DollarSign className={`h-10 w-10 ${soldeUSD >= 0 ? 'text-green-500' : 'text-orange-500'} print:hidden`} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Résumé Imprimable (Actions) - Masqué à l'impression */}
      <Card className="print:hidden">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
            <CardTitle className="text-lg sm:text-xl">Actions</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
              <Button variant="outline" size="sm" onClick={handlePrint} className="w-full sm:w-auto">
                <Printer className="mr-2 h-4 w-4" />
                Imprimer le rapport
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Pied de page signatures - Visible uniquement à l'impression */}
      <div className="hidden print:flex justify-between mt-12 pt-8">
        <div className="text-center w-1/3">
          <p className="font-bold mb-16">Le Caissier</p>
          <div className="border-t border-black w-3/4 mx-auto"></div>
        </div>
        <div className="text-center w-1/3">
          <p className="font-bold mb-16">Le Coordinateur</p>
          <div className="border-t border-black w-3/4 mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
