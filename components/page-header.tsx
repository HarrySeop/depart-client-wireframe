"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { MobileHeader } from "@/components/mobile-header"

interface PageHeaderProps {
  children?: React.ReactNode
}

export function PageHeader({ children }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      <MobileHeader />
      <div className="hidden md:flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>
      <div className="flex-1 flex items-center">
        {children}
      </div>
    </header>
  )
}
