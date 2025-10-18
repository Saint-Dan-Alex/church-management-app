"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Pie, PieChart, Cell } from "recharts"

const ageGroupData = [
  { group: "0-2 ans", count: 8 },
  { group: "3-5 ans", count: 24 },
  { group: "5-7 ans", count: 32 },
  { group: "8-10 ans", count: 45 },
  { group: "11-13 ans", count: 28 },
  { group: "14+ ans", count: 19 },
]

const attendanceData = [
  { name: "Présents", value: 142, color: "hsl(var(--primary))" },
  { name: "Absents", value: 14, color: "hsl(var(--muted))" },
]

export function ChildrenStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Répartition par Groupe d'Âge</CardTitle>
          <CardDescription>Nombre d'enfants par tranche d'âge</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageGroupData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="group"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Présence Globale</CardTitle>
          <CardDescription>Taux de présence des enfants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            {attendanceData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm">
                  {item.name}: <span className="font-semibold">{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Statistiques Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Enfants</p>
              <p className="text-3xl font-bold">156</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nouveaux ce Mois</p>
              <p className="text-3xl font-bold text-green-600">+12</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Taux de Présence</p>
              <p className="text-3xl font-bold">91%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Allergies Signalées</p>
              <p className="text-3xl font-bold text-orange-600">18</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
