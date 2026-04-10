"use client"

import { useState, useEffect } from "react"
import { SidebarInset } from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { DashboardContentB } from "@/components/dashboard-content-b"
import { DashboardContentC } from "@/components/dashboard-content-c"
import { DashboardContentD } from "@/components/dashboard-content-d"
import { useDesignVariant } from "@/lib/design-variant-context"
import { PageHeader } from "@/components/page-header"
import { Toaster } from "@/components/ui/sonner"
import { useSimulatedDate } from "@/lib/simulated-date-context"
import { sprints } from "@/lib/mock-data/contents"

function formatSprintLabel(sprint: (typeof sprints)[number]) {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
  const start = new Date(sprint.startDate + "T00:00:00")
  const end = new Date(sprint.endDate + "T00:00:00")
  const sM = start.getMonth() + 1
  const sD = start.getDate()
  const sDay = dayNames[start.getDay()]
  const eM = end.getMonth() + 1
  const eD = end.getDate()
  const eDay = dayNames[end.getDay()]
  return `Sprint ${sprint.id} · ${sM}/${sD}(${sDay}) ~ ${eM}/${eD}(${eDay})`
}

export default function DashboardPage() {
  const { todayStr } = useSimulatedDate()
  const { variant } = useDesignVariant()

  const currentSprintId = sprints.find((s) => todayStr >= s.startDate && todayStr <= s.endDate)?.id ?? sprints[sprints.length - 1].id
  const [manualSprintId, setManualSprintId] = useState<number | null>(null)
  const selectedSprintId = manualSprintId ?? currentSprintId

  // Reset manual selection when simulated date changes
  useEffect(() => {
    setManualSprintId(null)
  }, [todayStr])

  return (
    <>
      <AppSidebar activePage="dashboard" />
      <SidebarInset>
        <PageHeader>
          <div className="flex-1 flex items-center justify-between">
            <div className="hidden md:flex items-center gap-3">
              <h1 className="text-lg font-semibold">작업 현황</h1>
              <Select value={String(selectedSprintId)} onValueChange={(v) => setManualSprintId(Number(v))}>
                <SelectTrigger size="sm" className="w-auto gap-1.5 border-none shadow-none text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...sprints].reverse().map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {formatSprintLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:hidden flex items-center gap-3">
              <h1 className="text-base font-semibold">작업 현황</h1>
            </div>
          </div>
        </PageHeader>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="md:hidden mb-4">
            <Select value={String(selectedSprintId)} onValueChange={(v) => setManualSprintId(Number(v))}>
              <SelectTrigger size="sm" className="w-auto gap-1.5 text-sm text-muted-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...sprints].reverse().map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {formatSprintLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {variant === "A" && <DashboardContent selectedSprint={selectedSprintId} />}
          {variant === "B" && <DashboardContentB selectedSprint={selectedSprintId} />}
          {variant === "C" && <DashboardContentC selectedSprint={selectedSprintId} />}
          {variant === "D" && <DashboardContentD selectedSprint={selectedSprintId} />}
        </main>
      </SidebarInset>
      <Toaster />
    </>
  )
}
