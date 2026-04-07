"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  ClipboardList,
  Calendar as CalendarIcon,
  BarChart3,
  Archive,
  LogOut,
  CalendarDays,
  Layers,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useSimulatedDate } from "@/lib/simulated-date-context"
import { useDesignVariant, type DesignVariant } from "@/lib/design-variant-context"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"

const BRAND_LOGO = "https://depart-recruit-service.s3.ap-northeast-2.amazonaws.com/production/public/2026/03/27/721d04d4-eddc-49b0-839e-d98320836ddf.png"

interface AppSidebarProps {
  activePage?: "dashboard" | "calendar" | "performance"
}

export function AppSidebar({ activePage = "dashboard" }: AppSidebarProps) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const isProductionArea = activePage === "dashboard" || activePage === "calendar"
  const { today, setToday, todayStr } = useSimulatedDate()
  const { variant, setVariant } = useDesignVariant()
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
  const variants: { value: DesignVariant; label: string }[] = [
    { value: "A", label: "A안 (현재)" },
    { value: "B", label: "B안" },
    { value: "C", label: "C안" },
    { value: "D", label: "D안" },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className={cn("!flex-row h-14 items-center px-4 border-b border-border", isCollapsed && "justify-center px-0")}>
        <Link href="/" className="flex items-center gap-2">
          <img
            src={BRAND_LOGO}
            alt="라트로프"
            className={cn("shrink-0 rounded-full object-contain", isCollapsed ? "size-7" : "size-8")}
          />
          {!isCollapsed && (
            <span className="text-sm font-semibold tracking-widest">LLATROF</span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* 제작 대시보드 (그룹 헤더) */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="제작 대시보드"
                  asChild
                  isActive={isCollapsed && isProductionArea}
                >
                  <Link href="/">
                    <LayoutDashboard className="size-4" />
                    <span>제작 대시보드</span>
                  </Link>
                </SidebarMenuButton>
                {/* 펼침 상태: 서브메뉴 (제작 영역일 때만 표시) */}
                {!isCollapsed && isProductionArea && (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={activePage === "dashboard"}>
                        <Link href="/">
                          <span>작업 현황</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={activePage === "calendar"}>
                        <Link href="/calendar">
                          <span>캘린더</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* 접힘 상태: 서브 항목을 개별 아이콘으로 표시 (제작 영역일 때만) */}
              {isCollapsed && isProductionArea && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="작업 현황" asChild isActive={activePage === "dashboard"}>
                      <Link href="/">
                        <ClipboardList className="size-4" />
                        <span>작업 현황</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="캘린더" asChild isActive={activePage === "calendar"}>
                      <Link href="/calendar">
                        <CalendarIcon className="size-4" />
                        <span>캘린더</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              {/* 성과 대시보드 */}
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="성과 대시보드" asChild isActive={activePage === "performance"}>
                  <Link href="/performance">
                    <BarChart3 className="size-4" />
                    <span>성과 대시보드</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* Design Variant Selector */}
        {activePage === "dashboard" && (
          <div className={cn("px-3 pb-2", isCollapsed && "px-1")}>
            {isCollapsed ? (
              <button
                onClick={() => {
                  const idx = variants.findIndex((v) => v.value === variant)
                  setVariant(variants[(idx + 1) % variants.length].value)
                }}
                className="flex items-center justify-center w-full rounded-md border border-dashed border-blue-400/50 bg-blue-500/5 p-2 text-xs text-blue-600 transition-colors hover:bg-blue-500/10"
                title={`시안: ${variant}안`}
              >
                <Layers className="size-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full rounded-md border border-dashed border-blue-400/50 bg-blue-500/5 px-3 py-2">
                <Layers className="size-3.5 shrink-0 text-blue-600" />
                <select
                  value={variant}
                  onChange={(e) => setVariant(e.target.value as DesignVariant)}
                  className="flex-1 bg-transparent text-xs font-medium text-blue-600 outline-none cursor-pointer"
                >
                  {variants.map((v) => (
                    <option key={v.value} value={v.value}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Date Simulator (Dev Tool) */}
        <div className={cn("px-3 pb-2", isCollapsed && "px-1")}>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-2 w-full rounded-md border border-dashed border-orange-400/50 bg-orange-500/5 text-xs text-orange-600 transition-colors hover:bg-orange-500/10",
                  isCollapsed ? "justify-center p-2" : "px-3 py-2"
                )}
              >
                <CalendarDays className="size-3.5 shrink-0" />
                {!isCollapsed && (
                  <span className="truncate font-medium">
                    {todayStr} ({dayNames[today.getDay()]})
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="right">
              <div className="p-2 border-b border-border">
                <p className="text-xs font-medium text-muted-foreground">시뮬레이션 날짜 선택</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">선택한 날짜 기준으로 화면이 변경됩니다</p>
              </div>
              <Calendar
                mode="single"
                selected={today}
                onSelect={(date) => date && setToday(date)}
                defaultMonth={today}
                modifiers={{
                  saturday: (date) => date.getDay() === 6,
                  sunday: (date) => date.getDay() === 0,
                }}
                modifiersClassNames={{
                  saturday: "text-blue-500",
                  sunday: "text-red-500",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <SidebarSeparator />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="저장소" asChild>
              <Link href="/archive">
                <Archive className="size-4" />
                <span>저장소</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="로그아웃">
              <LogOut className="size-4" />
              <span>로그아웃</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
