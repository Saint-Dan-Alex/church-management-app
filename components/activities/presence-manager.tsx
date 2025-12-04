"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { presencesService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"

interface PresenceManagerProps {
  activiteId: string
}

export function PresenceManager({ activiteId }: PresenceManagerProps) {
  const { toast } = useToast()
  const [presences, setPresences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPresences()
  }, [activiteId])

  const loadPresences = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await presencesService.getAll({ activity_id: activiteId })
      setPresences(Array.isArray(data) ? data : [])
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur de chargement des présences'
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Chargement des présences...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadPresences} variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Présences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">Présents</p>
              <p className="text-2xl font-bold text-green-900">
                {presences.filter(p => p.statut === 'present').length}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">Absents</p>
              <p className="text-2xl font-bold text-red-900">
                {presences.filter(p => p.statut === 'absent').length}
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-700">Retards</p>
              <p className="text-2xl font-bold text-yellow-900">
                {presences.filter(p => p.statut === 'retard').length}
              </p>
            </div>
          </div>

          {presences.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucune présence enregistrée</p>
          ) : (
            <div className="space-y-2">
              {presences.map((presence) => (
                <div key={presence.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">{presence.moniteur_nom}</p>
                    <p className="text-sm text-gray-600">{presence.date_presence}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${presence.statut === 'present' ? 'bg-green-100 text-green-800' :
                      presence.statut === 'absent' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                    {presence.statut}
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
