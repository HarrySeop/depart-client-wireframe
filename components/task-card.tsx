"use client"

import Link from "next/link"
import { StatusBadge, type StatusType } from "./status-badge"
import { cn } from "@/lib/utils"

export interface TaskCardProps {
  id: string
  status: StatusType
  title: string
  sprintInfo: string
  builder: string
  builderLabel?: string
  href?: string
  className?: string
}

export function TaskCard({
  id,
  status,
  title,
  sprintInfo,
  builder,
  builderLabel = "빌더",
  href = "#",
  className,
}: TaskCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-lg bg-card border border-border p-4 transition-all",
        "hover:border-primary/50 hover:bg-card/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <StatusBadge status={status} />
        </div>
        <h3 className="font-medium text-sm text-foreground line-clamp-2 leading-relaxed">
          {title}
        </h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{sprintInfo}</span>
          <span>{builderLabel}: {builder}</span>
        </div>
      </div>
    </Link>
  )
}
