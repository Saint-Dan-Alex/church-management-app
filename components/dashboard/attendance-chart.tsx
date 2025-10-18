"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  { month: "Jan", present: 142, absent: 14 },
  { month: "Fév", present: 138, absent: 18 },
  { month: "Mar", present: 145, absent: 11 },
  { month: "Avr", present: 151, absent: 5 },
  { month: "Mai", present: 148, absent: 8 },
  { month: "Juin", present: 156, absent: 0 },
]

export function AttendanceChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" className="text-xs" tick={{ fill: "#6b7280" }} />
        <YAxis className="text-xs" tick={{ fill: "#6b7280" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#374151" }}
        />
        <Bar dataKey="present" fill="#2563eb" radius={[4, 4, 0, 0]} />
        <Bar dataKey="absent" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
