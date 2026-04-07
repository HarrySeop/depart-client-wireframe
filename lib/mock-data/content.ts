import type { FeedbackComment } from "@/components/feedback-panel"
import { allContents, getCardNewsImages, getMockFeedback, generateOriginalPlanCaptions, generatePlanContent } from "./contents"

export interface ContentData {
  title: string
  contentType: string
  partner: string
  images: { src: string; alt: string }[]
  videoUrl?: string
  originalPlan: {
    title: string
    captions: { label: string; text: string }[]
    hashtags: string[]
  }
}

const defaultContentData: ContentData = {
  title: "카드뉴스 #60 - 청바지 오래 입는 관리 방법",
  contentType: "카드뉴스",
  partner: "박서연",
  images: Array.from({ length: 6 }, (_, i) => ({
    src: `https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop&sat=-30&bri=${5 + i * 3}`,
    alt: `콘텐츠 이미지 ${i + 1}`,
  })),
  originalPlan: {
    title: "카드뉴스 #60 - 청바지 오래 입는 관리 방법",
    captions: [
      { label: "캡션 1", text: "청바지, 잘 관리하면 10년도 입을 수 있습니다." },
      { label: "캡션 2", text: "세탁은 뒤집어서, 찬물에, 중성세제로." },
      { label: "캡션 3", text: "건조기 대신 자연 건조가 원단을 지켜줍니다." },
      { label: "캡션 4", text: "보관할 때는 접어서 서랍에, 걸면 허리가 늘어납니다." },
      { label: "캡션 5", text: "작은 습관 하나로 청바지의 수명이 달라집니다." },
      { label: "캡션 6", text: "오늘부터 청바지를 아끼는 방법, 시작해보세요." },
    ],
    hashtags: ["#라트로프", "#청바지관리", "#데님케어", "#옷관리팁"],
  },
}

const defaultContentFeedback: FeedbackComment[] = [
  {
    id: "1",
    author: "클라이언트(나)",
    authorType: "client",
    content: "3번째 이미지에서 텍스트가 잘 안 보여요. 폰트 크기를 키워주세요.",
    timestamp: "4/13 09:00",
    replies: [],
  },
  {
    id: "2",
    author: "클라이언트(나)",
    authorType: "client",
    content: "마지막 이미지에 브랜드 로고가 빠져있습니다.",
    timestamp: "4/13 09:05",
    replies: [],
  },
]

// Legacy exports for backward compatibility
export const contentDetailData = defaultContentData
export const contentFeedback = defaultContentFeedback

export function getContentDetailById(id: string): { data: ContentData; feedback: FeedbackComment[]; sprint: number } {
  const content = allContents.find((c) => c.id === id)
  if (!content) {
    return { data: defaultContentData, feedback: defaultContentFeedback, sprint: 13 }
  }

  const isShortForm = content.contentType === "SHORT_FORM"
  const images = isShortForm ? [] : getCardNewsImages(id)

  const data: ContentData = {
    title: content.title,
    contentType: content.contentTypeLabel,
    partner: content.designerName,
    images,
    ...(isShortForm && {
      videoUrl: "/sample-reel.mp4",
    }),
    originalPlan: {
      title: content.title,
      captions: generateOriginalPlanCaptions(id, content.title),
      hashtags: generatePlanContent(id, content.title).hashtags,
    },
  }

  const feedback: FeedbackComment[] = getMockFeedback(id)

  return { data, feedback, sprint: content.sprint }
}
