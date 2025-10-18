import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Baby, Church, Calendar, TrendingUp, UserCheck } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-blue-900">Tableau de Bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre ministère - Gloire à Dieu</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Moniteurs Actifs" value="24" description="+2 ce mois" icon={Users} trend="up" color="blue" />
        <StatsCard
          title="Enfants Inscrits"
          value="156"
          description="+12 ce mois"
          icon={Baby}
          trend="up"
          color="purple"
        />
        <StatsCard
          title="Présence Moyenne"
          value="87%"
          description="+5% vs mois dernier"
          icon={UserCheck}
          trend="up"
          color="green"
        />
        <StatsCard title="Cultes ce Mois" value="8" description="2 à venir" icon={Church} trend="neutral" color="sky" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="dashboard-card col-span-4 border border-gray-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Présence aux Cultes</CardTitle>
            <CardDescription className="text-gray-600">
              Évolution de la présence sur les 6 derniers mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceChart />
          </CardContent>
        </Card>
        <Card className="dashboard-card col-span-3 border border-gray-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Événements à Venir</CardTitle>
            <CardDescription className="text-gray-600">Prochaines activités et cultes</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingEvents />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="dashboard-card border border-gray-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Activité Récente</CardTitle>
            <CardDescription className="text-gray-600">Dernières actions dans le système</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
        <Card className="dashboard-card border border-gray-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Statistiques Rapides</CardTitle>
            <CardDescription className="text-gray-600">Aperçu des métriques clés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Activités ce mois</span>
              </div>
              <span className="text-2xl font-bold text-blue-900">12</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Taux de croissance</span>
              </div>
              <span className="text-2xl font-bold text-green-600">+8%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Church className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Salles actives</span>
              </div>
              <span className="text-2xl font-bold text-blue-900">5</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
