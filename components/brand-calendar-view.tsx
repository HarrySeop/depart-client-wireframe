"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSimulatedDate } from "@/lib/simulated-date-context"
import { WEEKDAYS, formatDate, isInSprint, getSprintForDate, getMonthDays } from "@/lib/calendar-utils"
import { sprints as sprintDefs } from "@/lib/mock-data/contents"
import { initialBrandEvents, type BrandEvent } from "@/lib/mock-data/brand-calendar"
import { BrandEventDialog } from "@/components/brand-event-dialog"

const BRAND_COLOR = "#5f86fb"

type EventPosition = "single" | "start" | "middle" | "end"

// --- Event Card (all positions, all clickable) ---
function BrandEventCard({
  event,
  position,
  date,
  onDelete,
}: {
  event: BrandEvent
  position: EventPosition
  date: Date
  onDelete: (id: string) => void
}) {
  const shortTitle = event.title.length > 20 ? event.title.slice(0, 20) + "…" : event.title
  const sprint = getSprintForDate(date)

  let timeDisplay: string | undefined
  if (position === "single" || position === "start") {
    timeDisplay = event.startTime
  } else if (position === "end") {
    timeDisplay = event.endTime
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className="rounded-md px-1.5 py-1 text-[11px] leading-tight cursor-pointer transition-opacity hover:opacity-80 space-y-0.5 border-l-2"
          style={{ borderLeftColor: BRAND_COLOR, backgroundColor: `${BRAND_COLOR}10` }}
        >
          <p className="font-medium truncate text-foreground/90">{shortTitle}</p>
          <div className="flex items-center justify-between gap-1">
            {sprint && (
              <span className="text-[10px] text-muted-foreground">S.{sprint.id}</span>
            )}
            {timeDisplay && (
              <span className="text-[10px] text-muted-foreground shrink-0 ml-auto">{timeDisplay}</span>
            )}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">{event.title}</p>
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>
              {event.startDate === event.endDate
                ? event.startDate
                : `${event.startDate} ~ ${event.endDate}`}
            </p>
            {event.startTime && (
              <p>
                {event.startTime}
                {event.endTime ? ` ~ ${event.endTime}` : ""}
              </p>
            )}
            <p>{event.createdBy === "builder" ? "빌더" : "클라이언트"} 등록</p>
          </div>
          <div className="pt-2 border-t border-border mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs h-7 text-destructive hover:text-destructive"
              onClick={() => onDelete(event.id)}
            >
              <Trash2 className="size-3 mr-1" />
              삭제
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// --- Event Dot (mobile) ---
function BrandEventDot({ event }: { event: BrandEvent }) {
  return (
    <span
      className="size-1.5 rounded-full shrink-0"
      style={{ backgroundColor: BRAND_COLOR }}
      title={event.title}
    />
  )
}

// --- Mobile Event Card ---
function MobileBrandEventCard({
  event,
  date,
  isExpanded,
  onToggle,
  onDelete,
}: {
  event: BrandEvent
  date: Date
  isExpanded: boolean
  onToggle: () => void
  onDelete: (id: string) => void
}) {
  const sprint = getSprintForDate(date)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-muted/50 transition-colors"
      >
        <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: BRAND_COLOR }} />
        <span className="text-sm font-medium truncate flex-1">{event.title}</span>
        {sprint && (
          <span className="text-[10px] text-muted-foreground shrink-0">S.{sprint.id}</span>
        )}
      </button>
      {isExpanded && (
        <div className="px-3 pb-3 pt-0 space-y-2 border-t border-border">
          <div className="text-xs text-muted-foreground pt-2 space-y-0.5">
            <p>
              {event.startDate === event.endDate
                ? event.startDate
                : `${event.startDate} ~ ${event.endDate}`}
            </p>
            {event.startTime && (
              <p>{event.startTime}{event.endTime ? ` ~ ${event.endTime}` : ""}</p>
            )}
            <p>{event.createdBy === "builder" ? "빌더" : "클라이언트"} 등록</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs h-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(event.id)}
          >
            <Trash2 className="size-3 mr-1" />
            삭제
          </Button>
        </div>
      )}
    </div>
  )
}

