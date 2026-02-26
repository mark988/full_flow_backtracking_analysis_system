"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const events = [
  {
    id: "EVT-001",
    type: "\u6A2A\u5411\u79FB\u52A8",
    source: "192.168.1.45",
    target: "10.0.3.22",
    severity: "critical" as const,
    time: "2 \u5206\u949F\u524D",
  },
  {
    id: "EVT-002",
    type: "C2 \u901A\u4FE1",
    source: "172.16.0.88",
    target: "ext:45.33.12.7",
    severity: "high" as const,
    time: "5 \u5206\u949F\u524D",
  },
  {
    id: "EVT-003",
    type: "\u6570\u636E\u6CC4\u9732",
    source: "10.0.1.15",
    target: "ext:185.22.4.1",
    severity: "high" as const,
    time: "8 \u5206\u949F\u524D",
  },
  {
    id: "EVT-004",
    type: "\u66B4\u529B\u7834\u89E3",
    source: "ext:89.12.3.44",
    target: "10.0.0.5",
    severity: "medium" as const,
    time: "12 \u5206\u949F\u524D",
  },
  {
    id: "EVT-005",
    type: "\u5F02\u5E38\u52A0\u5BC6",
    source: "10.0.2.33",
    target: "ext:104.27.1.1",
    severity: "medium" as const,
    time: "15 \u5206\u949F\u524D",
  },
  {
    id: "EVT-006",
    type: "\u53EF\u7591\u626B\u63CF",
    source: "ext:203.0.113.5",
    target: "10.0.0.0/24",
    severity: "low" as const,
    time: "18 \u5206\u949F\u524D",
  },
  {
    id: "EVT-007",
    type: "\u96B1\u853D\u96A7\u9053",
    source: "172.16.0.101",
    target: "ext:95.142.46.2",
    severity: "high" as const,
    time: "22 \u5206\u949F\u524D",
  },
]

const severityMap = {
  critical: {
    label: "\u4E25\u91CD",
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
  high: {
    label: "\u9AD8\u5371",
    className: "bg-warning/15 text-warning border-warning/30",
  },
  medium: {
    label: "\u4E2D\u5371",
    className: "bg-accent/15 text-accent border-accent/30",
  },
  low: {
    label: "\u4F4E\u5371",
    className: "bg-muted text-muted-foreground border-border",
  },
}

export function ThreatEvents() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">
            {"\u5B9E\u65F6\u5A01\u80C1\u4E8B\u4EF6"}
          </CardTitle>
          <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive text-xs">
            {`${events.length} \u4E2A\u6D3B\u8DC3`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[300px]">
          <div className="flex flex-col gap-2">
            {events.map((event) => {
              const sev = severityMap[event.severity]
              return (
                <div
                  key={event.id}
                  className="flex items-center gap-3 rounded-md border border-border bg-secondary/50 p-3 transition-colors hover:bg-secondary"
                >
                  <Badge
                    variant="outline"
                    className={`shrink-0 text-xs ${sev.className}`}
                  >
                    {sev.label}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {event.type}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {event.id}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs font-mono text-muted-foreground">
                      {event.source} {"->"} {event.target}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {event.time}
                  </span>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
