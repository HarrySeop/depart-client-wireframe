"use client"

import { SidebarInset } from "@/components/ui/sidebar"
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

function formatSprintHeader(todayStr: string) {
  const sprint = sprints.find((s) => todayStr >= s.startDate && todayStr <= s.endDate)
  if (!sprint) return ""
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
  const sprintHeader = formatSprintHeader(todayStr)

  return (
    <>
      <AppSidebar activePage="dashboard" />
      <SidebarInset>
        <PageHeader>
          <div className="flex-1 flex items-center justify-between">
            <div className="hidden md:flex items-center gap-3">
              <h1 className="text-lg font-semibold">작업 현황</h1>
              <span className="text-sm text-muted-foreground">
                {sprintHeader}
              </span>
            </div>
            <div className="md:hidden flex items-center gap-3">
              <h1 className="text-base font-semibold">작업 현황</h1>
            </div>
          </div>
        </PageHeader>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="md:hidden mb-4">
            <span className="text-sm text-muted-foreground">
              {sprintHeader}
            </span>
          </div>
          {variant === "A" && <DashboardContent />}
          {variant === "B" && <DashboardContentB />}
          {variant === "C" && <DashboardContentC />}
          {variant === "D" && <DashboardContentD />}
        </main>
      </SidebarInset>
      <Toaster />
    </>
  )
}
