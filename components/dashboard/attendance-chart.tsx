"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface AttendanceChartProps {
  data: any[]
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data && data.length > 0 ? data : []}>
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
        <Bar dataKey="present" name="Présents" fill="#2563eb" radius={[4, 4, 0, 0]} />
        <Bar dataKey="absent" name="Absents" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
