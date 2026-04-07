"use client"

import Link from "next/link"
import { StatusBadge, type StatusType } from "./status-badge"
import { cn } from "@/lib/utils"

export interface TaskListItemProps {
  id: string
  status: StatusType
  title: string
  sprintInfo: string
  builder: string
  href?: string
  showCheckbox?: boolean
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

export function TaskListItem({
  id,
  status,
  title,
  sprintInfo,
  builder,
  href = "#",
  showCheckbox = false,
  checked = false,
  onCheckedChange,
  className,
}: TaskListItemProps) {
  return (
    <div
      className={cn(
        "group relative flex items-stretch rounded-lg border border-border bg-card transition-all",
        "hover:border-primary/50 hover:bg-card/80",
        checked && "border-primary/30 bg-primary/5",
        className
      )}
    >
      {showCheckbox && (
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onCheckedChange?.(!checked)
          }}
          className={cn(
            "shrink-0 flex items-center pl-4",
          )}
        >
          <span
            className={cn(
              "size-5 rounded border-2 transition-all flex items-center justify-center",
              checked
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground/40 hover:border-primary"
            )}
          >
            {checked && (
              <svg className="size-3" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        </button>
      )}

      <Link
        href={href}
        className={cn(
          "flex-1 min-w-0 px-4 py-3",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:rounded-md"
        )}
      >
        {/* Desktop: 1행 */}
        <div className="hidden sm:flex items-center gap-3">
          <StatusBadge status={status} className="shrink-0" />
          <span className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">
            {title}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">{sprintInfo}</span>
          <span className="shrink-0 text-xs text-muted-foreground w-20 text-right">{builder}</span>
        </div>

        {/* Mobile: 2행 */}
        <div className="flex flex-col gap-1 sm:hidden">
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            <span className="text-xs text-muted-foreground">{sprintInfo}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-foreground truncate">{title}</span>
            <span className="shrink-0 text-xs text-muted-foreground">{builder}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
