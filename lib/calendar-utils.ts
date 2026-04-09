import { sprints as sprintDefs } from "@/lib/mock-data/contents"

export const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"]

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function isInSprint(date: Date, todayStr: string): boolean {
  const dateStr = formatDate(date)
  const current = sprintDefs.find((s) => todayStr >= s.startDate && todayStr <= s.endDate)
  if (!current) return false
  return dateStr >= current.startDate && dateStr <= current.endDate
}

export function getSprintForDate(date: Date) {
  const dateStr = formatDate(date)
  return sprintDefs.find((s) => dateStr >= s.startDate && dateStr <= s.endDate)
}

export function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  let startDayOfWeek = firstDay.getDay() - 1
  if (startDayOfWeek < 0) startDayOfWeek = 6

  const days: { date: Date; isCurrentMonth: boolean }[] = []
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month, -i), isCurrentMonth: false })
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true })
  }
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
  }
  return days
}
