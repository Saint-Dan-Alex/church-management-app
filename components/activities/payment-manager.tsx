"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, FileText } from "lucide-react"
import { paymentsService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"
import { ReceiptDialog } from "./receipt-dialog"

interface PaymentManagerProps {
  activiteId: string
}

export function PaymentManager({ activiteId }: PaymentManagerProps) {
  const { toast } = useToast()
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null)

  useEffect(() => {
    loadPayments()
  }, [activiteId])

  const loadPayments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await paymentsService.getAll({ activity_id: activiteId })
      // Gestion robuste de la pagination Laravel
      let data: any[] = []
      if (response && typeof response === 'object') {
        if (Array.isArray(response)) {
          data = response
        } else if (Array.isArray((response as any).data)) {
          data = (response as any).data
        }
      }
      setPayments(data)
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

  // Calculs avec conversion explicite en float pour éviter la concaténation de strings
  const totalPaye = payments.reduce((sum, p) => sum + parseFloat(String(p.montant || 0)), 0)

  // Total Attendu (Somme des montants théoriques restants ou totaux ?)
  // Si montant_paye est 0 dans la DB payments, on suppose que le user voulait dire montant de la transaction.
  // Pour l'instant, on retire "Total Attendu" qui est confus avec les données actuelles, 
  // car nous n'avons que la liste des transactions, pas l'état global des dettes ici.
  // On va plutôt afficher "Nombre de transactions" à la place du milieu.

  // Cependant, pour répondre au screenshot, essayons de réparer l'affichage existant.
  // Si on veut afficher le total théorique attendu pour CES paiements (ce qui est bizarre):
  // const totalAttendu = payments.reduce((sum, p) => sum + parseFloat(String(p.montant_attendu || 0)), 0)

  // Remplaçons par une stats plus simple :
  const nombrePaiements = payments.length
  const moyennePaiement = nombrePaiements > 0 ? totalPaye / nombrePaiements : 0

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
              <p className="text-sm text-green-700">Total Encaissé</p>
              <p className="text-2xl font-bold text-green-900">
                {totalPaye.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CDF
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">Nombre de paiements</p>
              <p className="text-2xl font-bold text-blue-900">
                {nombrePaiements}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-700">Moyenne par paiement</p>
              <p className="text-2xl font-bold text-orange-900">
                {moyennePaiement.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CDF
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
                      {/* Affichage du montant de la transaction uniquement */}
                      {parseFloat(String(payment.montant)).toLocaleString(undefined, { minimumFractionDigits: 2 })} {payment.devise}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${payment.statut === 'paid' ? 'bg-green-100 text-green-800' :
                      payment.statut === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {payment.statut}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Voir le reçu"
                      onClick={() => setSelectedReceipt(payment)}
                    >
                      <FileText className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <ReceiptDialog
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        payment={selectedReceipt}
      />
    </Card>
  )
}
