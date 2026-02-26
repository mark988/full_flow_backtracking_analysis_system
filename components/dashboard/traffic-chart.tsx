"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

const data = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  inbound: Math.floor(Math.random() * 800 + 400),
  outbound: Math.floor(Math.random() * 600 + 200),
  threat: Math.floor(Math.random() * 50),
}))

export function TrafficChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          {"\u6D41\u91CF\u8D8B\u52BF\u76D1\u63A7"}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{"\u8FC7\u53BB 24 \u5C0F\u65F6\u7F51\u7EDC\u6D41\u91CF\u5206\u5E03"}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="inboundGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.72 0.19 170)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.72 0.19 170)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outboundGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.20 200)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.20 200)" stopOpacity={0} />
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
                tickFormatter={(v) => `${v}GB`}
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
                dataKey="inbound"
                stroke="oklch(0.72 0.19 170)"
                fill="url(#inboundGrad)"
                strokeWidth={2}
                name={"\u5165\u7AD9\u6D41\u91CF"}
              />
              <Area
                type="monotone"
                dataKey="outbound"
                stroke="oklch(0.55 0.20 200)"
                fill="url(#outboundGrad)"
                strokeWidth={2}
                name={"\u51FA\u7AD9\u6D41\u91CF"}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
