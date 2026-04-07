"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { SimulatedDateProvider } from "@/lib/simulated-date-context"
import { DesignVariantProvider } from "@/lib/design-variant-context"

export function SidebarWrapper({
  defaultOpen,
  children,
}: {
  defaultOpen: boolean
  children: React.ReactNode
}) {
  return (
    <SimulatedDateProvider>
      <DesignVariantProvider>
        <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
      </DesignVariantProvider>
    </SimulatedDateProvider>
  )
}
