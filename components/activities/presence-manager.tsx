"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

  // participants contient déjà les données à jour
  const presents = participants.filter(p => p.est_present || p.statut_presence === 'present').length
  const absents = participants.filter(p => (!p.est_present && p.statut_presence === 'absent') || (!p.est_present && !p.statut_presence)).length
  const retards = participants.filter(p => p.statut_presence === 'retard').length

  // Note: 'absent' est souvent le défaut si !est_present. 
  // Ici on compte explicitement ceux marqués 'absent' ou juste pas là.
  // Ajustez la logique selon vos besoins métiers exacts.

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Gestion des Présences</CardTitle>
        {onManualPresenceClick && (
          <Button onClick={onManualPresenceClick}>
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

          {participants.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun participant inscrit</p>
          ) : (
            <div className="space-y-2">
              {participants.map((participant) => {
                const nom = participant.participant_nom_complet || `${participant.participant_nom} ${participant.participant_prenom || ''}`.trim()
                const statut = participant.statut_presence || (participant.est_present ? 'present' : 'absent')

                // Si filtre d'affichage nécessaire, le faire ici

                return (
                  <div key={participant.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{nom}</p>
                      <p className="text-sm text-gray-500 capitalize">{participant.participant_type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {participant.heure_arrivee && (
                        <span className="text-xs text-gray-500 mr-2">
                          {participant.heure_arrivee}
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
