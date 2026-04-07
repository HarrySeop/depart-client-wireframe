import type { StatusType } from "@/components/status-badge"
import type { TaskCardProps } from "@/components/task-card"

export const contentTasks: TaskCardProps[] = [
  {
    id: "content-1",
    status: "제작완료" as StatusType,
    title: "카드뉴스 #60 - 청바지 오래 입는 관리 방법",
    sprintInfo: "→ Sp.15 업로드",
    builder: "김동현",
    href: "/content/content-1",
  },
  {
    id: "content-2",
    status: "제작완료" as StatusType,
    title: "카드뉴스 #59 - 큰 키는 정확히 얼마일까요?",
    sprintInfo: "→ Sp.15 업로드",
    builder: "김동현",
    href: "/content/content-2",
  },
  {
    id: "content-3",
    status: "제작완료" as StatusType,
    title: "숏폼 #10 - 흰 티셔츠 목이 누렇게 변했나요?",
    sprintInfo: "→ Sp.15 업로드",
    builder: "김동현",
    href: "/content/content-3",
  },
  {
    id: "content-4",
    status: "승인완료" as StatusType,
    title: "카드뉴스 #58 - 공장 사장님들이 매번 여쭤봅니다.",
    sprintInfo: "→ Sp.15 업로드",
    builder: "김동현",
    href: "/content/content-4",
  },
]

export const planningTasks: TaskCardProps[] = [
  {
    id: "planning-1",
    status: "기획완료" as StatusType,
    title: "카드뉴스 #63 - 폴리에스터, 바지에 왜 많이 쓰일까",
    sprintInfo: "→ Sp.16 제작",
    builder: "김동현",
    href: "/planning/planning-1",
  },
  {
    id: "planning-2",
    status: "수정 요청" as StatusType,
    title: "카드뉴스 #62 - 봄에는 이렇게 입어보세요.",
    sprintInfo: "→ Sp.16 제작",
    builder: "김동현",
    href: "/planning/planning-2",
  },
  {
    id: "planning-3",
    status: "최종 확정" as StatusType,
    title: "숏폼 #11 - 체형별 바지 추천",
    sprintInfo: "→ Sp.16 제작",
    builder: "김동현",
    href: "/planning/planning-3",
  },
  {
    id: "planning-4",
    status: "기획완료" as StatusType,
    title: "카드뉴스 #61 - 그동안 많은 후기를 남겨주셨습니다",
    sprintInfo: "→ Sp.16 제작",
    builder: "김동현",
    href: "/planning/planning-4",
  },
]
