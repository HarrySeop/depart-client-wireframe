"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useIsMobile } from "@/components/ui/use-mobile"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface BrandEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (event: {
    title: string
    startDate: string
    endDate: string
    startTime?: string
    endTime?: string
  }) => void
  defaultDate?: string
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
const MINUTES = ["00", "10", "20", "30", "40", "50"]

function formatDateDisplay(date: Date): string {
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`
}

function parseDateStr(str: string): Date | undefined {
  if (!str) return undefined
  const [y, m, d] = str.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function toDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function BrandEventDialog({ open, onOpenChange, onSubmit, defaultDate }: BrandEventDialogProps) {
  const isMobile = useIsMobile()
  const [title, setTitle] = React.useState("")
  const [startDate, setStartDate] = React.useState(defaultDate || "")
  const [endDate, setEndDate] = React.useState("")
  const [startHour, setStartHour] = React.useState("")
  const [startMinute, setStartMinute] = React.useState("")
  const [endHour, setEndHour] = React.useState("")
  const [endMinute, setEndMinute] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setTitle("")
      setStartDate(defaultDate || "")
      setEndDate("")
      setStartHour("")
      setStartMinute("")
      setEndHour("")
      setEndMinute("")
    }
  }, [open, defaultDate])

  const isValid = title.trim() && startDate
  const handleSubmit = () => {
    if (!isValid) return
    const startTime = startHour && startMinute ? `${startHour}:${startMinute}` : undefined
    const endTime = endHour && endMinute ? `${endHour}:${endMinute}` : undefined
    onSubmit({
      title: title.trim(),
      startDate,
      endDate: endDate || startDate,
      startTime,
      endTime,
    })
    onOpenChange(false)
  }

  const formContent = (
    <div className="space-y-4 px-1">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="event-title">일정 제목</Label>
        <Input
          id="event-title"
          placeholder="일정 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Start Date + Time */}
      <div className="space-y-2">
        <Label>시작일</Label>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("flex-1 justify-start text-left font-normal", !startDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 size-4" />
                {startDate ? formatDateDisplay(parseDateStr(startDate)!) : "날짜 선택"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parseDateStr(startDate)}
                onSelect={(date) => date && setStartDate(toDateStr(date))}
                defaultMonth={parseDateStr(startDate) || parseDateStr(defaultDate || "")}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2">
          <Select value={startHour} onValueChange={setStartHour}>
            <SelectTrigger size="sm" className="w-[72px]">
              <SelectValue placeholder="시" />
            </SelectTrigger>
            <SelectContent>
              {HOURS.map((h) => (
                <SelectItem key={h} value={h}>{h}시</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-muted-foreground">:</span>
          <Select value={startMinute} onValueChange={setStartMinute}>
            <SelectTrigger size="sm" className="w-[72px]">
              <SelectValue placeholder="분" />
            </SelectTrigger>
            <SelectContent>
              {MINUTES.map((m) => (
                <SelectItem key={m} value={m}>{m}분</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* End Date + Time */}
      <div className="space-y-2">
        <Label>종료일 (선택)</Label>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("flex-1 justify-start text-left font-normal", !endDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 size-4" />
                {endDate ? formatDateDisplay(parseDateStr(endDate)!) : "날짜 선택"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parseDateStr(endDate)}
                onSelect={(date) => date && setEndDate(toDateStr(date))}
                defaultMonth={parseDateStr(endDate) || parseDateStr(startDate)}
                disabled={(date) => startDate ? date < parseDateStr(startDate)! : false}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2">
          <Select value={endHour} onValueChange={setEndHour}>
            <SelectTrigger size="sm" className="w-[72px]">
              <SelectValue placeholder="시" />
            </SelectTrigger>
            <SelectContent>
              {HOURS.map((h) => (
                <SelectItem key={h} value={h}>{h}시</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-muted-foreground">:</span>
          <Select value={endMinute} onValueChange={setEndMinute}>
            <SelectTrigger size="sm" className="w-[72px]">
              <SelectValue placeholder="분" />
            </SelectTrigger>
            <SelectContent>
              {MINUTES.map((m) => (
                <SelectItem key={m} value={m}>{m}분</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>일정 추가</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-2">{formContent}</div>
          <DrawerFooter>
            <Button onClick={handleSubmit} disabled={!isValid}>추가</Button>
            <DrawerClose asChild>
              <Button variant="outline">취소</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>일정 추가</DialogTitle>
        </DialogHeader>
        {formContent}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
          <Button onClick={handleSubmit} disabled={!isValid}>추가</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
