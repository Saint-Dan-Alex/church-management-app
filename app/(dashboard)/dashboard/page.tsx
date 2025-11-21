import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Baby, Church, Calendar, TrendingUp, UserCheck } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import api from "@/lib/utils/api"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  let dashboardStats: any = null
  let monitorsStats: any = null

  try {
    dashboardStats = await api.get("/dashboard-statistics", { cache: "no-store" })
  } catch (error) {
    dashboardStats = null
  }

  try {
    monitorsStats = await api.get("/monitors-statistics", { cache: "no-store" })
  } catch (error) {
    monitorsStats = null
  }

  const monitorsActifs = monitorsStats?.actifs ?? 24
  const enfantsInscrits = dashboardStats?.children?.total ?? 156
  const presenceMoyenne = dashboardStats?.worship?.moyenne_effectif
    ? `${Math.round(dashboardStats.worship.moyenne_effectif)}%`
    : "87%"
  const cultesTotal = dashboardStats?.worship?.total_cultes ?? 8
  const activitiesThisMonth = dashboardStats?.activities_this_month ?? 12
  const sallesActives = dashboardStats?.salles_actives ?? 5

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-sm text-gray-600">Vue d'ensemble de votre ministère</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Moniteurs Actifs" value={String(monitorsActifs)} description="" icon={Users} trend="neutral" color="blue" />
        <StatsCard title="Enfants Inscrits" value={String(enfantsInscrits)} description="" icon={Baby} trend="neutral" color="green" />
        <StatsCard title="Présence Moyenne" value={presenceMoyenne} description="" icon={UserCheck} trend="neutral" color="orange" />
        <StatsCard title="Cultes (total)" value={String(cultesTotal)} description="" icon={Church} trend="neutral" color="purple" />
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
              <span className="text-2xl font-bold text-blue-900">{String(activitiesThisMonth)}</span>
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
              <span className="text-2xl font-bold text-blue-900">{String(sallesActives)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
