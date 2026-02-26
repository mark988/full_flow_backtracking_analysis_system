"use client"

import { modules } from "@/lib/modules"
import { modulePageDataMap } from "@/lib/module-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CrudTable } from "@/components/crud-table"
import { OpsMatrixPanels } from "@/components/ops-matrix-panels"
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

export function ModuleDetail({ moduleId }: { moduleId: string }) {
  const mod = modules.find((m) => m.id === moduleId)!
  const Icon = mod.icon
  const data = modulePageDataMap[mod.id]
  // 中文名称：去掉英文前缀
  const chineseName = mod.name.replace(/^\S+\s+/, '')

  // 如果没有配置数据，使用默认
  const stats = data?.stats ?? [
    { label: "今日处理", value: "12,847", change: "+8.3%" },
    { label: "平均响应", value: "0.23s", change: "-12%" },
    { label: "成功率", value: "99.7%", change: "+0.1%" },
    { label: "活跃任务", value: "34", change: "稳定" },
  ]

  const chartConfig = data?.chart ?? {
    title: "活动趋势",
    yLabel: "数量",
    series: [
      { key: "events", name: "事件数", color: "oklch(0.72 0.19 170)" },
      { key: "processed", name: "已处理", color: "oklch(0.55 0.20 200)", dashed: true },
    ],
  }

  const chartData = data?.chartData ?? Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    events: Math.floor(Math.random() * 120 + 20),
    processed: Math.floor(Math.random() * 100 + 15),
  }))

  const pieTitle = data?.pieTitle ?? "处理状态"
  const pieData = data?.pieData ?? [
    { name: "已处理", value: 78, color: "oklch(0.72 0.19 170)" },
    { name: "处理中", value: 15, color: "oklch(0.55 0.20 200)" },
    { name: "待处理", value: 7, color: "oklch(0.65 0.15 60)" },
  ]

  const tableConfig = data?.table
  const crudConfig = data?.crud

  // 为每个模块生成唯一的渐变ID
  const gradId = `grad-${mod.id}`

  return (
    <div className="flex flex-col gap-6">
      {/* Module Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{chineseName}</h1>
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
        {stats.map((stat) => (
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
              {chartConfig.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    {chartConfig.series.map((s, i) => (
                      <linearGradient key={i} id={`${gradId}-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                      </linearGradient>
                    ))}
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
                    tickFormatter={(v) => chartConfig.yLabel ? `${v}` : `${v}`}
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
                  {chartConfig.series.map((s, i) => (
                    <Area
                      key={s.key}
                      type="monotone"
                      dataKey={s.key}
                      stroke={s.color}
                      fill={s.dashed ? "none" : `url(#${gradId}-${i})`}
                      strokeWidth={s.dashed ? 1.5 : 2}
                      strokeDasharray={s.dashed ? "4 4" : undefined}
                      name={s.name}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              {pieTitle}
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
            <div className="flex flex-wrap justify-center gap-3">
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

      {/* Data Table - OpsMatrix专属面板 / CRUD版本 / 只读版本 */}
      {mod.id === "ops-matrix" ? (
        <OpsMatrixPanels />
      ) : tableConfig && crudConfig ? (
        <CrudTable
          title={tableConfig.title}
          columns={tableConfig.columns}
          initialRows={tableConfig.rows}
          formFields={crudConfig.formFields}
          entityName={crudConfig.entityName}
        />
      ) : tableConfig ? (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              {tableConfig.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="w-full">
              <div className="min-w-[640px]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {tableConfig.columns.map((col) => (
                        <th
                          key={col}
                          className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableConfig.rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="border-b border-border/50 transition-colors hover:bg-secondary/50"
                      >
                        {tableConfig.columns.map((col) => {
                          const val = row[col] ?? ""
                          if (col === "状态" || col === "风险等级") {
                            return (
                              <td key={col} className="px-3 py-2.5">
                                <StatusBadge value={val} />
                              </td>
                            )
                          }
                          return (
                            <td
                              key={col}
                              className="px-3 py-2.5 text-foreground whitespace-nowrap"
                            >
                              {val}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : null}

      {/* Business Flow */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">
            {"业务流程"}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{"模块核心处理流程的各个阶段"}</p>
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

// 状态/风险等级标签
function StatusBadge({ value }: { value: string }) {
  let className = "bg-muted text-muted-foreground border-border"

  if (value === "告警" || value === "严重" || value === "高危") {
    className = "bg-destructive/15 text-destructive border-destructive/30"
  } else if (value === "观察" || value === "中危" || value === "分析中" || value === "推演中" || value === "学习中" || value === "繁忙" || value === "生成中") {
    className = "bg-warning/15 text-warning border-warning/30"
  } else if (value === "完成" || value === "已完成" || value === "已确认" || value === "已触发补救" || value === "正常" || value === "已登记" || value === "低危") {
    className = "bg-primary/15 text-primary border-primary/30"
  } else if (value === "未登记") {
    className = "bg-accent/15 text-accent border-accent/30"
  }

  return (
    <Badge variant="outline" className={`text-xs whitespace-nowrap ${className}`}>
      {value}
    </Badge>
  )
}
