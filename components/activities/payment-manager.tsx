"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { paymentsService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"

interface PaymentManagerProps {
  activiteId: string
}

export function PaymentManager({ activiteId }: PaymentManagerProps) {
  const { toast } = useToast()
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPayments()
  }, [activiteId])

  const loadPayments = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await paymentsService.getAll({ activity_id: activiteId })
      setPayments(Array.isArray(data) ? data : [])
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur de chargement des paiements'
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

  const totalPaye = payments.reduce((sum, p) => sum + (p.montant_paye || 0), 0)
  const totalAttendu = payments.reduce((sum, p) => sum + (p.montant || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Chargement des paiements...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadPayments} variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Paiements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">Total Payé</p>
              <p className="text-2xl font-bold text-green-900">
                {totalPaye.toLocaleString()} CDF
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">Total Attendu</p>
              <p className="text-2xl font-bold text-blue-900">
                {totalAttendu.toLocaleString()} CDF
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-700">Reste à Payer</p>
              <p className="text-2xl font-bold text-orange-900">
                {(totalAttendu - totalPaye).toLocaleString()} CDF
              </p>
            </div>
          </div>

          {payments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun paiement enregistré</p>
          ) : (
            <div className="space-y-2">
              {payments.map((payment) => (
                <div key={payment.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">{payment.participant_nom_complet}</p>
                    <p className="text-sm text-gray-600">
                      {payment.montant_paye.toLocaleString()} / {payment.montant.toLocaleString()} {payment.devise}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${payment.statut === 'paid' ? 'bg-green-100 text-green-800' :
                      payment.statut === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {payment.statut}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
