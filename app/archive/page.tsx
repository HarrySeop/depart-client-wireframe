import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { ArchiveContent } from "@/components/archive-content"
import { PageHeader } from "@/components/page-header"

export default function ArchivePage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <PageHeader>
          <h1 className="text-lg font-semibold">저장소</h1>
        </PageHeader>
        <ArchiveContent />
      </SidebarInset>
    </>
  )
}
