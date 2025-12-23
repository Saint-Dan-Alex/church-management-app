"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { activitiesService } from "@/lib/services/activities.service"

interface PresenceManagerProps {
  activiteId: string
  activiteNom: string
  dateActivite: Date
  heureFinActivite: string
  participants?: any[]
  onManualPresenceClick?: () => void
}

export function PresenceManager({
  activiteId,
  activiteNom,
  dateActivite,
  heureFinActivite,
  participants = [],
  onManualPresenceClick
}: PresenceManagerProps) {

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (dateActivite) {
      return dateActivite.toISOString().split('T')[0]
    }
    return new Date().toISOString().split('T')[0]
  })
  const [dailyData, setDailyData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch daily presences
  useEffect(() => {
    const fetchPresences = async () => {
      try {
        setLoading(true)
        const response: any = await activitiesService.getPresences({
          activity_id: activiteId,
          date_presence: selectedDate
        })
        setDailyData(response.data || [])
      } catch (error) {
        console.error("Erreur loading presences", error)
      } finally {
        setLoading(false)
      }
    }

    if (activiteId) {
      fetchPresences()
    }
  }, [activiteId, selectedDate])

  // Merge participants with daily status
  const mergedParticipants = participants.map(p => {
    // Trouver la présence pour ce participant
    // p.participant_id est l'ID du Child/Monitor
    const presence = dailyData.find((d: any) => d.participant_id === p.participant_id)

    return {
      ...p,
      statut_presence: presence ? presence.statut : 'absent', // Par défaut absent si pas de record
      heure_arrivee: presence ? presence.heure_arrivee : null,
      est_present: presence && presence.statut === 'present'
    }
  })

  // Recalculate stats based on MERGED data
  const presents = mergedParticipants.filter(p => p.statut_presence === 'present').length
  const retards = mergedParticipants.filter(p => p.statut_presence === 'retard').length
  // Absents = ceux marqués absent OU ceux sans record (moniteurs)
  // Pour l'instant on compte tout autre statut comme absent
  const absents = mergedParticipants.length - presents - retards

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl font-bold">Gestion des Présences</CardTitle>
          <div className="flex gap-2 items-center">
            <Label htmlFor="date-view" className="text-xs text-muted-foreground">Date :</Label>
            <Input
              id="date-view"
              type="date"
              className="h-8 text-xs w-auto"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
        {onManualPresenceClick && (
          <Button onClick={onManualPresenceClick} size="sm">
            Faire l'appel
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">Présents</p>
              <p className="text-2xl font-bold text-green-900">
                {presents}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">Absents</p>
              <p className="text-2xl font-bold text-red-900">
                {absents}
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-700">Retards</p>
              <p className="text-2xl font-bold text-yellow-900">
                {retards}
              </p>
            </div>
          </div>

          {mergedParticipants.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun participant inscrit</p>
          ) : (
            <div className="space-y-2">
              {mergedParticipants.map((participant) => {
                const nom = participant.participant_nom_complet || `${participant.participant_nom} ${participant.participant_prenom || ''}`.trim()
                const statut = participant.statut_presence
                const heure = participant.heure_arrivee ? participant.heure_arrivee.substring(0, 5) : null

                return (
                  <div key={participant.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{nom}</p>
                      <p className="text-sm text-gray-500 capitalize">{participant.participant_type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {heure && (
                        <span className="text-xs text-gray-500 mr-2">
                          {heure}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statut === 'present' ? 'bg-green-100 text-green-800' :
                        statut === 'retard' ? 'bg-yellow-100 text-yellow-800' :
                          statut === 'excuse' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {statut === 'present' ? 'Présent' :
                          statut === 'retard' ? 'En retard' :
                            statut === 'excuse' ? 'Excusé' : 'Absent'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
