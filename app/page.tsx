import { AppShell } from "@/components/app-shell"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TrafficChart } from "@/components/dashboard/traffic-chart"
import { ThreatEvents } from "@/components/dashboard/threat-events"
import { ModulesGrid } from "@/components/dashboard/modules-grid"
import { ProtocolChart } from "@/components/dashboard/protocol-chart"

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Page Title */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {"\u7CFB\u7EDF\u603B\u89C8"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {"\u98DE\u65D7\u5168\u6D41\u91CF\u56DE\u6EAF\u5206\u6790\u7CFB\u7EDF \u2014 \u53EF\u67E5\u8BE2\u3001\u53EF\u8FD8\u539F\u3001\u53EF\u5173\u8054\u3001\u53EF\u6EAF\u6E90"}
          </p>
        </div>

        {/* Stats Overview */}
        <StatsCards />

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TrafficChart />
          </div>
          <ProtocolChart />
        </div>

        {/* Threat Events + Modules */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ThreatEvents />
          <div className="lg:col-span-2">
            <ModulesGrid />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