// --- Day Cell (Desktop) ---
function BrandDayCell({
  date,
  isCurrentMonth,
  dayEvents,
  todayStr,
  onAddClick,
  onDelete,
}: {
  date: Date
  isCurrentMonth: boolean
  dayEvents: { event: BrandEvent; position: EventPosition }[]
  todayStr: string
  onAddClick: (dateStr: string) => void
  onDelete: (id: string) => void
}) {
  const today = formatDate(date) === todayStr
  const inCurrentSprint = isInSprint(date, todayStr)
  const dayOfWeek = (date.getDay() || 7) - 1
  const isMonday = dayOfWeek === 0
  const sprint = isMonday ? getSprintForDate(date) : undefined
  const dateStr = formatDate(date)

  return (
    <div
      className={cn(
        "group p-1 border-r border-b border-border last:border-r-0 flex flex-col min-h-[110px]",
        !isCurrentMonth && "bg-muted/20",
        inCurrentSprint && isCurrentMonth && "bg-primary/[0.04]"
      )}
    >
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex items-center gap-1">
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
        <button
          onClick={() => onAddClick(dateStr)}
          className="size-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
        >
          <Plus className="size-3" />
        </button>
      </div>

      <div className="space-y-0.5 flex-1 overflow-hidden">
        {dayEvents.slice(0, 2).map(({ event, position }) => (
          <BrandEventCard key={event.id} event={event} position={position} date={date} onDelete={onDelete} />
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
                {dayEvents.map(({ event, position }) => (
                  <BrandEventCard key={event.id} event={event} position={position} date={date} onDelete={onDelete} />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
}

// --- Mobile Day Cell ---
function MobileBrandDayCell({
  date,
  dayEvents,
  isCurrentMonth,
  todayStr,
  isSelected,
  onSelect,
  onAddClick,
}: {
  date: Date
  dayEvents: { event: BrandEvent; position: EventPosition }[]
  isCurrentMonth: boolean
  todayStr: string
  isSelected: boolean
  onSelect: () => void
  onAddClick: (dateStr: string) => void
}) {
  const today = formatDate(date) === todayStr
  const inCurrentSprint = isInSprint(date, todayStr)
  const dayOfWeek = (date.getDay() || 7) - 1
  const isMonday = dayOfWeek === 0
  const sprint = isMonday ? getSprintForDate(date) : undefined
  const dateStr = formatDate(date)

  return (
    <div
      onClick={onSelect}
      className={cn(
        "p-1 border-r border-b border-border flex flex-col min-h-[80px]",
        !isCurrentMonth && "bg-muted/20",
        inCurrentSprint && isCurrentMonth && "bg-primary/[0.04]",
        isSelected && "bg-primary/10 ring-1 ring-inset ring-primary/30",
        "cursor-pointer"
      )}
    >
      <div className="flex items-center justify-between">
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
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddClick(dateStr)
          }}
          className="size-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Plus className="size-3" />
        </button>
      </div>
      <div className="flex flex-wrap gap-0.5 mt-0.5">
        {dayEvents.slice(0, 4).map(({ event }) => (
          <BrandEventDot key={event.id} event={event} />
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

// --- Main component ---
export function BrandCalendarView() {
  const { today, todayStr } = useSimulatedDate()
  const [currentDate, setCurrentDate] = React.useState(today)
  const [events, setEvents] = React.useState<BrandEvent[]>(initialBrandEvents)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogDefaultDate, setDialogDefaultDate] = React.useState<string | undefined>()
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [expandedEventId, setExpandedEventId] = React.useState<string | null>(null)

  React.useEffect(() => { setCurrentDate(today) }, [today])

  const goToPrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  const goToToday = () => setCurrentDate(today)

  const handleAddClick = (dateStr?: string) => {
    setDialogDefaultDate(dateStr)
    setDialogOpen(true)
  }

  const handleAddEvent = (data: {
    title: string
    startDate: string
    endDate: string
    startTime?: string
    endTime?: string
  }) => {
    const newEvent: BrandEvent = {
      id: `brand-${Date.now()}`,
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      startTime: data.startTime,
      endTime: data.endTime,
      type: "custom",
      createdBy: "client",
    }
    setEvents((prev) => [...prev, newEvent])
  }

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthDays = getMonthDays(year, month)

  const getEventsForDate = (date: Date): { event: BrandEvent; position: EventPosition }[] => {
    const dateStr = formatDate(date)
    return events
      .filter((e) => dateStr >= e.startDate && dateStr <= e.endDate)
      .map((e) => ({
        event: e,
        position:
          e.startDate === e.endDate ? "single" as const
          : e.startDate === dateStr ? "start" as const
          : e.endDate === dateStr ? "end" as const
          : "middle" as const,
      }))
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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            오늘
          </Button>
          <Button size="sm" onClick={() => handleAddClick()}>
            <Plus className="size-4 mr-1" />
            일정 추가
          </Button>
        </div>
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

        {/* Desktop */}
        <div className="hidden md:block">
          {weeks.map((weekDays, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {weekDays.map(({ date, isCurrentMonth }, di) => (
                <BrandDayCell
                  key={di}
                  date={date}
                  isCurrentMonth={isCurrentMonth}
                  dayEvents={getEventsForDate(date)}
                  todayStr={todayStr}
                  onAddClick={handleAddClick}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Mobile */}
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
                      <MobileBrandDayCell
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
                        onAddClick={handleAddClick}
                      />
                    )
                  })}
                </div>
                {selectedInThisWeek && selectedDayEvents.length > 0 && (
                  <div className="border-b border-border bg-muted/30 px-3 py-3 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      {selectedInThisWeek.date.getMonth() + 1}월 {selectedInThisWeek.date.getDate()}일
                    </p>
                    {selectedDayEvents.map(({ event }) => (
                      <MobileBrandEventCard
                        key={event.id}
                        event={event}
                        date={selectedInThisWeek.date}
                        isExpanded={expandedEventId === event.id}
                        onToggle={() =>
                          setExpandedEventId((prev) => (prev === event.id ? null : event.id))
                        }
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Add event dialog */}
      <BrandEventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddEvent}
        defaultDate={dialogDefaultDate}
      />
    </div>
  )
}
