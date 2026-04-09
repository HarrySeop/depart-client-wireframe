export type BrandEventType = "product-launch" | "popup-event" | "sprint-meeting" | "custom"

export interface BrandEvent {
  id: string
  title: string
  startDate: string   // YYYY-MM-DD
  endDate: string     // YYYY-MM-DD
  startTime?: string  // HH:mm
  endTime?: string    // HH:mm
  type: BrandEventType
  createdBy: "builder" | "client"
}

export const brandEventColors: Record<BrandEventType, string> = {
  "product-launch": "#e07c3e",
  "popup-event": "#c45fa0",
  "sprint-meeting": "#4da6c9",
  "custom": "#7c8b9a",
}

export const brandEventTypeLabels: Record<BrandEventType, string> = {
  "product-launch": "제품 출시",
  "popup-event": "오프라인 팝업",
  "sprint-meeting": "주간 스프린트",
  "custom": "기타",
}

export const initialBrandEvents: BrandEvent[] = [
  {
    id: "brand-1",
    title: "MORENO 2026 S/S 신제품 출시",
    startDate: "2026-04-20",
    endDate: "2026-04-20",
    type: "product-launch",
    createdBy: "client",
  },
  {
    id: "brand-2",
    title: "여름 한정판 라인 출시",
    startDate: "2026-05-01",
    endDate: "2026-05-01",
    type: "product-launch",
    createdBy: "client",
  },
  {
    id: "brand-3",
    title: "강남 팝업스토어",
    startDate: "2026-04-14",
    endDate: "2026-04-18",
    startTime: "11:00",
    endTime: "20:00",
    type: "popup-event",
    createdBy: "client",
  },
  {
    id: "brand-4",
    title: "Sprint 13 주간 미팅",
    startDate: "2026-04-06",
    endDate: "2026-04-06",
    startTime: "10:00",
    endTime: "11:00",
    type: "sprint-meeting",
    createdBy: "builder",
  },
  {
    id: "brand-5",
    title: "Sprint 14 주간 미팅",
    startDate: "2026-04-13",
    endDate: "2026-04-13",
    startTime: "10:00",
    endTime: "11:00",
    type: "sprint-meeting",
    createdBy: "builder",
  },
  {
    id: "brand-6",
    title: "Sprint 15 주간 미팅",
    startDate: "2026-04-20",
    endDate: "2026-04-20",
    startTime: "10:00",
    endTime: "11:00",
    type: "sprint-meeting",
    createdBy: "builder",
  },
  {
    id: "brand-7",
    title: "Sprint 16 주간 미팅",
    startDate: "2026-04-27",
    endDate: "2026-04-27",
    startTime: "10:00",
    endTime: "11:00",
    type: "sprint-meeting",
    createdBy: "builder",
  },
  {
    id: "brand-8",
    title: "브랜드 촬영 일정",
    startDate: "2026-04-22",
    endDate: "2026-04-23",
    startTime: "09:00",
    endTime: "18:00",
    type: "custom",
    createdBy: "builder",
  },
]
