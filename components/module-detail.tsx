"use client"

import { Module } from "@/lib/modules"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const activityData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  events: Math.floor(Math.random() * 120 + 20),
  processed: Math.floor(Math.random() * 100 + 15),
}))

const pieData = [
  { name: "\u5DF2\u5904\u7406", value: 78, color: "oklch(0.72 0.19 170)" },
  { name: "\u5904\u7406\u4E2D", value: 15, color: "oklch(0.55 0.20 200)" },
  { name: "\u5F85\u5904\u7406", value: 7, color: "oklch(0.65 0.15 60)" },
]

export function ModuleDetail({ module: mod }: { module: Module }) {
  const Icon = mod.icon

  return (
    <div className="flex flex-col gap-6">
      {/* Module Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{mod.nameEn}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{mod.description}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {mod.highlights.map((h) => (
              <Badge
                key={h}
                variant="outline"
                className="border-primary/20 bg-primary/5 text-xs text-primary"
              >
                {h}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "\u4ECA\u65E5\u5904\u7406", value: "12,847", change: "+8.3%" },
          { label: "\u5E73\u5747\u54CD\u5E94", value: "0.23s", change: "-12%" },
          { label: "\u6210\u529F\u7387", value: "99.7%", change: "+0.1%" },
          { label: "\u6D3B\u8DC3\u4EFB\u52A1", value: "34", change: "\u7A33\u5B9A" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-0.5 text-xs text-primary">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              {"\u6D3B\u52A8\u8D8B\u52BF"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="eventsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.72 0.19 170)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.72 0.19 170)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250)" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }}
                    axisLine={{ stroke: "oklch(0.25 0.02 250)" }}
                    tickLine={false}
                    interval={3}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.16 0.012 250)",
                      border: "1px solid oklch(0.25 0.02 250)",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "oklch(0.93 0.01 250)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="events"
                    stroke="oklch(0.72 0.19 170)"
                    fill="url(#eventsGrad)"
                    strokeWidth={2}
                    name={"\u4E8B\u4EF6\u6570"}
                  />
                  <Area
                    type="monotone"
                    dataKey="processed"
                    stroke="oklch(0.55 0.20 200)"
                    fill="none"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    name={"\u5DF2\u5904\u7406"}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              {"\u5904\u7406\u72B6\u6001"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.16 0.012 250)",
                      border: "1px solid oklch(0.25 0.02 250)",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "oklch(0.93 0.01 250)",
                    }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name} {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Flow */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">
            {"\u4E1A\u52A1\u6D41\u7A0B"}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{"\u6A21\u5757\u6838\u5FC3\u5904\u7406\u6D41\u7A0B\u7684\u5404\u4E2A\u9636\u6BB5"}</p>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex flex-col gap-0">
            {mod.flow.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {index + 1}
                  </div>
                  {index < mod.flow.length - 1 && (
                    <div className="h-8 w-px bg-border" />
                  )}
                </div>
                <div className="flex items-center pb-4 pt-1.5">
                  <p className="text-sm text-foreground">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
