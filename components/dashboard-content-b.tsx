"use client"

import * as React from "react"
import { InboxIcon } from "lucide-react"
import { TaskCard, type TaskCardProps } from "./task-card"
import { StatusBadge, type StatusType } from "./status-badge"
import { ConfirmModal } from "./confirm-modal"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { useSimulatedDate } from "@/lib/simulated-date-context"
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

export function DashboardContentB() {
  const { todayStr } = useSimulatedDate()
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
    // 컨펌 윈도우 밖: 업로드 대기/완료 표시
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
    // 컨펌 윈도우 밖: 업로드 완료 표시
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

  // -- 상태 관리 (컨펌 액션용) --
  const [planningState, setPlanningState] = React.useState(planningTasks)
  const [contentState, setContentState] = React.useState(contentTasks)

  React.useEffect(() => {
    setPlanningState(planningTasks)
    setContentState(contentTasks)
  }, [planningTasks, contentTasks])

  const unconfirmedPlanning = planningState.filter(
    (t) => t.status === "기획완료" || t.status === "수정완료"
  )
  const unconfirmedContent = contentState.filter((t) => t.status === "제작완료")

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

  // 컨펌 핸들러
  const handlePlanningConfirmAll = (taskIds: string[]) => {
    setPlanningState((prev) =>
      prev.map((t) => taskIds.includes(t.id) ? { ...t, status: "최종 확정" as StatusType } : t)
    )
  }
  const handleContentConfirmAll = (taskIds: string[]) => {
    setContentState((prev) =>
      prev.map((t) => taskIds.includes(t.id) ? { ...t, status: "승인완료" as StatusType } : t)
    )
  }

  // 컨펌 모달
  const [showPlanningModal, setShowPlanningModal] = React.useState(false)
  const [showContentModal, setShowContentModal] = React.useState(false)

  return (
    <>
      <div className="space-y-8">
        {/* 기획서 섹션 */}
        <section className="space-y-4">
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
                  {getNextPlanningDelivery(todayStr)} 기획서 전달 예정
                </span>
              )}
              {/* 미컨펌 건수 뱃지 */}
              {data.pendingPlanningCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                  <span className="size-1.5 rounded-full bg-red-500" />
                  미컨펌 {data.pendingPlanningCount}건
                </span>
              )}
            </div>
            {hasPlanningConfirm && (
              <Button
                size="sm"
                onClick={() => setShowPlanningModal(true)}
                disabled={unconfirmedPlanning.length === 0}
                className="hidden sm:flex"
              >
                기획서 전체 컨펌
              </Button>
            )}
          </div>

          {planningState.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
              <InboxIcon className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">현재 표시할 항목이 없습니다</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {planningState.map((task) => (
                  <TaskCard key={task.id} {...task} />
                ))}
              </div>

              {/* Mobile confirm button - below cards */}
              <Button
                size="sm"
                onClick={() => setShowPlanningModal(true)}
                disabled={unconfirmedPlanning.length === 0}
                className="w-full sm:hidden"
              >
                기획서 전체 컨펌
              </Button>
            </>
          )}

          <ConfirmModal
            open={showPlanningModal}
            onOpenChange={setShowPlanningModal}
            title="기획서 전체 컨펌"
            description="전체 컨펌하시겠습니까?"
            items={unconfirmedPlanning.map((t) => ({ id: t.id, title: t.title }))}
            onConfirm={() => {
              handlePlanningConfirmAll(unconfirmedPlanning.map((t) => t.id))
              setShowPlanningModal(false)
              toast.success("모든 기획서가 컨펌되었습니다.")
            }}
            confirmText="전체 승인"
            cancelText="취소"
          />
        </section>

        <Separator />

        {/* 콘텐츠 섹션 */}
        <section className="space-y-4">
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
                  {getNextContentDelivery(todayStr)} 콘텐츠 전달 예정
                </span>
              )}
              {/* 미승인 건수 뱃지 */}
              {data.pendingContentCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                  <span className="size-1.5 rounded-full bg-red-500" />
                  미승인 {data.pendingContentCount}건
                </span>
              )}
            </div>
            {hasContentConfirm && (
              <Button
                size="sm"
                onClick={() => setShowContentModal(true)}
                disabled={unconfirmedContent.length === 0}
                className="hidden sm:flex"
              >
                콘텐츠 전체 컨펌
              </Button>
            )}
          </div>

          {contentState.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
              <InboxIcon className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">현재 표시할 항목이 없습니다</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {contentState.map((task) => (
                  <TaskCard key={task.id} {...task} />
                ))}
              </div>

              {/* Mobile confirm button - below cards */}
              <Button
                size="sm"
                onClick={() => setShowContentModal(true)}
                disabled={unconfirmedContent.length === 0}
                className="w-full sm:hidden"
              >
                콘텐츠 전체 컨펌
              </Button>
            </>
          )}

          <ConfirmModal
            open={showContentModal}
            onOpenChange={setShowContentModal}
            title="콘텐츠 전체 컨펌"
            description="전체 승인하시겠습니까?"
            items={unconfirmedContent.map((t) => ({ id: t.id, title: t.title }))}
            onConfirm={() => {
              handleContentConfirmAll(unconfirmedContent.map((t) => t.id))
              setShowContentModal(false)
              toast.success("모든 콘텐츠가 승인되었습니다.")
            }}
            confirmText="전체 승인"
            cancelText="취소"
          />
        </section>
      </div>

    </>
  )
}
