"use client"

import * as React from "react"
import { InboxIcon } from "lucide-react"
import { TaskListItem } from "./task-list-item"
import type { TaskCardProps } from "./task-card"
import type { StatusType } from "./status-badge"
import { ConfirmModal } from "./confirm-modal"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useSimulatedDate } from "@/lib/simulated-date-context"
import { useSidebar } from "@/components/ui/sidebar"
import {
  getDashboardItems,
  getPlanningConfirmWindow,
  getContentConfirmWindow,
  sprints,
} from "@/lib/mock-data/contents"

function getSprintForDate(dateStr: string) {
  return sprints.find((s) => dateStr >= s.startDate && dateStr <= s.endDate)
}

function formatDeadline(dateStr: string, hour: string) {
  const d = new Date(dateStr + "T00:00:00")
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
  return `${d.getMonth() + 1}/${d.getDate()}(${dayNames[d.getDay()]}) ${hour}`
}

function getNextDayOfWeek(todayStr: string, targetDay: number): string {
  const d = new Date(todayStr + "T00:00:00")
  const current = d.getDay()
  let daysUntil = targetDay - current
  if (daysUntil <= 0) daysUntil += 7
  d.setDate(d.getDate() + daysUntil)
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
  return `${d.getMonth() + 1}/${d.getDate()}(${dayNames[d.getDay()]})`
}

function getNextPlanningDelivery(todayStr: string): string {
  return `${getNextDayOfWeek(todayStr, 5)} 16:00`
}

function getNextContentDelivery(todayStr: string): string {
  return `${getNextDayOfWeek(todayStr, 0)} 24:00`
}

