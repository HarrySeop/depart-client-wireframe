// Sanitized content data based on real API structure
// Brand: LLATROF → MORENO (가상 남성 패션 브랜드)
// Builder: 김동현 → 이준혁
// Designers: 정현선 → 박서연, 조현서 → 한소율

export interface ContentItem {
  id: string
  contentType: "CARD_NEWS" | "SHORT_FORM"
  contentTypeLabel: string
  title: string
  publishedAt: string // YYYY-MM-DD — 업로드/게시 예정일 (audience용)
  sprint: number
  builderName: string
  designerName: string
  notionStatus: string
  planningDeliveredAt?: string // ISO date: 빌더가 기획서를 완성하여 클라이언트에게 전달된 시점
  contentDeliveredAt?: string  // ISO date: 빌더가 콘텐츠를 컨펌 완료하여 클라이언트에게 전달된 시점
  feedbackStatus?: "수정 요청" | "수정완료" // 콘텐츠 피드백 후 상태 추적 (콘텐츠만 적용)
}

export const BRAND = {
  name: "MORENO",
  logoUrl: "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=100&h=100&fit=crop",
}

export const allContents: ContentItem[] = [
  // Sprint 14 — 기획 완료, 콘텐츠 개별 전달 중
  // 기획서 컨펌 윈도우: 04-03 ~ 04-06 (이미 완료)
  // 콘텐츠 컨펌 윈도우: 04-12 ~ 04-13 (빌더가 개별 전달 중 → 일부 조기 도착)
  { id: "880", contentType: "SHORT_FORM", contentTypeLabel: "숏폼", title: "숏폼 #11 - 체형별 바지 추천", publishedAt: "2026-04-18", sprint: 14, builderName: "이준혁", designerName: "한소율", notionStatus: "빌더 컨펌 완료", planningDeliveredAt: "2026-04-02", contentDeliveredAt: "2026-04-07" },
  { id: "879", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #66 - 여름 출근룩, 격식과 편안함 사이에서", publishedAt: "2026-04-17", sprint: 14, builderName: "이준혁", designerName: "박서연", notionStatus: "빌더 컨펌 완료", planningDeliveredAt: "2026-04-02", contentDeliveredAt: "2026-04-08" },
  { id: "874", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #65 - 라인업을 확장하기 전에 먼저 해야 할 일", publishedAt: "2026-04-16", sprint: 14, builderName: "이준혁", designerName: "박서연", notionStatus: "빌더 컨펌 완료", planningDeliveredAt: "2026-04-03", contentDeliveredAt: "2026-04-09" },
  { id: "872", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #64 - 모레노 팬츠는 레귤러 핏부터 시작합니다", publishedAt: "2026-04-15", sprint: 14, builderName: "이준혁", designerName: "박서연", notionStatus: "콘텐츠 제작 진행 중", planningDeliveredAt: "2026-04-03" },
  { id: "873", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #63 - 폴리에스터, 바지에 왜 자주 쓰일까요?", publishedAt: "2026-04-14", sprint: 14, builderName: "이준혁", designerName: "박서연", notionStatus: "콘텐츠 제작 진행 중", planningDeliveredAt: "2026-04-04" },
  { id: "823", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #62 - 봄에는 이렇게 입어보세요", publishedAt: "2026-04-13", sprint: 14, builderName: "이준혁", designerName: "박서연", notionStatus: "콘텐츠 제작 진행 중", planningDeliveredAt: "2026-04-04" },

  // Sprint 13 — 콘텐츠 컨펌 완료 (일부 피드백 상태 데모)
  // 콘텐츠 컨펌 윈도우: 04-05 ~ 04-06 (개별 전달로 일부 조기 도착)
  { id: "702", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #61 - 많은 후기를 보내주셨습니다", publishedAt: "2026-04-10", sprint: 13, builderName: "이준혁", designerName: "박서연", notionStatus: "빌더 컨펌 완료", planningDeliveredAt: "2026-03-26", contentDeliveredAt: "2026-04-02", feedbackStatus: "수정완료" },
  { id: "703", contentType: "SHORT_FORM", contentTypeLabel: "숏폼", title: "숏폼 #10 - 흰 티셔츠 목늘어남 방지하는 법", publishedAt: "2026-04-09", sprint: 13, builderName: "이준혁", designerName: "한소율", notionStatus: "빌더 컨펌 완료", planningDeliveredAt: "2026-03-26", contentDeliveredAt: "2026-04-03" },
  { id: "700", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #60 - 청바지 오래 입는 관리법", publishedAt: "2026-04-08", sprint: 13, builderName: "이준혁", designerName: "박서연", notionStatus: "빌더 컨펌 완료", planningDeliveredAt: "2026-03-27", contentDeliveredAt: "2026-04-04", feedbackStatus: "수정 요청" },
  { id: "699", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #59 - 키가 크면 옷이 더 잘 어울릴까요?", publishedAt: "2026-04-07", sprint: 13, builderName: "이준혁", designerName: "박서연", notionStatus: "빌더 컨펌 완료", planningDeliveredAt: "2026-03-27", contentDeliveredAt: "2026-04-05" },
  { id: "701", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #58 - 공장 담당자분들이 자주 물어봅니다", publishedAt: "2026-04-06", sprint: 13, builderName: "이준혁", designerName: "박서연", notionStatus: "빌더 컨펌 완료", planningDeliveredAt: "2026-03-28", contentDeliveredAt: "2026-04-05" },

  // Sprint 12 — 업로드 완료
  { id: "695", contentType: "SHORT_FORM", contentTypeLabel: "숏폼", title: "숏폼 #9 - 옷 잘 입었다는 말은 언제 들을 수 있을까요?", publishedAt: "2026-04-04", sprint: 12, builderName: "이준혁", designerName: "한소율", notionStatus: "업로드 완료" },
  { id: "697", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #57 - 바지는 몇 벌이면 충분할까요?", publishedAt: "2026-04-03", sprint: 12, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
  { id: "696", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #56 - 허벅지가 넓어서 옷이 불편했다면", publishedAt: "2026-04-02", sprint: 12, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
  { id: "698", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #55 - 결혼식 시즌, 이런 옷은 꼭 피하세요", publishedAt: "2026-04-01", sprint: 12, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
  { id: "501", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #54 - 출근할 때 결국 이 바지만 입게 됩니다", publishedAt: "2026-03-31", sprint: 12, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
  { id: "500", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #53 - 청바지 안 빨아도 된다는 말, 사실일까요?", publishedAt: "2026-03-30", sprint: 12, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },

  // Sprint 12 (추가 — 같은 날짜 다른 시간)
  { id: "488", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #43 - 밑위, 어느 정도가 가장 적절할까요?", publishedAt: "2026-03-30", sprint: 12, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },

  // Sprint 11
  { id: "498", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #52 - 세탁했는데 왜 아직 냄새가 날까요?", publishedAt: "2026-03-28", sprint: 11, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
  { id: "497", contentType: "SHORT_FORM", contentTypeLabel: "숏폼", title: "숏폼 #8 - 키 크다고 아무 옷이나 고르면 안 되는 이유", publishedAt: "2026-03-27", sprint: 11, builderName: "이준혁", designerName: "한소율", notionStatus: "업로드 완료" },
  { id: "496", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #51 - 어떤 콘텐츠를 보고 싶으신가요?", publishedAt: "2026-03-26", sprint: 11, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
  { id: "499", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #50 - 따뜻한 봄, 어떤 원단을 골라야 할까요?", publishedAt: "2026-03-25", sprint: 11, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
  { id: "495", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #49 - 부자들의 패션, 올드머니 룩", publishedAt: "2026-03-24", sprint: 11, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
  { id: "494", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #48 - 스웻팬츠, 한 벌로 충분한가요?", publishedAt: "2026-03-23", sprint: 11, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },

  // Sprint 10
  { id: "493", contentType: "SHORT_FORM", contentTypeLabel: "숏폼", title: "숏폼 #7 - 키 큰 사람 바지가 잘 안 보이는 이유", publishedAt: "2026-03-21", sprint: 10, builderName: "이준혁", designerName: "한소율", notionStatus: "업로드 완료" },
  { id: "490", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #47 - 실용성을 넘어 스타일이 된 카고팬츠", publishedAt: "2026-03-20", sprint: 10, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
  { id: "492", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #46 - 캠퍼스에서 시작된 클래식 프레피룩", publishedAt: "2026-03-19", sprint: 10, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
  { id: "489", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #45 - 좋은 옷이란 무엇일까요?", publishedAt: "2026-03-18", sprint: 10, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
  { id: "491", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #44 - 부드러운 울의 대표, 메리노 울", publishedAt: "2026-03-17", sprint: 10, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },

  // Sprint 9
  { id: "486", contentType: "SHORT_FORM", contentTypeLabel: "숏폼", title: "숏폼 #6 - 또 한 주를 버텨낸 당신에게", publishedAt: "2026-03-13", sprint: 9, builderName: "이준혁", designerName: "한소율", notionStatus: "업로드 완료" },
  { id: "487", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #42 - 섬유의 제왕이라 불리는 캐시미어", publishedAt: "2026-03-12", sprint: 9, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
  { id: "484", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #41 - 절제에서 오는 럭셔리, 드뮤어 룩", publishedAt: "2026-03-11", sprint: 9, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
  { id: "485", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #40 - 우리는 타협하지 않기로 했습니다", publishedAt: "2026-03-10", sprint: 9, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
  { id: "483", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #39 - 키가 커도 비율은 자동이 아닙니다", publishedAt: "2026-03-09", sprint: 9, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },

  // Sprint 8
  { id: "478", contentType: "SHORT_FORM", contentTypeLabel: "숏폼", title: "숏폼 #5 - 봄이 왔는데 바지는 아직 겨울인가요?", publishedAt: "2026-03-07", sprint: 8, builderName: "이준혁", designerName: "한소율", notionStatus: "업로드 완료" },
  { id: "482", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #38 - 포기하기로 결정했습니다", publishedAt: "2026-03-06", sprint: 8, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
  { id: "480", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #37 - 회식 후 옷 냄새 어떻게 빼죠?", publishedAt: "2026-03-05", sprint: 8, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
  { id: "481", contentType: "SHORT_FORM", contentTypeLabel: "숏폼", title: "숏폼 #4 - 니트 티셔츠처럼 걸어서 보관하나요?", publishedAt: "2026-03-04", sprint: 8, builderName: "이준혁", designerName: "한소율", notionStatus: "업로드 완료" },
  { id: "479", contentType: "CARD_NEWS", contentTypeLabel: "카드뉴스", title: "카드뉴스 #36 - 진작 알았으면 아꼈을 텐데요", publishedAt: "2026-03-03", sprint: 8, builderName: "이준혁", designerName: "박서연", notionStatus: "업로드 완료" },
]

// Sprint definitions (Monday 00:00 ~ Sunday 24:00)
export interface SprintDef {
  id: number
  name: string
  startDate: string
  endDate: string
}

export const sprints: SprintDef[] = [
  { id: 8, name: "Sprint 8", startDate: "2026-03-02", endDate: "2026-03-08" },
  { id: 9, name: "Sprint 9", startDate: "2026-03-09", endDate: "2026-03-15" },
  { id: 10, name: "Sprint 10", startDate: "2026-03-16", endDate: "2026-03-22" },
  { id: 11, name: "Sprint 11", startDate: "2026-03-23", endDate: "2026-03-29" },
  { id: 12, name: "Sprint 12", startDate: "2026-03-30", endDate: "2026-04-05" },
  { id: 13, name: "Sprint 13", startDate: "2026-04-06", endDate: "2026-04-12" },
  { id: 14, name: "Sprint 14", startDate: "2026-04-13", endDate: "2026-04-19" },
  { id: 15, name: "Sprint 15", startDate: "2026-04-20", endDate: "2026-04-26" },
  { id: 16, name: "Sprint 16", startDate: "2026-04-27", endDate: "2026-05-03" },
]

// Mock images for card news (6 per content)
export function getCardNewsImages(contentId: string): { src: string; alt: string }[] {
  const seeds = [
    "photo-1594938298603-c8148c4dae35",
    "photo-1552374196-1ab2a1c593e8",
    "photo-1542272604-787c3835535d",
    "photo-1507003211169-0a1dd7228f2d",
    "photo-1519085360753-af0119f7cbe7",
    "photo-1506794778202-cad84cf45f1d",
  ]
  const hash = contentId.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % seeds.length
  return Array.from({ length: 6 }, (_, i) => ({
    src: `https://images.unsplash.com/${seeds[(hash + i) % seeds.length]}?w=600&h=600&fit=crop&sat=-30&bri=${5 + i * 3}`,
    alt: `이미지 ${i + 1}`,
  }))
}

// Mock thumbnail for short-form (9:16 vertical placeholder)
export function getShortFormThumbnail(contentId: string): { src: string; alt: string } {
  return {
    src: `https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=360&h=640&fit=crop&sat=-20`,
    alt: "숏폼 썸네일",
  }
}

// Mock feedback
const feedbackTemplates = [
  { author: "클라이언트(나)", authorType: "client" as const, content: "캡션 톤이 너무 딱딱해요. 좀 더 캐주얼하게 수정해주세요.", timestamp: "4/12 10:30" },
  { author: "클라이언트(나)", authorType: "client" as const, content: "해시태그를 3개 더 추가해주세요.", timestamp: "4/12 10:35" },
  { author: "클라이언트(나)", authorType: "client" as const, content: "이미지 색감이 전체적으로 어두운 것 같습니다. 밝게 보정 부탁드려요.", timestamp: "4/13 09:00", replies: [
    { author: "이준혁", authorType: "builder" as const, content: "네, 밝기 올려서 다시 보내드릴게요.", timestamp: "4/13 09:30" },
  ]},
  { author: "클라이언트(나)", authorType: "client" as const, content: "텍스트가 이미지 위에서 잘 안 보여요. 폰트 크기를 키워주세요.", timestamp: "4/13 11:00" },
  { author: "클라이언트(나)", authorType: "client" as const, content: "마지막 이미지에 브랜드 로고가 빠져있습니다.", timestamp: "4/13 14:00" },
]

export function getMockFeedback(contentId: string) {
  // 하드코딩된 피드백 (기존)
  const hardcoded: Record<string, { author: string; authorType: "client" | "builder"; content: string; timestamp: string; replies?: any[] }[]> = {
    "873": [
      { author: "클라이언트(나)", authorType: "client", content: "캡션 5에서 소재 설명이 너무 전문적이에요. 일상 용어로 바꿔주세요.", timestamp: "4/12 10:30", replies: [
        { author: "이준혁", authorType: "builder", content: "네, 쉬운 표현으로 수정하겠습니다.", timestamp: "4/12 11:00" },
      ]},
      { author: "클라이언트(나)", authorType: "client", content: "해시태그에 #여름바지도 추가해주세요.", timestamp: "4/12 10:35", replies: [] },
    ],
    "700": [
      { author: "클라이언트(나)", authorType: "client", content: "3번째 이미지에서 텍스트가 잘 안 보여요. 폰트 크기를 키워주세요.", timestamp: "4/13 09:00", replies: [] },
      { author: "클라이언트(나)", authorType: "client", content: "마지막 이미지에 브랜드 로고가 빠져있습니다.", timestamp: "4/13 09:05", replies: [] },
    ],
  }

  if (hardcoded[contentId]) {
    return hardcoded[contentId].map((f, i) => ({
      id: `${contentId}-fb-${i}`,
      ...f,
      replies: (f.replies || []).map((r: any, j: number) => ({ id: `${contentId}-fb-${i}-r-${j}`, ...r })),
    }))
  }

  // ID 해시 기반으로 0~2개 피드백 자동 생성
  const hash = contentId.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  const count = hash % 3 // 0, 1, or 2
  if (count === 0) return []

  const startIdx = hash % feedbackTemplates.length
  const selected = Array.from({ length: count }, (_, i) =>
    feedbackTemplates[(startIdx + i) % feedbackTemplates.length]
  )

  return selected.map((f, i) => ({
    id: `${contentId}-fb-${i}`,
    ...f,
    replies: (f.replies || []).map((r: any, j: number) => ({ id: `${contentId}-fb-${i}-r-${j}`, ...r })),
  }))
}

// --- Auto-generated planning content from title ---

function hashId(id: string): number {
  return id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
}

/** 제목에서 번호 뒤의 주제 부분만 추출 (예: "카드뉴스 #63 - 폴리에스터..." → "폴리에스터...") */
function extractTopic(title: string): string {
  const match = title.match(/[-–—]\s*(.+)$/)
  return match ? match[1].trim() : title
}

const captionTemplates: ((topic: string) => string[])[] = [
  (t) => [
    `${t}, 한 번쯤 궁금하셨죠?`,
    `많은 분들이 이 부분에서 실수합니다.`,
    `핵심은 생각보다 단순합니다.`,
    `기본을 알면 선택이 쉬워집니다.`,
    `작은 차이가 결과를 크게 바꿉니다.`,
    `오늘부터 한 가지만 기억해보세요.`,
  ],
  (t) => [
    `${t} — 이 주제를 꺼내봅니다.`,
    `처음에는 잘 몰라서 지나치기 쉽습니다.`,
    `하지만 알고 나면 보는 눈이 달라집니다.`,
    `중요한 건 정보가 아니라 기준입니다.`,
    `기준이 생기면 흔들리지 않습니다.`,
    `이 콘텐츠가 그 기준이 되길 바랍니다.`,
  ],
  (t) => [
    `${t}에 대해 이야기해보겠습니다.`,
    `검색하면 정보는 많지만 정리된 건 드뭅니다.`,
    `그래서 꼭 필요한 것만 추렸습니다.`,
    `실생활에서 바로 적용할 수 있는 내용입니다.`,
    `어렵게 생각하지 않아도 됩니다.`,
    `한 번 읽어두면 오래 기억에 남을 겁니다.`,
  ],
  (t) => [
    `요즘 ${t}이(가) 화제입니다.`,
    `왜 이렇게 관심이 높아졌을까요?`,
    `이유를 알면 트렌드가 아니라 본질이 보입니다.`,
    `유행을 따르기보다 이해하는 것이 먼저입니다.`,
    `제대로 알고 선택하면 후회가 없습니다.`,
    `모레노가 풀어드리는 이야기, 시작합니다.`,
  ],
  (t) => [
    `${t} — 생각보다 자주 묻는 질문입니다.`,
    `답은 의외로 간단한 곳에 있습니다.`,
    `복잡하게 느껴진다면 순서가 잘못된 겁니다.`,
    `하나씩 짚어보면 금방 감이 옵니다.`,
    `이미 알고 있는 것에서 출발하면 됩니다.`,
    `이 글이 그 출발점이 되어드리겠습니다.`,
  ],
]

const hashtagPool = [
  ["#패션팁", "#데일리룩", "#스타일가이드"],
  ["#옷잘입는법", "#코디추천", "#패션정보"],
  ["#남자패션", "#기본템", "#옷관리"],
  ["#패션상식", "#트렌드", "#스타일링"],
  ["#옷추천", "#패션가이드", "#룩북"],
]

const designRequestPool = [
  "- 깔끔한 인포그래픽 스타일\n- 핵심 키워드 강조\n- 밝은 배경에 포인트 컬러\n- 가독성 우선",
  "- 감성적인 톤 앤 매너\n- 제품 착용 이미지 중심\n- 텍스트 최소화\n- 여백을 살린 구성",
  "- 비교 구성 (Before/After)\n- 심플한 배경\n- 아이콘 활용\n- 단계별 흐름 강조",
  "- 매거진 느낌의 레이아웃\n- 고급스러운 톤\n- 타이포 중심 디자인\n- 브랜드 컬러 활용",
  "- 카드 형식 슬라이드\n- 각 장마다 핵심 한 줄\n- 일러스트 또는 사진 혼합\n- 마지막 장에 CTA",
]

export interface GeneratedPlanContent {
  captions: { id: string; label: string; original: string }[]
  hashtags: string[]
  designRequest: string
}

export function generatePlanContent(id: string, title: string): GeneratedPlanContent {
  const h = hashId(id)
  const topic = extractTopic(title)
  const templateIdx = h % captionTemplates.length
  const texts = captionTemplates[templateIdx](topic)

  return {
    captions: texts.map((text, i) => ({
      id: `${i + 1}`,
      label: i === 0 ? "캡션 1 (썸네일)" : `캡션 ${i + 1}`,
      original: text,
    })),
    hashtags: ["#모레노", ...hashtagPool[h % hashtagPool.length]],
    designRequest: designRequestPool[h % designRequestPool.length],
  }
}

/** originalPlan용 캡션 (label+text 형태) */
export function generateOriginalPlanCaptions(id: string, title: string): { label: string; text: string }[] {
  const { captions } = generatePlanContent(id, title)
  return captions.map((c) => ({ label: c.label.replace(" (썸네일)", ""), text: c.original }))
}

// --- Sprint pipeline visibility logic ---
// Sprint N = 콘텐츠가 업로드/게시되는 주차 (Week C)
// Pipeline (역방향):
//   Sprint N-2 (Week A): 기획서 작성, 빌더 완성 시 개별 전달 (기존: 금요일 16:00 일괄)
//   Sprint N-1 (Week B): 콘텐츠 제작, 빌더 컨펌 완료 시 개별 전달 (기존: 일요일 24:00 일괄)
//   Sprint N   (Week C): 클라이언트 컨펌 + 업로드
//
// 기획서 컨펌 마감: Monday of Sprint N-1 (15:00)
// 콘텐츠 컨펌 마감: Monday of Sprint N (12:00)
// 콘텐츠 피드백 분기: 해당 주 금요일 24:00 (이전=수정 요청, 이후=이월)

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00")
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** 기획서 컨펌 윈도우: Sprint N 기획서 → Friday of Sprint N-2 ~ Monday of Sprint N-1 */
export function getPlanningConfirmWindow(sprintId: number): { start: string; end: string; deadlineSprint: number } | null {
  const weekA = sprints.find((s) => s.id === sprintId - 2) // 기획 주차
  const weekB = sprints.find((s) => s.id === sprintId - 1) // 제작 주차 (마감일이 여기 월요일)
  if (!weekA) return null
  const friday = addDays(weekA.startDate, 4) // Mon + 4 = Fri
  const deadline = weekB ? weekB.startDate : addDays(weekA.endDate, 1) // Monday of next sprint
  return { start: friday, end: deadline, deadlineSprint: sprintId - 1 }
}

/** 콘텐츠 컨펌 윈도우: Sprint N 콘텐츠 → Sunday of Sprint N-1 ~ Monday of Sprint N */
export function getContentConfirmWindow(sprintId: number): { start: string; end: string; deadlineSprint: number } | null {
  const weekB = sprints.find((s) => s.id === sprintId - 1) // 제작 주차
  const weekC = sprints.find((s) => s.id === sprintId) // 컨펌 주차
  if (!weekB) return null
  const sunday = weekB.endDate // Sunday of production week
  const deadline = weekC ? weekC.startDate : addDays(weekB.endDate, 1) // Monday of confirm week
  return { start: sunday, end: deadline, deadlineSprint: sprintId }
}

/**
 * 콘텐츠 피드백 금요일 24시 커트오프 날짜.
 * 이 날짜 이하이면 "수정 요청" 가능, 초과이면 "이월".
 * 계산: 콘텐츠 컨펌 마감(월요일) - 3일 = 금요일
 */
export function getContentFridayCutoff(sprintId: number): string | null {
  const window = getContentConfirmWindow(sprintId)
  if (!window) return null
  return addDays(window.end, -3)
}

/** 대시보드 기획서 컨펌: deliveredAt 기반 개별 필터링 */
export function getVisiblePlanningItems(todayStr: string): ContentItem[] {
  return allContents.filter((c) => {
    if (!c.planningDeliveredAt) return false
    if (c.planningDeliveredAt > todayStr) return false // 아직 전달 안 됨
    const window = getPlanningConfirmWindow(c.sprint)
    if (!window) return false
    return todayStr <= window.end // 마감 전까지만 표시
  })
}

/** 대시보드 콘텐츠 컨펌: deliveredAt 기반 개별 필터링 */
export function getVisibleContentItems(todayStr: string): ContentItem[] {
  return allContents.filter((c) => {
    if (!c.contentDeliveredAt) return false
    if (c.contentDeliveredAt > todayStr) return false // 아직 전달 안 됨
    const window = getContentConfirmWindow(c.sprint)
    if (!window) return false
    return todayStr <= window.end // 마감 전까지만 표시
  })
}

/** B안/C안용: 대시보드에 항상 표시할 항목 + 전달 현황 */
export interface DashboardItems {
  planningConfirm: ContentItem[]
  contentConfirm: ContentItem[]
  uploadPending: ContentItem[]
  uploadComplete: ContentItem[]
  pendingPlanningCount: number
  pendingContentCount: number
  nextPlanningDeadline: string | null
  nextContentDeadline: string | null
  deliveredPlanningCount: number
  totalPlanningCount: number
  deliveredContentCount: number
  totalContentCount: number
  planningDeliveryDate: string | null  // 기획서 전달 마감일 (금요일)
  contentDeliveryDate: string | null   // 콘텐츠 전달 마감일 (일요일)
}

export function getDashboardItems(todayStr: string): DashboardItems {
  const planningConfirm = getVisiblePlanningItems(todayStr)
  const contentConfirm = getVisibleContentItems(todayStr)

  const currentSprint = sprints.find((s) => todayStr >= s.startDate && todayStr <= s.endDate)
  const prevSprint = currentSprint ? sprints.find((s) => s.id === currentSprint.id - 1) : null

  // 업로드 대기/완료: 현재 스프린트 및 직전 스프린트 항목 중 해당 상태인 것
  const relevantSprints = [currentSprint, prevSprint].filter(Boolean).map((s) => s!.id)
  const uploadPending = allContents.filter((c) => {
    if (!relevantSprints.includes(c.sprint)) return false
    return computeClientStatus(c, todayStr) === "업로드 대기"
  })
  const uploadComplete = allContents.filter((c) => {
    if (!relevantSprints.includes(c.sprint)) return false
    return computeClientStatus(c, todayStr) === "업로드 완료"
  })

  // 기획서 전달 현황: 가장 가까운 컨펌 윈도우의 스프린트 기준
  let pendingPlanningCount = 0
  let nextPlanningDeadline: string | null = null
  let deliveredPlanningCount = 0
  let totalPlanningCount = 0
  let planningDeliveryDate: string | null = null

  if (planningConfirm.length > 0) {
    const targetSprint = planningConfirm[0].sprint
    const w = getPlanningConfirmWindow(targetSprint)
    nextPlanningDeadline = w ? w.end : null
    planningDeliveryDate = w ? w.start : null
    const sprintItems = allContents.filter((c) => c.sprint === targetSprint)
    totalPlanningCount = sprintItems.length
    deliveredPlanningCount = sprintItems.filter((c) => c.planningDeliveredAt && c.planningDeliveredAt <= todayStr).length
    pendingPlanningCount = totalPlanningCount - deliveredPlanningCount
  } else {
    for (const sp of sprints) {
      const w = getPlanningConfirmWindow(sp.id)
      if (w && todayStr <= w.end) {
        const sprintItems = allContents.filter((c) => c.sprint === sp.id)
        totalPlanningCount = sprintItems.length
        deliveredPlanningCount = sprintItems.filter((c) => c.planningDeliveredAt && c.planningDeliveredAt <= todayStr).length
        pendingPlanningCount = totalPlanningCount - deliveredPlanningCount
        nextPlanningDeadline = w.end
        planningDeliveryDate = w.start
        break
      }
    }
  }

  // 콘텐츠 전달 현황
  let pendingContentCount = 0
  let nextContentDeadline: string | null = null
  let deliveredContentCount = 0
  let totalContentCount = 0
  let contentDeliveryDate: string | null = null

  if (contentConfirm.length > 0) {
    const targetSprint = contentConfirm[0].sprint
    const w = getContentConfirmWindow(targetSprint)
    nextContentDeadline = w ? w.end : null
    contentDeliveryDate = w ? w.start : null
    const sprintItems = allContents.filter((c) => c.sprint === targetSprint)
    totalContentCount = sprintItems.length
    deliveredContentCount = sprintItems.filter((c) => c.contentDeliveredAt && c.contentDeliveredAt <= todayStr).length
    pendingContentCount = totalContentCount - deliveredContentCount
  } else {
    for (const sp of sprints) {
      const w = getContentConfirmWindow(sp.id)
      if (w && todayStr <= w.end) {
        const sprintItems = allContents.filter((c) => c.sprint === sp.id)
        totalContentCount = sprintItems.length
        deliveredContentCount = sprintItems.filter((c) => c.contentDeliveredAt && c.contentDeliveredAt <= todayStr).length
        pendingContentCount = totalContentCount - deliveredContentCount
        nextContentDeadline = w.end
        contentDeliveryDate = w.start
        break
      }
    }
  }

  return {
    planningConfirm,
    contentConfirm,
    uploadPending,
    uploadComplete,
    pendingPlanningCount,
    pendingContentCount,
    nextPlanningDeadline,
    nextContentDeadline,
    deliveredPlanningCount,
    totalPlanningCount,
    deliveredContentCount,
    totalContentCount,
    planningDeliveryDate,
    contentDeliveryDate,
  }
}

/** 클라이언트 뷰 상태 계산 (캘린더, 상세 페이지용) */
export type ClientStatus =
  | "기획완료" | "검토중" | "수정 요청" | "수정완료" | "최종 확정"
  | "제작중" | "제작완료" | "승인완료"
  | "업로드 대기" | "업로드 완료"

export function computeClientStatus(content: ContentItem, todayStr: string): ClientStatus {
  // 피드백 상태가 있으면 우선 반환
  if (content.feedbackStatus === "수정 요청") return "수정 요청"
  if (content.feedbackStatus === "수정완료") return "수정완료"

  // 기획서: deliveredAt이 있고 마감 전이면 → 기획완료
  const planWindow = getPlanningConfirmWindow(content.sprint)
  if (content.planningDeliveredAt && planWindow) {
    if (content.planningDeliveredAt <= todayStr && todayStr <= planWindow.end) {
      return "기획완료"
    }
  }

  // 콘텐츠: deliveredAt이 있고 마감 전이면 → 제작완료
  const contentWindow = getContentConfirmWindow(content.sprint)
  if (content.contentDeliveredAt && contentWindow) {
    if (content.contentDeliveredAt <= todayStr && todayStr <= contentWindow.end) {
      return "제작완료"
    }
  }

  // 콘텐츠 컨펌 윈도우 이후 → 업로드 대기 or 완료
  if (contentWindow && todayStr > contentWindow.end) {
    const uploadSprint = sprints.find((s) => s.id === content.sprint)
    if (uploadSprint && todayStr > uploadSprint.endDate) return "업로드 완료"
    return "업로드 대기"
  }

  // 기획서 컨펌 윈도우 이후 & 콘텐츠 컨펌 윈도우 이전 → 제작중
  if (planWindow && todayStr > planWindow.end) {
    if (!contentWindow || todayStr < contentWindow.start) return "제작중"
  }

  return "제작중"
}

// --- 전달 메시지 헬퍼 (대시보드 공통) ---

function formatDateWithDay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
  return `${d.getMonth() + 1}/${d.getDate()}(${dayNames[d.getDay()]})`
}

/** 전달 예정 뱃지 메시지 (비어있을 때 파란 뱃지용) */
export function getNextDeliveryBadge(delivered: number, total: number, deliveryDate: string | null): string {
  if (!deliveryDate) return ""
  const formatted = formatDateWithDay(deliveryDate)
  if (total === 0) return `${formatted} 까지`
  if (delivered === 0) return `${formatted} 까지`
  if (delivered >= total) return ""
  return `${delivered}/${total}건 전달완료 · ${formatted} 까지`
}
