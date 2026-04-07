"use client"

import { use } from "react"
import Link from "next/link"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentDetail } from "@/components/content-detail"
import { PageHeader } from "@/components/page-header"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Toaster } from "@/components/ui/sonner"
import { getContentDetailById } from "@/lib/mock-data/content"

export default function ContentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data } = getContentDetailById(id)

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-screen">
          <PageHeader>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">작업 현황</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-[200px] truncate sm:max-w-none">
                    {data.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageHeader>

          <div className="flex-1 min-h-0 flex flex-col">
            <ContentDetail id={id} />
          </div>
        </div>
      </SidebarInset>
      <Toaster />
    </>
  )
}