export function DashboardContentD() {
  const { todayStr } = useSimulatedDate()
  const { state: sidebarState, isMobile } = useSidebar()
  const currentSprint = getSprintForDate(todayStr)

  const data = React.useMemo(() => getDashboardItems(todayStr), [todayStr])

  const hasPlanningConfirm = data.planningConfirm.length > 0
  const hasContentConfirm = data.contentConfirm.length > 0

  // 가장 가까운 마감
  const closestDeadline = React.useMemo(() => {
    const deadlines: string[] = []
    if (hasPlanningConfirm && data.planningConfirm.length > 0) {
      const w = getPlanningConfirmWindow(data.planningConfirm[0].sprint)
      if (w) deadlines.push(formatDeadline(w.end, "15:00"))
    }
    if (hasContentConfirm && data.contentConfirm.length > 0) {
      const w = getContentConfirmWindow(data.contentConfirm[0].sprint)
      if (w) deadlines.push(formatDeadline(w.end, "12:00"))
    }
    return deadlines[0] || ""
  }, [data, hasPlanningConfirm, hasContentConfirm])

  // -- 통합 리스트 데이터 --
  const allItems = React.useMemo((): (TaskCardProps & { type: "planning" | "content" })[] => {
    const items: (TaskCardProps & { type: "planning" | "content" })[] = []

    if (hasPlanningConfirm) {
      items.push(...data.planningConfirm.map((c) => ({
        id: c.id,
        status: "기획완료" as StatusType,
        title: c.title,
        sprintInfo: `→ Sp.${c.sprint} 제작`,
        builder: c.builderName,
        href: `/planning/${c.id}`,
        type: "planning" as const,
      })))
    }

    if (hasContentConfirm) {
      items.push(...data.contentConfirm.map((c) => ({
        id: c.id,
        status: "제작완료" as StatusType,
        title: c.title,
        sprintInfo: `→ Sp.${c.sprint} 업로드`,
        builder: c.designerName,
        builderLabel: "파트너",
        href: `/content/${c.id}`,
        type: "content" as const,
      })))
    }

    if (!hasPlanningConfirm && !hasContentConfirm) {
      items.push(...data.uploadPending.map((c) => ({
        id: c.id,
        status: "업로드 대기" as StatusType,
        title: c.title,
        sprintInfo: `Sp.${c.sprint}`,
        builder: c.designerName,
        builderLabel: "파트너",
        href: `/content/${c.id}`,
        type: "content" as const,
      })))
      items.push(...data.uploadComplete.slice(0, 6).map((c) => ({
        id: c.id,
        status: "업로드 완료" as StatusType,
        title: c.title,
        sprintInfo: `Sp.${c.sprint}`,
        builder: c.designerName,
        builderLabel: "파트너",
        href: `/content/${c.id}`,
        type: "content" as const,
      })))
    }

    return items
  }, [data, hasPlanningConfirm, hasContentConfirm])

  // -- 상태 관리 --
  const [tasks, setTasks] = React.useState(allItems)
  React.useEffect(() => { setTasks(allItems) }, [allItems])

  // -- 체크박스 선택 --
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  React.useEffect(() => { setSelected(new Set()) }, [allItems])

  const confirmableItems = tasks.filter(
    (t) => t.status === "기획완료" || t.status === "수정완료" || t.status === "제작완료"
  )
  const isConfirmMode = hasPlanningConfirm || hasContentConfirm

  const toggleItem = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === confirmableItems.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(confirmableItems.map((t) => t.id)))
    }
  }

  // 선택 항목을 타입별로 분리
  const selectedPlanning = tasks.filter(
    (t) => selected.has(t.id) && t.type === "planning"
  )
  const selectedContent = tasks.filter(
    (t) => selected.has(t.id) && t.type === "content"
  )

  // -- 컨펌 모달 --
  const [showPlanningModal, setShowPlanningModal] = React.useState(false)
  const [showContentModal, setShowContentModal] = React.useState(false)
  const [showCombinedModal, setShowCombinedModal] = React.useState(false)

  const handleConfirm = () => {
    const ids = Array.from(selected)
    setTasks((prev) =>
      prev.map((t) => {
        if (!ids.includes(t.id)) return t
        if (t.type === "planning") return { ...t, status: "최종 확정" as StatusType }
        return { ...t, status: "승인완료" as StatusType }
      })
    )
    const count = ids.length
    setSelected(new Set())
    setShowPlanningModal(false)
    setShowContentModal(false)
    setShowCombinedModal(false)
    toast.success(`${count}건이 컨펌되었습니다.`)
  }

  const handleConfirmClick = () => {
    if (selectedPlanning.length > 0 && selectedContent.length > 0) {
      setShowCombinedModal(true)
    } else if (selectedPlanning.length > 0) {
      setShowPlanningModal(true)
    } else {
      setShowContentModal(true)
    }
  }

  // 제목 / 뱃지
  const listTitle = isConfirmMode ? "컨펌 대기 항목" : "업로드 현황"

  return (
    <>
      <div className={cn("space-y-6", selected.size > 0 ? "pb-28" : "pb-4")}>
        {/* 헤더 */}
        <section className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">{listTitle}</h2>
              {isConfirmMode && closestDeadline && (
                <span className="inline-flex items-center gap-1 text-sm font-bold text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                  <span className="size-1.5 rounded-full bg-orange-500 animate-pulse" />
                  마감: {closestDeadline}
                </span>
              )}
              {!isConfirmMode && (
                <>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                    {getNextPlanningDelivery(todayStr)} 기획서 전달 예정
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                    {getNextContentDelivery(todayStr)} 콘텐츠 전달 예정
                  </span>
                </>
              )}
              {data.pendingPlanningCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                  <span className="size-1.5 rounded-full bg-red-500" />
                  미컨펌 기획서 {data.pendingPlanningCount}건
                </span>
              )}
              {data.pendingContentCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                  <span className="size-1.5 rounded-full bg-red-500" />
                  미승인 콘텐츠 {data.pendingContentCount}건
                </span>
              )}
            </div>
          </div>

          {/* 통합 리스트 */}
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
              <InboxIcon className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">현재 표시할 항목이 없습니다</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {tasks.map((task) => {
                const isConfirmable =
                  task.status === "기획완료" || task.status === "수정완료" || task.status === "제작완료"
                return (
                  <TaskListItem
                    key={task.id}
                    id={task.id}
                    status={task.status}
                    title={task.title}
                    sprintInfo={task.sprintInfo}
                    builder={task.builder}
                    href={task.href}
                    showCheckbox={isConfirmMode && isConfirmable}
                    checked={selected.has(task.id)}
                    onCheckedChange={() => toggleItem(task.id)}
                  />
                )
              })}
            </div>
          )}
        </section>
      </div>

      {/* 플로팅 액션 바 */}
      {selected.size > 0 && (
        <div
          className="fixed bottom-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-[left] duration-200 ease-linear"
          style={{
            left: isMobile ? 0 : sidebarState === "collapsed"
              ? "calc(var(--sidebar-width-icon) + 1rem)"
              : "var(--sidebar-width)"
          }}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleAll}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span
                  className={cn(
                    "size-5 rounded border-2 flex items-center justify-center transition-all",
                    selected.size === confirmableItems.length
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40"
                  )}
                >
                  {selected.size === confirmableItems.length && (
                    <svg className="size-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                전체 선택
              </button>
              <span className="text-sm font-medium text-foreground">
                {selected.size}건 선택됨
              </span>
            </div>
            <Button size="sm" onClick={handleConfirmClick}>
              {selected.size}건 컨펌
            </Button>
          </div>
        </div>
      )}

      {/* 컨펌 모달 */}
      <ConfirmModal
        open={showPlanningModal}
        onOpenChange={setShowPlanningModal}
        title={`기획서 컨펌 (${selectedPlanning.length}건)`}
        description="선택한 기획서를 컨펌하시겠습니까?"
        items={selectedPlanning.map((t) => ({ id: t.id, title: t.title }))}
        onConfirm={handleConfirm}
        confirmText="전체 승인"
        cancelText="취소"
      />
      <ConfirmModal
        open={showContentModal}
        onOpenChange={setShowContentModal}
        title={`콘텐츠 컨펌 (${selectedContent.length}건)`}
        description="선택한 콘텐츠를 승인하시겠습니까?"
        items={selectedContent.map((t) => ({ id: t.id, title: t.title }))}
        onConfirm={handleConfirm}
        confirmText="전체 승인"
        cancelText="취소"
      />
      <ConfirmModal
        open={showCombinedModal}
        onOpenChange={setShowCombinedModal}
        title={`전체 컨펌 (${selected.size}건)`}
        description={`기획서 ${selectedPlanning.length}건, 콘텐츠 ${selectedContent.length}건을 컨펌하시겠습니까?`}
        items={[...selectedPlanning, ...selectedContent].map((t) => ({ id: t.id, title: t.title }))}
        onConfirm={handleConfirm}
        confirmText="전체 승인"
        cancelText="취소"
      />
    </>
  )
}
