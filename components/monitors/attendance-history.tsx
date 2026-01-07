"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle2, Loader2, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { presencesService, type Presence } from "@/lib/services/presences.service"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useUser } from "@/hooks/use-user"

export function AttendanceHistory() {
  const { user } = useUser()
  const [filterPeriod, setFilterPeriod] = useState("all")
  const [presences, setPresences] = useState<Presence[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPresences = async () => {
    setIsLoading(true)
    try {
      let date_debut: string | undefined
      const today = new Date()

      if (filterPeriod === "week") {
        const firstDayOfWeek = new Date(today)
        const day = today.getDay()
        const diff = today.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
        firstDayOfWeek.setDate(diff)
        date_debut = firstDayOfWeek.toISOString().split('T')[0]
      } else if (filterPeriod === "month") {
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        date_debut = firstDayOfMonth.toISOString().split('T')[0]
      } else if (filterPeriod === "year") {
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1)
        date_debut = firstDayOfYear.toISOString().split('T')[0]
      }

      const response = await presencesService.getAll({
        date_debut
      })

      // Handle pagination if api returns { data: [] }
      const data = Array.isArray(response) ? response : (response as any).data || []

      // Filtrer pour les non-admins/managers
      let filteredData = data;

      // Rôles pouvant voir tout l'historique (ou leur scope mais ici tout pour simplifier selon la demande)
      // "il n ya que coordination, chef_salles, admin et com_activités"
      const managerRoles = ['ADMIN', 'SUPER_ADMIN', 'COORDINATION', 'CHEF_SALLE', 'COM_ACTIVITES'];
      const isManager = user?.role && managerRoles.includes(user.role.toUpperCase());

      if (!isManager && user?.name) {
        filteredData = data.filter((p: any) => {
          const moniteurNomComplet = (p.moniteur_nom_complet || `${p.moniteur_prenom || ''} ${p.moniteur_nom || ''}`).trim();

          // Comparaison par tokens exacts pour éviter le problème "Dan" vs "Daniel"
          const userTokens = user.name.toLowerCase().split(/\s+/).filter(Boolean);
          const moniteurTokens = moniteurNomComplet.toLowerCase().split(/\s+/).filter(Boolean);

          // Vérifie si l'un est inclus dans l'autre (match de tous les mots)
          const userInMoniteur = userTokens.every(t => moniteurTokens.includes(t));
          const moniteurInUser = moniteurTokens.every(t => userTokens.includes(t));

          return userInMoniteur || moniteurInUser;
        });
      }

      setPresences(filteredData)
    } catch (error) {
      console.error("Erreur chargement présences", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPresences()
  }, [filterPeriod])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-600 hover:bg-green-700">Présent</Badge>
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>
      case 'retard':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Retard</Badge>
      case 'excuse':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Excusé</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Historique des Pointages</h3>
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tout l'historique</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : presences.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucun historique trouvé pour cette période
        </div>
      ) : (
        <div className="space-y-2">
          {presences.map((record) => (
            <Card key={record.id} className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${record.statut === 'present' ? 'bg-green-100 text-green-600' :
                    record.statut === 'absent' ? 'bg-red-100 text-red-600' :
                      record.statut === 'retard' ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-600'
                    }`}>
                    {record.statut === 'present' ? <CheckCircle2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{record.moniteur_nom_complet || `${record.moniteur_prenom} ${record.moniteur_nom}`}</h4>
                    <p className="text-sm text-muted-foreground">{record.activity_nom}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(record.date_presence), 'dd/MM/yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{record.heure_arrivee?.substring(0, 5) || '--:--'}</span>
                  </div>
                  {getStatusBadge(record.statut)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
