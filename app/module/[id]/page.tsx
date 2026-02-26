import { notFound } from "next/navigation"
import { modules } from "@/lib/modules"
import { AppShell } from "@/components/app-shell"
import { ModuleDetail } from "@/components/module-detail"

export function generateStaticParams() {
  return modules.map((mod) => ({
    id: mod.id,
  }))
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const mod = modules.find((m) => m.id === id)

  if (!mod) {
    notFound()
  }

  return (
    <AppShell>
      <ModuleDetail moduleId={mod.id} />
    </AppShell>
  )
}
