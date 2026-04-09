"use client"

import * as React from "react"
import { InboxIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskCard, type TaskCardProps } from "./task-card"
import { ConfirmModal } from "./confirm-modal"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface TaskSectionProps {
  title: string
  subtitle: string
  deadline: string
  confirmButtonText: string
  tasks: TaskCardProps[]
  onConfirmAll: (taskIds: string[]) => void
  type: "content" | "planning"
  nextDelivery?: string
  className?: string
}

export function TaskSection({
  title,
  subtitle,
  deadline,
  confirmButtonText,
  tasks,
  onConfirmAll,
  type,
  nextDelivery,
  className,
}: TaskSectionProps) {
  const [showConfirmModal, setShowConfirmModal] = React.useState(false)

  // Filter unconfirmed tasks based on type
  const unconfirmedTasks = tasks.filter((task) => {
    if (type === "content") {
      return task.status === "제작완료"
    }
    return task.status === "기획완료" || task.status === "수정완료"
  })

  const handleConfirmAll = () => {
    onConfirmAll(unconfirmedTasks.map((t) => t.id))
    setShowConfirmModal(false)
    toast.success(
      type === "content"
        ? "모든 콘텐츠가 승인되었습니다."
        : "모든 기획서가 컨펌되었습니다."
    )
  }

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <span className="text-sm text-muted-foreground">{subtitle}</span>
          {tasks.length > 0 && deadline && (
            <span className="inline-flex items-center gap-1 text-sm font-bold text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
              <span className="size-1.5 rounded-full bg-orange-500 animate-pulse" />
              마감: {deadline}
            </span>
          )}
          {tasks.length === 0 && nextDelivery && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
              {nextDelivery}{type === "content" ? " 콘텐츠" : " 기획서"} 도착 예정
            </span>
          )}
        </div>
        <Button
          size="sm"
          onClick={() => setShowConfirmModal(true)}
          disabled={unconfirmedTasks.length === 0}
          className="hidden sm:flex"
        >
          {confirmButtonText}
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
          <InboxIcon className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {type === "content"
              ? "현재 컨펌할 콘텐츠가 없습니다"
              : "현재 컨펌할 기획서가 없습니다"}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            빌더 완성 시 전달됩니다
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} {...task} />
            ))}
          </div>

          {/* Mobile confirm button - below cards */}
          <Button
            size="sm"
            onClick={() => setShowConfirmModal(true)}
            disabled={unconfirmedTasks.length === 0}
            className="w-full sm:hidden"
          >
            {confirmButtonText}
          </Button>
        </>
      )}

      <ConfirmModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        title={type === "content" ? "콘텐츠 전체 컨펌" : "기획서 전체 컨펌"}
        description={
          type === "content"
            ? "전체 승인하시겠습니까?"
            : "전체 컨펌하시겠습니까?"
        }
        items={unconfirmedTasks.map((t) => ({ id: t.id, title: t.title }))}
        onConfirm={handleConfirmAll}
        confirmText="전체 승인"
        cancelText="취소"
      />
    </section>
  )
}
