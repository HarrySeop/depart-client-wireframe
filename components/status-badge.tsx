import { cn } from "@/lib/utils"

export type StatusType =
  // 기획서 상태
  | "기획완료"
  | "검토중"
  | "승인완료"
  | "수정 요청"
  | "수정완료"
  | "최종 확정"
  | "제작중"
  // 콘텐츠 상태
  | "제작완료"
  | "컨펌 보류"
  | "업로드 대기"
  | "업로드 완료"

const statusColors: Record<StatusType, string> = {
  // 기획서 상태
  기획완료: "#5f86fb",
  검토중: "#e49e28",
  승인완료: "#59b160",
  "수정 요청": "#dd3d2e",
  수정완료: "#5f86fb",
  "최종 확정": "#59b160",
  제작중: "#949494",
  // 콘텐츠 상태
  제작완료: "#8575e5",
  "컨펌 보류": "#dd3d2e",
  "업로드 대기": "#e49e28",
  "업로드 완료": "#5d5d5d",
}

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const color = statusColors[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
        className
      )}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        borderColor: `${color}40`,
      }}
    >
      {status}
    </span>
  )
}
