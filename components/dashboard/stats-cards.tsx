"use client"

import { Activity, Database, Shield, AlertTriangle, Server, Wifi } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    label: "\u4ECA\u65E5\u6D41\u91CF\u603B\u91CF",
    value: "2.8 PB",
    change: "+12.5%",
    trend: "up" as const,
    icon: Database,
  },
  {
    label: "\u6D3B\u8DC3\u4F1A\u8BDD",
    value: "1,284,392",
    change: "+8.3%",
    trend: "up" as const,
    icon: Activity,
  },
  {
    label: "\u5B89\u5168\u4E8B\u4EF6",
    value: "347",
    change: "-15.2%",
    trend: "down" as const,
    icon: Shield,
  },
  {
    label: "\u5A01\u80C1\u544A\u8B66",
    value: "23",
    change: "+2",
    trend: "up" as const,
    icon: AlertTriangle,
  },
  {
    label: "\u63A2\u9488\u8282\u70B9",
    value: "128",
    change: "\u5168\u90E8\u5728\u7EBF",
    trend: "stable" as const,
    icon: Server,
  },
  {
    label: "\u52A0\u5BC6\u6D41\u91CF\u5360\u6BD4",
    value: "73.6%",
    change: "+1.2%",
    trend: "up" as const,
    icon: Wifi,
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span
                  className={
                    stat.trend === "down"
                      ? "text-xs text-success"
                      : stat.trend === "stable"
                      ? "text-xs text-primary"
                      : "text-xs text-warning"
                  }
                >
                  {stat.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
