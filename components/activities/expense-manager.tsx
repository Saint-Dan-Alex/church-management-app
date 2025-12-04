"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { expensesService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"

interface ExpenseManagerProps {
  activiteId: string
}

export function ExpenseManager({ activiteId }: ExpenseManagerProps) {
  const { toast } = useToast()
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadExpenses()
  }, [activiteId])

  const loadExpenses = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await expensesService.getAll({ activity_id: activiteId })
      setExpenses(Array.isArray(data) ? data : [])
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur de chargement des dépenses'
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

  const totalCDF = expenses.filter(e => e.devise === 'CDF').reduce((sum, e) => sum + (e.montant || 0), 0)
  const totalUSD = expenses.filter(e => e.devise === 'USD').reduce((sum, e) => sum + (e.montant || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Chargement des dépenses...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadExpenses} variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Dépenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">Total CDF</p>
              <p className="text-2xl font-bold text-red-900">
                {totalCDF.toLocaleString()} CDF
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">Total USD</p>
              <p className="text-2xl font-bold text-red-900">
                {totalUSD.toLocaleString()} USD
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700">Nombre de Dépenses</p>
              <p className="text-2xl font-bold text-purple-900">
                {expenses.length}
              </p>
            </div>
          </div>

          {expenses.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucune dépense enregistrée</p>
          ) : (
            <div className="space-y-2">
              {expenses.map((expense) => (
                <div key={expense.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-gray-600">{expense.categorie}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">
                      {expense.montant.toLocaleString()} {expense.devise}
                    </p>
                    <p className="text-xs text-gray-500">{expense.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
