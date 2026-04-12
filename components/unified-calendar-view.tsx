"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Instagram, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSimulatedDate } from "@/lib/simulated-date-context"
import { allContents, sprints as sprintDefs, computeClientStatus } from "@/lib/mock-data/contents"
import { initialBrandEvents, type BrandEvent } from "@/lib/mock-data/brand-calendar"
import { BrandEventDialog } from "@/components/brand-event-dialog"
import { WEEKDAYS, formatDate, isInSprint, getSprintForDate, getMonthDays } from "@/lib/calendar-utils"

// ─── Constants ───────────────────────────────────────────────

const BRAND_TEAL = "#ec4899"

const productionEventColors = {
  "기획완료": "#5f86fb",
  "수정 요청": "#dd3d2e",
  "제작중": "#949494",
  "제작완료": "#8575e5",
  "업로드 대기": "#e49e28",
  "업로드 완료": "#59b160",
  "수정 요청(이월)": "#dd3d2e",
} as const

type ProductionEventType = keyof typeof productionEventColors
type FilterType = "all" | "production" | "brand"
type EventPosition = "single" | "start" | "middle" | "end"

// ─── Unified Event Types ─────────────────────────────────────

interface ProductionEvent {
  source: "production"
  id: string
  date: string
  type: ProductionEventType
  title: string
  sprint?: string
  href?: string
}

interface BrandCalendarEvent {
  source: "brand"
  id: string
  event: BrandEvent
  position: EventPosition
}

type UnifiedEvent = ProductionEvent | BrandCalendarEvent

// ─── Production Event Card ───────────────────────────────────

function ProductionEventCard({ event }: { event: ProductionEvent }) {
  const color = productionEventColors[event.type]
  const isUpload = event.type === "업로드 대기" || event.type === "업로드 완료"
  const shortTitle = event.title.length > 18 ? event.title.slice(0, 18) + "…" : event.title

  const cardContent = (
    <div
      className="rounded-md px-1.5 py-1 text-[11px] leading-tight cursor-pointer transition-opacity hover:opacity-80 space-y-0.5 border-l-2"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center gap-1">
        <span
          className="shrink-0 text-[9px] font-semibold px-1 py-px rounded"
          style={{ color, backgroundColor: `${color}20` }}
        >
          제작
        </span>
        <p className="font-medium truncate text-foreground/90">{shortTitle}</p>
      </div>
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

  if (isUpload) {
    return (
      <Popover>
        <PopoverTrigger asChild>{cardContent}</PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="font-medium text-sm" style={{ color }}>{event.type}</span>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ color, backgroundColor: `${color}20` }}>제작</span>
            </div>
            <p className="text-sm text-foreground">{event.title}</p>
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

  if (event.href) {
    return <Link href={event.href}>{cardContent}</Link>
  }

  return cardContent
}

// ─── Brand Event Card ────────────────────────────────────────

function UnifiedBrandEventCard({
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
  const shortTitle = event.title.length > 18 ? event.title.slice(0, 18) + "…" : event.title
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
          className="rounded-md px-1.5 py-1 text-[11px] leading-tight cursor-pointer transition-opacity hover:opacity-80 space-y-0.5"
          style={{ backgroundColor: `${BRAND_TEAL}30` }}
        >
          <div className="flex items-center gap-1">
            <span
              className="shrink-0 text-[9px] font-semibold px-1 py-px rounded"
              style={{ color: BRAND_TEAL, backgroundColor: `${BRAND_TEAL}20` }}
            >
              브랜드
            </span>
            <p className="font-medium truncate text-foreground/90">{shortTitle}</p>
          </div>
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
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ backgroundColor: BRAND_TEAL }} />
            <span className="font-medium text-sm text-foreground">{event.title}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ color: BRAND_TEAL, backgroundColor: `${BRAND_TEAL}20` }}>브랜드</span>
          </div>
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

// ─── Event Dots (mobile) ─────────────────────────────────────

function UnifiedEventDot({ event }: { event: UnifiedEvent }) {
  const color = event.source === "production"
    ? productionEventColors[event.type]
    : BRAND_TEAL
  return (
    <span
      className="size-1.5 rounded-full shrink-0"
      style={{ backgroundColor: color }}
      title={event.source === "production" ? event.title : event.event.title}
    />
  )
}

// ─── Mobile Event Card ───────────────────────────────────────

