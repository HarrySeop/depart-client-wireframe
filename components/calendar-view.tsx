"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Instagram } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSimulatedDate } from "@/lib/simulated-date-context"
import { allContents, sprints as sprintDefs, computeClientStatus } from "@/lib/mock-data/contents"

// Event types with colors
const eventColors = {
  "기획완료": "#5f86fb",
  "수정 요청": "#dd3d2e",
  "제작중": "#949494",
  "제작완료": "#8575e5",
  "업로드 대기": "#e49e28",
  "업로드 완료": "#59b160",
  "수정 요청(이월)": "#dd3d2e",
} as const

type EventType = keyof typeof eventColors

interface CalendarEvent {
  id: string
  date: string
  type: EventType
  title: string
  time?: string
  href?: string
  platform?: string
  uploadTime?: string
  sprint?: string
}

// Events and sprints are now dynamically generated from allContents + computeClientStatus

import { WEEKDAYS, formatDate, isInSprint, getSprintForDate, getMonthDays } from "@/lib/calendar-utils"

// --- Event Card (2-3 lines) ---
function EventCard({ event }: { event: CalendarEvent }) {
  const color = eventColors[event.type]
  const isUpload = event.type === "업로드 대기" || event.type === "업로드 완료"
  const shortTitle = event.title.length > 20 ? event.title.slice(0, 20) + "…" : event.title

  const cardContent = (
    <div
      className="rounded-md px-1.5 py-1 text-[11px] leading-tight cursor-pointer transition-opacity hover:opacity-80 space-y-0.5 border-l-2"
      style={{ borderLeftColor: color }}
    >
      {/* Line 1: Title */}
      <p className="font-medium truncate text-foreground/90">{shortTitle}</p>
      {/* Line 2: Status badge (left) + Sprint (right) */}
      <div className="flex items-center justify-between gap-1">
        <span
          className="inline-flex items-center rounded-full px-1.5 py-px text-[10px] font-medium truncate"
          style={{ color, backgroundColor: `${color}20` }}
        >
          {event.type}
        </span>
        {event.sprint && (
          <span className="text-[10px] text-muted-foreground shrink-0">{event.sprint}</span>
        )}
      </div>
    </div>
  )

  // Upload events → popover (keep existing design)
  if (isUpload) {
    return (
      <Popover>
        <PopoverTrigger asChild>{cardContent}</PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="font-medium text-sm" style={{ color }}>{event.type}</span>
            </div>
            <p className="text-sm text-foreground">{event.title}</p>
            {event.platform && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Instagram className="size-3" />
                <span>{event.platform}</span>
                {event.uploadTime && <span>· {event.uploadTime}</span>}
              </div>
            )}
            {event.sprint && (
              <p className="text-xs text-muted-foreground">{event.sprint}</p>
            )}
            <div className="flex gap-2 pt-2 border-t border-border mt-2">
              <Link href={`/planning/${event.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs h-7">기획서 보기</Button>
              </Link>
              <Link href={`/content/${event.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs h-7">콘텐츠 보기</Button>
              </Link>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  // Non-upload events with href → link to detail page
  if (event.href) {
    return <Link href={event.href}>{cardContent}</Link>
  }

  return cardContent
}

// --- Compact event for mobile (single line) ---
function EventDot({ event }: { event: CalendarEvent }) {
  const color = eventColors[event.type]
  return (
    <span
      className="size-1.5 rounded-full shrink-0"
      style={{ backgroundColor: color }}
      title={event.title}
    />
  )
}

// --- Mobile inline event card (collapsed) ---
function MobileEventCard({
  event,
  isExpanded,
  onToggle,
}: {
  event: CalendarEvent
  isExpanded: boolean
  onToggle: () => void
}) {
  const color = eventColors[event.type]
  const isUpload = event.type === "업로드 대기" || event.type === "업로드 완료"

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Collapsed header — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-muted/50 transition-colors"
      >
        <span
          className="size-2 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm font-medium truncate flex-1">{event.title}</span>
        <span
          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
          style={{ color, backgroundColor: `${color}15` }}
        >
          {event.type}
        </span>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-0 space-y-2 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
            {event.sprint && <span>{event.sprint}</span>}
            {event.platform && (
              <span className="flex items-center gap-1">
                <Instagram className="size-3" />
                {event.platform}
                {event.uploadTime && <span>· {event.uploadTime}</span>}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {isUpload || event.href ? (
              <>
                <Link href={`/planning/${event.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">기획서 보기</Button>
                </Link>
                <Link href={`/content/${event.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">콘텐츠 보기</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href={`/planning/${event.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">기획서 보기</Button>
                </Link>
                <Link href={`/content/${event.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">콘텐츠 보기</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// --- Day cell ---
function DayCell({
  date,
  isCurrentMonth,
  dayEvents,
  compact = false,
  todayStr,
}: {
  date: Date
  isCurrentMonth: boolean
  dayEvents: CalendarEvent[]
  compact?: boolean
  todayStr: string
}) {
  const today = formatDate(date) === todayStr
  const inCurrentSprint = isInSprint(date, todayStr)
  const dayOfWeek = (date.getDay() || 7) - 1
  const isMonday = dayOfWeek === 0
  const sprint = isMonday ? getSprintForDate(date) : undefined

  return (
    <div
      className={cn(
        "p-1 border-r border-b border-border last:border-r-0 flex flex-col",
        !isCurrentMonth && "bg-muted/20",
        inCurrentSprint && isCurrentMonth && "bg-primary/[0.04]",
        compact ? "min-h-[80px]" : "min-h-[110px]"
      )}
    >
      <div className="flex items-center justify-between mb-0.5">
        <div
          className={cn(
            "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full shrink-0",
            today && "bg-primary text-primary-foreground",
            !today && dayOfWeek === 5 && "text-blue-600",
            !today && dayOfWeek === 6 && "text-red-500",
            !today && !isCurrentMonth && "text-muted-foreground"
          )}
        >
          {date.getDate()}
        </div>
        {isMonday && sprint && (
          <span
            className={cn(
              "text-xs text-foreground",
              inCurrentSprint && isCurrentMonth && "text-primary font-medium"
            )}
          >
            S.{sprint.id}
          </span>
        )}
      </div>

      {compact ? (
        /* Mobile: show dots for events */
        <div className="flex flex-wrap gap-0.5 mt-0.5">
          {dayEvents.slice(0, 4).map((ev) => (
            <EventDot key={ev.id} event={ev} />
          ))}
          {dayEvents.length > 4 && (
            <span className="text-[9px] text-muted-foreground">+{dayEvents.length - 4}</span>
          )}
        </div>
      ) : (
        /* Desktop: show 2-3 line cards */
        <div className="space-y-0.5 flex-1 overflow-hidden">
          {dayEvents.slice(0, 2).map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
          {dayEvents.length > 2 && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 w-full text-left">
                  +{dayEvents.length - 2}개 더보기
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-2">
                <div className="font-medium text-sm mb-2">
                  {date.getMonth() + 1}월 {date.getDate()}일
                </div>
                <div className="space-y-1 max-h-64 overflow-auto">
                  {dayEvents.map((ev) => (
                    <EventCard key={ev.id} event={ev} />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}
    </div>
  )
}

// --- Mobile day cell (tappable, no popover) ---
function MobileDayCell({
  date,
  dayEvents,
  isCurrentMonth,
  todayStr,
  isSelected,
  onSelect,
}: {
  date: Date
  dayEvents: CalendarEvent[]
  isCurrentMonth: boolean
  todayStr: string
  isSelected: boolean
  onSelect: () => void
}) {
  const today = formatDate(date) === todayStr
  const inCurrentSprint = isInSprint(date, todayStr)
  const dayOfWeek = (date.getDay() || 7) - 1
  const isMonday = dayOfWeek === 0
  const sprint = isMonday ? getSprintForDate(date) : undefined

  return (
    <div
      onClick={dayEvents.length > 0 ? onSelect : undefined}
      className={cn(
        "p-1 border-r border-b border-border flex flex-col min-h-[80px]",
        !isCurrentMonth && "bg-muted/20",
        inCurrentSprint && isCurrentMonth && "bg-primary/[0.04]",
        isSelected && "bg-primary/10 ring-1 ring-inset ring-primary/30",
        dayEvents.length > 0 && "cursor-pointer"
      )}
    >
      <div
        className={cn(
          "text-xs font-medium mb-0.5 w-6 h-6 flex items-center justify-center rounded-full shrink-0",
          today && "bg-primary text-primary-foreground",
          !today && dayOfWeek === 5 && "text-blue-600",
          !today && dayOfWeek === 6 && "text-red-500",
          !today && !isCurrentMonth && "text-muted-foreground"
        )}
      >
        {date.getDate()}
      </div>
      <div className="flex flex-wrap gap-0.5 mt-0.5">
        {dayEvents.slice(0, 4).map((ev) => (
          <EventDot key={ev.id} event={ev} />
        ))}
        {dayEvents.length > 4 && (
          <span className="text-[9px] text-muted-foreground">+{dayEvents.length - 4}</span>
        )}
      </div>
      {isMonday && sprint && (
        <span
          className={cn(
            "mt-auto text-[10px] text-foreground",
            inCurrentSprint && isCurrentMonth && "text-primary font-medium"
          )}
        >
          S.{sprint.id}
        </span>
      )}
    </div>
  )
}

export function CalendarView() {
  const { today, todayStr } = useSimulatedDate()
  const [currentDate, setCurrentDate] = React.useState(today)
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [expandedEventId, setExpandedEventId] = React.useState<string | null>(null)

  // Sync when simulated date changes
  React.useEffect(() => { setCurrentDate(today) }, [today])

  const goToPrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  const goToToday = () => setCurrentDate(today)

  // Generate events from content data (카드 위치는 항상 publishedAt 고정)
  const dynamicEvents: CalendarEvent[] = React.useMemo(() => {
    return allContents.map((c) => {
      const status = computeClientStatus(c, todayStr)
      let eventType: EventType = "기획완료"

      if (status === "업로드 완료") eventType = "업로드 완료"
      else if (status === "업로드 대기") eventType = "업로드 대기"
      else if (status === "수정 요청") eventType = "수정 요청"
      else if (status === "수정완료") eventType = "제작완료"
      else if (status === "제작완료") eventType = "제작완료"
      else if (status === "제작중") eventType = "제작중"
      else if (status === "기획완료") eventType = "기획완료"

      return {
        id: c.id,
        date: c.publishedAt,
        type: eventType,
        title: c.title,
        sprint: `Sp.${c.sprint}`,
        href: status === "기획완료" ? `/planning/${c.id}` : (status === "제작완료" || status === "수정 요청" || status === "수정완료") ? `/content/${c.id}` : undefined,
      }
    })
  }, [todayStr])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthDays = getMonthDays(year, month)

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date)
    return dynamicEvents.filter((e) => e.date === dateStr)
  }

  const weeks = Array.from({ length: Math.ceil(monthDays.length / 7) }, (_, i) =>
    monthDays.slice(i * 7, (i + 1) * 7)
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={goToPrevMonth} className="size-8">
            <ChevronLeft className="size-4" />
          </Button>
          <h2 className="text-lg font-semibold min-w-[120px] text-center">
            {year}년 {month + 1}월
          </h2>
          <Button variant="ghost" size="icon" onClick={goToNextMonth} className="size-8">
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={goToToday}>
          오늘
        </Button>
      </div>

      {/* Sprint legend */}
      {(() => {
        const currentSprint = sprintDefs.find((s) => todayStr >= s.startDate && todayStr <= s.endDate)
        return (
          <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-3 rounded bg-primary/10 border border-primary/20" />
              <span>현재 스프린트{currentSprint ? ` (Sprint ${currentSprint.id})` : ""}</span>
            </div>
          </div>
        )
      })()}

      {/* Calendar grid */}
      <div className="flex-1 border border-border rounded-lg overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {WEEKDAYS.map((day, i) => (
            <div
              key={day}
              className={cn(
                "py-2 text-center text-xs font-medium text-muted-foreground",
                i === 5 && "text-blue-600",
                i === 6 && "text-red-500"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Desktop: Month view */}
        <div className="hidden md:block">
          {weeks.map((weekDays, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {weekDays.map(({ date, isCurrentMonth }, di) => (
                <DayCell
                  key={di}
                  date={date}
                  isCurrentMonth={isCurrentMonth}
                  dayEvents={getEventsForDate(date)}
                  todayStr={todayStr}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Mobile: Month view with dot indicators + inline expansion */}
        <div className="md:hidden">
          {weeks.map((weekDays, wi) => {
            const selectedInThisWeek = weekDays.find(
              ({ date }) => formatDate(date) === selectedDate
            )
            const selectedDayEvents = selectedInThisWeek
              ? getEventsForDate(selectedInThisWeek.date)
              : []

            return (
              <React.Fragment key={wi}>
                <div className="grid grid-cols-7">
                  {weekDays.map(({ date, isCurrentMonth }, di) => {
                    const dateStr = formatDate(date)
                    return (
                      <MobileDayCell
                        key={di}
                        date={date}
                        isCurrentMonth={isCurrentMonth}
                        dayEvents={getEventsForDate(date)}
                        todayStr={todayStr}
                        isSelected={dateStr === selectedDate}
                        onSelect={() => {
                          if (selectedDate === dateStr) {
                            setSelectedDate(null)
                            setExpandedEventId(null)
                          } else {
                            setSelectedDate(dateStr)
                            setExpandedEventId(null)
                          }
                        }}
                      />
                    )
                  })}
                </div>
                {/* Inline expansion panel for selected date */}
                {selectedInThisWeek && selectedDayEvents.length > 0 && (
                  <div className="border-b border-border bg-muted/30 px-3 py-3 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      {selectedInThisWeek.date.getMonth() + 1}월 {selectedInThisWeek.date.getDate()}일
                    </p>
                    {selectedDayEvents.map((ev) => (
                      <MobileEventCard
                        key={ev.id}
                        event={ev}
                        isExpanded={expandedEventId === ev.id}
                        onToggle={() =>
                          setExpandedEventId((prev) => (prev === ev.id ? null : ev.id))
                        }
                      />
                    ))}
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Event legend */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
        {Object.entries(eventColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-muted-foreground">{type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
