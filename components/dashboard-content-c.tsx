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
  getNextDeliveryBadge,
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

export function DashboardContentC() {
  const { todayStr } = useSimulatedDate()
  const { state: sidebarState, isMobile } = useSidebar()
  const currentSprint = getSprintForDate(todayStr)

  const data = React.useMemo(() => getDashboardItems(todayStr), [todayStr])

  const hasPlanningConfirm = data.planningConfirm.length > 0
  const hasContentConfirm = data.contentConfirm.length > 0

  // -- 기획서 섹션 데이터 --
  const planningTasks = React.useMemo((): TaskCardProps[] => {
    if (hasPlanningConfirm) {
      return data.planningConfirm.map((c) => ({
        id: c.id,
        status: "기획완료" as StatusType,
        title: c.title,
        sprintInfo: `→ Sp.${c.sprint} 제작`,
        builder: c.builderName,
        href: `/planning/${c.id}`,
      }))
    }
    return [
      ...data.uploadPending.map((c) => ({
        id: c.id,
        status: "업로드 대기" as StatusType,
        title: c.title,
        sprintInfo: `Sp.${c.sprint}`,
        builder: c.designerName,
        builderLabel: "파트너",
        href: `/content/${c.id}`,
      })),
    ]
  }, [data, hasPlanningConfirm])

  // -- 콘텐츠 섹션 데이터 --
  const contentTasks = React.useMemo((): TaskCardProps[] => {
    if (hasContentConfirm) {
      return data.contentConfirm.map((c) => ({
        id: c.id,
        status: "제작완료" as StatusType,
        title: c.title,
        sprintInfo: `→ Sp.${c.sprint} 업로드`,
        builder: c.designerName,
        builderLabel: "파트너",
        href: `/content/${c.id}`,
      }))
    }
    return [
      ...data.uploadComplete.slice(0, 6).map((c) => ({
        id: c.id,
        status: "업로드 완료" as StatusType,
        title: c.title,
        sprintInfo: `Sp.${c.sprint}`,
        builder: c.designerName,
        builderLabel: "파트너",
        href: `/content/${c.id}`,
      })),
    ]
  }, [data, hasContentConfirm])

  // -- 상태 관리 --
  const [planningState, setPlanningState] = React.useState(planningTasks)
  const [contentState, setContentState] = React.useState(contentTasks)

  React.useEffect(() => {
    setPlanningState(planningTasks)
    setContentState(contentTasks)
  }, [planningTasks, contentTasks])

  // -- 체크박스 선택 상태 --
  const [selectedPlanning, setSelectedPlanning] = React.useState<Set<string>>(new Set())
  const [selectedContent, setSelectedContent] = React.useState<Set<string>>(new Set())

  // 컨펌 가능한 항목만 필터
  const unconfirmedPlanning = planningState.filter(
    (t) => t.status === "기획완료" || t.status === "수정완료"
  )
  const unconfirmedContent = contentState.filter((t) => t.status === "제작완료")

  // 선택 상태가 데이터 변경 시 초기화
  React.useEffect(() => {
    setSelectedPlanning(new Set())
    setSelectedContent(new Set())
  }, [planningTasks, contentTasks])

  // 마감 정보
  const planningDeadline = React.useMemo(() => {
    if (!hasPlanningConfirm || data.planningConfirm.length === 0) return ""
    const w = getPlanningConfirmWindow(data.planningConfirm[0].sprint)
    return w ? formatDeadline(w.end, "15:00") : ""
  }, [data, hasPlanningConfirm])

  const contentDeadline = React.useMemo(() => {
    if (!hasContentConfirm || data.contentConfirm.length === 0) return ""
    const w = getContentConfirmWindow(data.contentConfirm[0].sprint)
    return w ? formatDeadline(w.end, "12:00") : ""
  }, [data, hasContentConfirm])

  const planningSubtitle = hasPlanningConfirm && data.planningConfirm.length > 0
    ? `→ Sp.${data.planningConfirm[0].sprint} 제작용`
    : ""
  const contentSubtitle = hasContentConfirm && data.contentConfirm.length > 0
    ? `→ Sp.${data.contentConfirm[0].sprint} 업로드 예정`
    : ""

  // -- 체크박스 핸들러 --
  const togglePlanningItem = (id: string) => {
    setSelectedPlanning((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleContentItem = (id: string) => {
    setSelectedContent((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAllPlanning = () => {
    if (selectedPlanning.size === unconfirmedPlanning.length) {
      setSelectedPlanning(new Set())
    } else {
      setSelectedPlanning(new Set(unconfirmedPlanning.map((t) => t.id)))
    }
  }

  const toggleAllContent = () => {
    if (selectedContent.size === unconfirmedContent.length) {
      setSelectedContent(new Set())
    } else {
      setSelectedContent(new Set(unconfirmedContent.map((t) => t.id)))
    }
  }

  // -- 컨펌 핸들러 --
  const [showPlanningModal, setShowPlanningModal] = React.useState(false)
  const [showContentModal, setShowContentModal] = React.useState(false)

  const handlePlanningConfirm = () => {
    const ids = Array.from(selectedPlanning)
    setPlanningState((prev) =>
      prev.map((t) => ids.includes(t.id) ? { ...t, status: "최종 확정" as StatusType } : t)
    )
    setSelectedPlanning(new Set())
    setShowPlanningModal(false)
    toast.success(`${ids.length}건의 기획서가 컨펌되었습니다.`)
  }

  const handleContentConfirm = () => {
    const ids = Array.from(selectedContent)
    setContentState((prev) =>
      prev.map((t) => ids.includes(t.id) ? { ...t, status: "승인완료" as StatusType } : t)
    )
    setSelectedContent(new Set())
    setShowContentModal(false)
    toast.success(`${ids.length}건의 콘텐츠가 승인되었습니다.`)
  }

  // 플로팅 바 표시 여부
  const totalSelected = selectedPlanning.size + selectedContent.size
  const showFloatingBar = totalSelected > 0

  return (
    <>
      <div className={cn("space-y-8", showFloatingBar ? "pb-28" : "pb-4")}>
        {/* 기획서 섹션 */}
        <section className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                {hasPlanningConfirm ? "기획서 컨펌" : "업로드 현황"}
              </h2>
              {planningSubtitle && (
                <span className="text-sm text-muted-foreground">{planningSubtitle}</span>
              )}
              {hasPlanningConfirm && planningDeadline && (
                <span className="inline-flex items-center gap-1 text-sm font-bold text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                  <span className="size-1.5 rounded-full bg-orange-500 animate-pulse" />
                  마감: {planningDeadline}
                </span>
              )}
              {!hasPlanningConfirm && (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                  {getNextDeliveryBadge(data.deliveredPlanningCount, data.totalPlanningCount, data.planningDeliveryDate) || "빌더 완성 시 전달됩니다"}
                </span>
              )}
              {data.pendingPlanningCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                  <span className="size-1.5 rounded-full bg-red-500" />
                  미컨펌 {data.pendingPlanningCount}건
                </span>
              )}
            </div>
          </div>

          {planningState.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
              <InboxIcon className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">현재 표시할 항목이 없습니다</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {planningState.map((task) => (
                <TaskListItem
                  key={task.id}
                  {...task}
                  showCheckbox={hasPlanningConfirm && (task.status === "기획완료" || task.status === "수정완료")}
                  checked={selectedPlanning.has(task.id)}
                  onCheckedChange={() => togglePlanningItem(task.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 콘텐츠 섹션 */}
        <section className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                {hasContentConfirm ? "콘텐츠 컨펌" : "최근 업로드"}
              </h2>
              {contentSubtitle && (
                <span className="text-sm text-muted-foreground">{contentSubtitle}</span>
              )}
              {hasContentConfirm && contentDeadline && (
                <span className="inline-flex items-center gap-1 text-sm font-bold text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                  <span className="size-1.5 rounded-full bg-orange-500 animate-pulse" />
                  마감: {contentDeadline}
                </span>
              )}
              {!hasContentConfirm && (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                  {getNextDeliveryBadge(data.deliveredContentCount, data.totalContentCount, data.contentDeliveryDate) || "빌더 완성 시 전달됩니다"}
                </span>
              )}
              {data.pendingContentCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                  <span className="size-1.5 rounded-full bg-red-500" />
                  미승인 {data.pendingContentCount}건
                </span>
              )}
            </div>
          </div>

          {contentState.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
              <InboxIcon className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">현재 표시할 항목이 없습니다</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {contentState.map((task) => (
                <TaskListItem
                  key={task.id}
                  {...task}
                  showCheckbox={hasContentConfirm && task.status === "제작완료"}
                  checked={selectedContent.has(task.id)}
                  onCheckedChange={() => toggleContentItem(task.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 플로팅 액션 바 */}
      {showFloatingBar && (
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
              {/* 전체 선택 토글 */}
              <button
                type="button"
                onClick={() => {
                  if (hasPlanningConfirm) toggleAllPlanning()
                  if (hasContentConfirm) toggleAllContent()
                }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span
                  className={cn(
                    "size-5 rounded border-2 flex items-center justify-center transition-all",
                    totalSelected === unconfirmedPlanning.length + unconfirmedContent.length
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40"
                  )}
                >
                  {totalSelected === unconfirmedPlanning.length + unconfirmedContent.length && (
                    <svg className="size-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                전체 선택
              </button>
              <span className="text-sm font-medium text-foreground">
                {totalSelected}건 선택됨
              </span>
            </div>
            <div className="flex gap-2">
              {selectedPlanning.size > 0 && (
                <Button
                  size="sm"
                  onClick={() => setShowPlanningModal(true)}
                >
                  기획서 {selectedPlanning.size}건 컨펌
                </Button>
              )}
              {selectedContent.size > 0 && (
                <Button
                  size="sm"
                  onClick={() => setShowContentModal(true)}
                >
                  콘텐츠 {selectedContent.size}건 컨펌
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 컨펌 모달 */}
      <ConfirmModal
        open={showPlanningModal}
        onOpenChange={setShowPlanningModal}
        title={`기획서 컨펌 (${selectedPlanning.size}건)`}
        description="선택한 항목을 컨펌하시겠습니까?"
        items={planningState
          .filter((t) => selectedPlanning.has(t.id))
          .map((t) => ({ id: t.id, title: t.title }))}
        onConfirm={handlePlanningConfirm}
        confirmText="전체 승인"
        cancelText="취소"
      />
      <ConfirmModal
        open={showContentModal}
        onOpenChange={setShowContentModal}
        title={`콘텐츠 컨펌 (${selectedContent.size}건)`}
        description="선택한 항목을 승인하시겠습니까?"
        items={contentState
          .filter((t) => selectedContent.has(t.id))
          .map((t) => ({ id: t.id, title: t.title }))}
        onConfirm={handleContentConfirm}
        confirmText="전체 승인"
        cancelText="취소"
      />
    </>
  )
}