function MobileUnifiedEventCard({
  item,
  date,
  isExpanded,
  onToggle,
  onDelete,
}: {
  item: UnifiedEvent
  date: Date
  isExpanded: boolean
  onToggle: () => void
  onDelete: (id: string) => void
}) {
  if (item.source === "production") {
    const color = productionEventColors[item.type]
    const isUpload = item.type === "업로드 대기" || item.type === "업로드 완료"
    return (
      <div className="border border-border rounded-lg overflow-hidden">
        <button
          onClick={onToggle}
          className="w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-muted/50 transition-colors"
        >
          <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-[9px] font-semibold px-1 py-px rounded shrink-0" style={{ color, backgroundColor: `${color}15` }}>제작</span>
          <span className="text-sm font-medium truncate flex-1">{item.title}</span>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
            style={{ color, backgroundColor: `${color}15` }}
          >
            {item.type}
          </span>
        </button>
        {isExpanded && (
          <div className="px-3 pb-3 pt-0 space-y-2 border-t border-border">
            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
              {item.sprint && <span>{item.sprint}</span>}
            </div>
            <div className="flex gap-2">
              <Link href={`/planning/${item.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs h-8">기획서 보기</Button>
              </Link>
              <Link href={`/content/${item.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs h-8">콘텐츠 보기</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Brand
  const brandEvent = item.event
  const sprint = getSprintForDate(date)
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-muted/50 transition-colors"
      >
        <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: BRAND_TEAL }} />
        <span className="text-[9px] font-semibold px-1 py-px rounded shrink-0" style={{ color: BRAND_TEAL, backgroundColor: `${BRAND_TEAL}15` }}>브랜드</span>
        <span className="text-sm font-medium truncate flex-1">{brandEvent.title}</span>
        {sprint && (
          <span className="text-[10px] text-muted-foreground shrink-0">S.{sprint.id}</span>
        )}
      </button>
      {isExpanded && (
        <div className="px-3 pb-3 pt-0 space-y-2 border-t border-border">
          <div className="text-xs text-muted-foreground pt-2 space-y-0.5">
            <p>
              {brandEvent.startDate === brandEvent.endDate
                ? brandEvent.startDate
                : `${brandEvent.startDate} ~ ${brandEvent.endDate}`}
            </p>
            {brandEvent.startTime && (
              <p>{brandEvent.startTime}{brandEvent.endTime ? ` ~ ${brandEvent.endTime}` : ""}</p>
            )}
            <p>{brandEvent.createdBy === "builder" ? "빌더" : "클라이언트"} 등록</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs h-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(brandEvent.id)}
          >
            <Trash2 className="size-3 mr-1" />
            삭제
          </Button>
        </div>
      )}
    </div>
  )
}

// ─── Day Cell (Desktop) ──────────────────────────────────────

function UnifiedDayCell({
  date,
  isCurrentMonth,
  dayEvents,
  todayStr,
  filter,
  onAddClick,
  onDelete,
}: {
  date: Date
  isCurrentMonth: boolean
  dayEvents: UnifiedEvent[]
  todayStr: string
  filter: FilterType
  onAddClick: (dateStr: string) => void
  onDelete: (id: string) => void
}) {
  const today = formatDate(date) === todayStr
  const inCurrentSprint = isInSprint(date, todayStr)
  const dayOfWeek = (date.getDay() || 7) - 1
  const isMonday = dayOfWeek === 0
  const sprint = isMonday ? getSprintForDate(date) : undefined
  const dateStr = formatDate(date)
  const showAddButton = filter !== "production"

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
        {showAddButton && (
          <button
            onClick={() => onAddClick(dateStr)}
            className="size-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
          >
            <Plus className="size-3" />
          </button>
        )}
      </div>

      <div className="space-y-0.5 flex-1 overflow-hidden">
        {dayEvents.slice(0, 2).map((item) =>
          item.source === "production" ? (
            <ProductionEventCard key={`p-${item.id}`} event={item} />
          ) : (
            <UnifiedBrandEventCard
              key={`b-${item.event.id}`}
              event={item.event}
              position={item.position}
              date={date}
              onDelete={onDelete}
            />
          )
        )}
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
                {dayEvents.map((item) =>
                  item.source === "production" ? (
                    <ProductionEventCard key={`p-${item.id}`} event={item} />
                  ) : (
                    <UnifiedBrandEventCard
                      key={`b-${item.event.id}`}
                      event={item.event}
                      position={item.position}
                      date={date}
                      onDelete={onDelete}
                    />
                  )
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
}

// ─── Mobile Day Cell ─────────────────────────────────────────

function MobileUnifiedDayCell({
  date,
  dayEvents,
  isCurrentMonth,
  todayStr,
  isSelected,
  onSelect,
  filter,
  onAddClick,
}: {
  date: Date
  dayEvents: UnifiedEvent[]
  isCurrentMonth: boolean
  todayStr: string
  isSelected: boolean
  onSelect: () => void
  filter: FilterType
  onAddClick: (dateStr: string) => void
}) {
  const today = formatDate(date) === todayStr
  const inCurrentSprint = isInSprint(date, todayStr)
  const dayOfWeek = (date.getDay() || 7) - 1
  const isMonday = dayOfWeek === 0
  const sprint = isMonday ? getSprintForDate(date) : undefined
  const dateStr = formatDate(date)
  const showAddButton = filter !== "production"

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
        {showAddButton && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAddClick(dateStr)
            }}
            className="size-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Plus className="size-3" />
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-0.5 mt-0.5">
        {dayEvents.slice(0, 4).map((item) => (
          <UnifiedEventDot key={item.source === "production" ? `p-${item.id}` : `b-${item.event.id}`} event={item} />
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

// ─── Main Component ──────────────────────────────────────────

export function UnifiedCalendarView() {
  const { today, todayStr } = useSimulatedDate()
  const [currentDate, setCurrentDate] = React.useState(today)
  const [filter, setFilter] = React.useState<FilterType>("all")
  const [brandEvents, setBrandEvents] = React.useState<BrandEvent[]>(initialBrandEvents)
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
    setBrandEvents((prev) => [...prev, newEvent])
  }

  const handleDeleteBrand = (id: string) => {
    setBrandEvents((prev) => prev.filter((e) => e.id !== id))
  }

  // Generate production events (카드 위치는 항상 publishedAt 고정)
  const productionEvents: ProductionEvent[] = React.useMemo(() => {
    return allContents.map((c) => {
      const status = computeClientStatus(c, todayStr)
      let eventType: ProductionEventType = "기획완료"

      if (status === "업로드 완료") eventType = "업로드 완료"
      else if (status === "업로드 대기") eventType = "업로드 대기"
      else if (status === "수정 요청") eventType = "수정 요청"
      else if (status === "수정완료") eventType = "제작완료"
      else if (status === "제작완료") eventType = "제작완료"
      else if (status === "제작중") eventType = "제작중"
      else if (status === "기획완료") eventType = "기획완료"

      return {
        source: "production" as const,
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

  const getEventsForDate = (date: Date): UnifiedEvent[] => {
    const dateStr = formatDate(date)
    const items: UnifiedEvent[] = []

    // Production events
    if (filter === "all" || filter === "production") {
      const pEvents = productionEvents.filter((e) => e.date === dateStr)
      items.push(...pEvents)
    }

    // Brand events
    if (filter === "all" || filter === "brand") {
      const bEvents = brandEvents
        .filter((e) => dateStr >= e.startDate && dateStr <= e.endDate)
        .map((e) => ({
          source: "brand" as const,
          id: e.id,
          event: e,
          position:
            e.startDate === e.endDate ? "single" as const
            : e.startDate === dateStr ? "start" as const
            : e.endDate === dateStr ? "end" as const
            : "middle" as const,
        }))
      items.push(...bEvents)
    }

    return items
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
          <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="production">제작</SelectItem>
              <SelectItem value="brand">브랜드</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={goToToday}>
            오늘
          </Button>
          {filter !== "production" && (
            <Button size="sm" onClick={() => handleAddClick()}>
              <Plus className="size-4 mr-1" />
              일정 추가
            </Button>
          )}
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
                <UnifiedDayCell
                  key={di}
                  date={date}
                  isCurrentMonth={isCurrentMonth}
                  dayEvents={getEventsForDate(date)}
                  todayStr={todayStr}
                  filter={filter}
                  onAddClick={handleAddClick}
                  onDelete={handleDeleteBrand}
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
                      <MobileUnifiedDayCell
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
                        filter={filter}
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
                    {selectedDayEvents.map((item) => (
                      <MobileUnifiedEventCard
                        key={item.source === "production" ? `p-${item.id}` : `b-${item.event.id}`}
                        item={item}
                        date={selectedInThisWeek.date}
                        isExpanded={expandedEventId === (item.source === "production" ? item.id : item.event.id)}
                        onToggle={() => {
                          const id = item.source === "production" ? item.id : item.event.id
                          setExpandedEventId((prev) => (prev === id ? null : id))
                        }}
                        onDelete={handleDeleteBrand}
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
        {(filter === "all" || filter === "production") && Object.entries(productionEventColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-muted-foreground">{type}</span>
          </div>
        ))}
        {(filter === "all" || filter === "brand") && (
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ backgroundColor: BRAND_TEAL }} />
            <span className="text-muted-foreground">브랜드 일정</span>
          </div>
        )}
      </div>

      {/* Add brand event dialog */}
      <BrandEventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddEvent}
        defaultDate={dialogDefaultDate}
      />
    </div>
  )
}
