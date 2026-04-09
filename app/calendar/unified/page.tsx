"use client"

import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { UnifiedCalendarView } from "@/components/unified-calendar-view"
import { PageHeader } from "@/components/page-header"
import { Toaster } from "@/components/ui/sonner"

export default function UnifiedCalendarPage() {
  return (
    <>
      <AppSidebar activePage="calendar-unified" />
      <SidebarInset>
        <PageHeader>
          <h1 className="text-lg font-semibold">통합 캘린더</h1>
        </PageHeader>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <UnifiedCalendarView />
        </main>
      </SidebarInset>
      <Toaster />
    </>
  )
}
