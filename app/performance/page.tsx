import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { PageHeader } from "@/components/page-header"

export default function PerformancePage() {
  return (
    <>
      <AppSidebar activePage="performance" />
      <SidebarInset>
        <PageHeader>
          <h1 className="text-lg font-semibold">성과 대시보드</h1>
        </PageHeader>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground text-lg">디플랜 입니다.</p>
        </div>
      </SidebarInset>
    </>
  )
}
