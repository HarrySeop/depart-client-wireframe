"use client"

import * as React from "react"
import { TaskSection } from "./task-section"
import { Separator } from "@/components/ui/separator"
import type { TaskCardProps } from "./task-card"
import type { StatusType } from "./status-badge"
import { useSimulatedDate } from "@/lib/simulated-date-context"
import {
  allContents,
  computeClientStatus,
  getDashboardItems,
  getPlanningConfirmWindow,
  getContentConfirmWindow,
  getNextDeliveryBadge,
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

export function DashboardContent({ selectedSprint }: { selectedSprint: number }) {
  const { todayStr } = useSimulatedDate()
  const currentSprint = getSprintForDate(todayStr)
  const dashData = React.useMemo(() => getDashboardItems(todayStr), [todayStr])

  // Get all items for the selected sprint, grouped by computed status
  const sprintItems = React.useMemo(
    () => allContents.filter((c) => c.sprint === selectedSprint),
    [selectedSprint]
  )

  const contentConfirmItems = React.useMemo(() => {
    return sprintItems
      .filter((c) => {
        const s = computeClientStatus(c, todayStr)
        return s === "제작완료" || s === "수정 요청" || s === "수정완료"
      })
      .map((c): TaskCardProps => ({
        id: c.id,
        status: computeClientStatus(c, todayStr) as StatusType,
        title: c.title,
        sprintInfo: `→ Sp.${c.sprint} 업로드`,
        builder: c.designerName,
        builderLabel: "파트너",
        href: `/content/${c.id}`,
      }))
  }, [sprintItems, todayStr])

  const planningConfirmItems = React.useMemo(() => {
    return dashData.planningConfirm.map((c): TaskCardProps => ({
      id: c.id,
      status: "기획완료" as StatusType,
      title: c.title,
      sprintInfo: `→ Sp.${c.sprint} 제작`,
      builder: c.builderName,
      href: `/planning/${c.id}`,
    }))
  }, [dashData.planningConfirm])

  // Compute deadlines from the selected sprint's windows
  const contentDeadline = React.useMemo(() => {
    if (contentConfirmItems.length === 0) return ""
    const w = getContentConfirmWindow(selectedSprint)
    return w ? formatDeadline(w.end, "12:00") : ""
  }, [contentConfirmItems.length, selectedSprint])

  const planningDeadline = React.useMemo(() => {
    if (dashData.planningConfirm.length === 0) return ""
    const targetSprint = dashData.planningConfirm[0].sprint
    const w = getPlanningConfirmWindow(targetSprint)
    return w ? formatDeadline(w.end, "15:00") : ""
  }, [dashData.planningConfirm])

  // State for overriding statuses (after user actions)
  const [contentTasks, setContentTasks] = React.useState(contentConfirmItems)
  const [planningTasks, setPlanningTasks] = React.useState(planningConfirmItems)

  // Sync when simulated date or selected sprint changes
  React.useEffect(() => {
    setContentTasks(contentConfirmItems)
    setPlanningTasks(planningConfirmItems)
  }, [contentConfirmItems, planningConfirmItems])


  // Compute subtitle sprints
  const contentSubtitle = contentConfirmItems.length > 0
    ? `→ Sp.${selectedSprint} 업로드 예정`
    : ""
  const planningSubtitle = dashData.planningConfirm.length > 0
    ? `→ Sp.${dashData.planningConfirm[0].sprint} 제작용`
    : ""

  const handleContentConfirmAll = (taskIds: string[]) => {
    setContentTasks((prev) =>
      prev.map((task) =>
        taskIds.includes(task.id)
          ? { ...task, status: "승인완료" as StatusType }
          : task
      )
    )
  }

  const handlePlanningConfirmAll = (taskIds: string[]) => {
    setPlanningTasks((prev) =>
      prev.map((task) =>
        taskIds.includes(task.id)
          ? { ...task, status: "최종 확정" as StatusType }
          : task
      )
    )
  }


  return (
    <>
      <div className="space-y-8">
        <TaskSection
          title="기획서 컨펌"
          subtitle={planningSubtitle}
          deadline={planningDeadline}
          confirmButtonText="기획서 전체 컨펌"
          tasks={planningTasks}
          onConfirmAll={handlePlanningConfirmAll}
          type="planning"
          nextDelivery={getNextDeliveryBadge(dashData.deliveredPlanningCount, dashData.totalPlanningCount, dashData.planningDeliveryDate) || undefined}
        />

        <Separator />

        <TaskSection
          title="콘텐츠 컨펌"
          subtitle={contentSubtitle}
          deadline={contentDeadline}
          confirmButtonText="콘텐츠 전체 컨펌"
          tasks={contentTasks}
          onConfirmAll={handleContentConfirmAll}
          type="content"
          nextDelivery={getNextDeliveryBadge(dashData.deliveredContentCount, dashData.totalContentCount, dashData.contentDeliveryDate) || undefined}
        />
      </div>
    </>
  )
}
