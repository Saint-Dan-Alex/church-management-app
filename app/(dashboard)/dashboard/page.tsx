import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Baby, Church, Calendar, TrendingUp, UserCheck } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { apiServer } from "@/lib/utils/api-server"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  let dashboardStats: any = null

  try {
    dashboardStats = await apiServer.get("/dashboard-statistics", { cache: "no-store" })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    dashboardStats = null
  }

  const monitorsActifs = dashboardStats?.monitors?.actifs ?? 0
  const enfantsInscrits = dashboardStats?.children?.total ?? 0

  // Effectif moyen au culte (remplace le % qui n'avait pas de sens)
  let presenceMoyenne = "0"
  if (dashboardStats?.worship?.moyenne_effectif) {
    presenceMoyenne = String(dashboardStats.worship.moyenne_effectif)
  }

  const cultesTotal = dashboardStats?.worship?.total_cultes ?? 0
  const activitiesThisMonth = dashboardStats?.activities_this_month ?? 0
  const sallesActives = dashboardStats?.salles_actives ?? 0

  const recentActivities = dashboardStats?.recent_activities ?? []
  const upcomingEvents = dashboardStats?.upcoming_events ?? []

  // Real data from API
  const attendanceData = dashboardStats?.attendance_chart ?? []
  const growthRate = dashboardStats?.growth_rate ?? 0

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
        <StatsCard title="Effectif Moyen" value={presenceMoyenne} description="par culte" icon={UserCheck} trend="neutral" color="orange" />
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
            <AttendanceChart data={attendanceData} />
          </CardContent>
        </Card>
        <Card className="dashboard-card col-span-3 border border-gray-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Événements à Venir</CardTitle>
            <CardDescription className="text-gray-600">Prochaines activités et cultes</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingEvents data={upcomingEvents} />
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
            <RecentActivity data={recentActivities} />
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
              <span className={`text-2xl font-bold ${growthRate > 0 ? 'text-green-600' : (growthRate < 0 ? 'text-red-600' : 'text-gray-600')}`}>
                {growthRate > 0 ? '+' : ''}{growthRate}%
              </span>
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
