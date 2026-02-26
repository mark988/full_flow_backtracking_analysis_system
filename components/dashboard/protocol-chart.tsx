"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts"

const data = [
  { name: "HTTPS", value: 4200, color: "oklch(0.72 0.19 170)" },
  { name: "HTTP", value: 1800, color: "oklch(0.55 0.20 200)" },
  { name: "DNS", value: 1200, color: "oklch(0.65 0.15 60)" },
  { name: "SSH", value: 800, color: "oklch(0.60 0.22 25)" },
  { name: "FTP", value: 400, color: "oklch(0.55 0.18 280)" },
  { name: "SMTP", value: 350, color: "oklch(0.72 0.19 170)" },
  { name: "QUIC", value: 280, color: "oklch(0.55 0.20 200)" },
]

export function ProtocolChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          {"\u534F\u8BAE\u5206\u5E03"}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{"\u5404\u534F\u8BAE\u6D41\u91CF\u5360\u6BD4\u7EDF\u8BA1"}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fill: "oklch(0.85 0.01 250)" }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.16 0.012 250)",
                  border: "1px solid oklch(0.25 0.02 250)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "oklch(0.93 0.01 250)",
                }}
                formatter={(value: number) => [`${value} GB`, "\u6D41\u91CF"]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
