"use client"

import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { BrandCalendarView } from "@/components/brand-calendar-view"
import { PageHeader } from "@/components/page-header"
import { Toaster } from "@/components/ui/sonner"

export default function BrandCalendarPage() {
  return (
    <>
      <AppSidebar activePage="calendar-brand" />
      <SidebarInset>
        <PageHeader>
          <h1 className="text-lg font-semibold">브랜드 캘린더</h1>
        </PageHeader>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <BrandCalendarView />
        </main>
      </SidebarInset>
      <Toaster />
    </>
  )
}
