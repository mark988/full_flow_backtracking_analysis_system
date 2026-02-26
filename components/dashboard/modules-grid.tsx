"use client"

import Link from "next/link"
import { modules } from "@/lib/modules"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export function ModulesGrid() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-foreground">{"\u529F\u80FD\u6A21\u5757"}</h2>
          <p className="text-xs text-muted-foreground">{"\u7CFB\u7EDF\u6838\u5FC3\u80FD\u529B\u603B\u89C8"}</p>
        </div>
        <Badge variant="outline" className="border-border text-muted-foreground text-xs">
          {`${modules.length} \u4E2A\u6A21\u5757`}
        </Badge>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((mod) => {
          const Icon = mod.icon
          return (
            <Link key={mod.id} href={`/module/${mod.id}`}>
              <Card className="group cursor-pointer border-border bg-card transition-all hover:border-primary/30 hover:bg-secondary/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-${mod.color}/10`}>
                      <Icon className={`h-4 w-4 text-${mod.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-foreground">
                          {mod.name.replace(/^\S+\s+/, '')}
                        </h3>
                        <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {mod.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {mod.highlights.slice(0, 3).map((h) => (
                          <span
                            key={h}
                            className="inline-block rounded-sm bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
