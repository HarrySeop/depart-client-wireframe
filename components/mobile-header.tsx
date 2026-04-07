"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

export function MobileHeader() {
  const { setOpenMobile } = useSidebar()

  return (
    <div className="flex items-center md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpenMobile(true)}
        className="size-9"
      >
        <Menu className="size-5" />
        <span className="sr-only">메뉴 열기</span>
      </Button>
    </div>
  )
}
