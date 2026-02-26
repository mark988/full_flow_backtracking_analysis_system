"use client"

import { Bell, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AppHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={"\u641C\u7D22\u6D41\u91CF\u3001\u4F1A\u8BDD\u3001\u4E8B\u4EF6..."}
            className="w-80 bg-secondary pl-10 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
          {"\u7CFB\u7EDF\u8FD0\u884C\u4E2D"}
        </Badge>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
          <span className="sr-only">{"\u901A\u77E5"}</span>
        </Button>
      </div>
    </header>
  )
}
