"use client"

import * as React from "react"
import { TaskSection } from "./task-section"
import { Separator } from "@/components/ui/separator"
import type { TaskCardProps } from "./task-card"
import type { StatusType } from "./status-badge"
import { useSimulatedDate } from "@/lib/simulated-date-context"
import {
  getVisiblePlanningItems,
  getVisibleContentItems,
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

export function DashboardContent() {
  const { todayStr } = useSimulatedDate()
  const currentSprint = getSprintForDate(todayStr)
  const dashData = React.useMemo(() => getDashboardItems(todayStr), [todayStr])

  // Compute visible items based on sprint pipeline + simulated date
  const contentConfirmItems = React.useMemo(() => {
    return getVisibleContentItems(todayStr).map((c): TaskCardProps => ({
      id: c.id,
      status: "제작완료" as StatusType,
      title: c.title,
      sprintInfo: `→ Sp.${c.sprint} 업로드`,
      builder: c.designerName,
      builderLabel: "파트너",
      href: `/content/${c.id}`,
    }))
  }, [todayStr])

  const planningConfirmItems = React.useMemo(() => {
    return getVisiblePlanningItems(todayStr).map((c): TaskCardProps => ({
      id: c.id,
      status: "기획완료" as StatusType,
      title: c.title,
      sprintInfo: `→ Sp.${c.sprint} 제작`,
      builder: c.builderName,
      href: `/planning/${c.id}`,
    }))
  }, [todayStr])

  // Compute deadlines from the visible items' sprint windows
  const contentDeadline = React.useMemo(() => {
    const items = getVisibleContentItems(todayStr)
    if (items.length === 0) return ""
    const w = getContentConfirmWindow(items[0].sprint)
    return w ? formatDeadline(w.end, "12:00") : ""
  }, [todayStr])

  const planningDeadline = React.useMemo(() => {
    const items = getVisiblePlanningItems(todayStr)
    if (items.length === 0) return ""
    const w = getPlanningConfirmWindow(items[0].sprint)
    return w ? formatDeadline(w.end, "15:00") : ""
  }, [todayStr])

  // State for overriding statuses (after user actions)
  const [contentTasks, setContentTasks] = React.useState(contentConfirmItems)
  const [planningTasks, setPlanningTasks] = React.useState(planningConfirmItems)

  // Sync when simulated date changes
  React.useEffect(() => {
    setContentTasks(contentConfirmItems)
    setPlanningTasks(planningConfirmItems)
  }, [contentConfirmItems, planningConfirmItems])


  // Compute subtitle sprints
  const contentSubtitle = contentConfirmItems.length > 0
    ? `→ Sp.${getVisibleContentItems(todayStr)[0]?.sprint} 업로드 예정`
    : ""
  const planningSubtitle = planningConfirmItems.length > 0
    ? `→ Sp.${getVisiblePlanningItems(todayStr)[0]?.sprint} 제작용`
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
