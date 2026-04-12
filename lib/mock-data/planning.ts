import type { PlanningData } from "@/components/planning-content"
import type { FeedbackComment } from "@/components/feedback-panel"
import { allContents, getMockFeedback, generatePlanContent } from "./contents"

// Per-item unique planning content
const planningContentMap: Record<string, Pick<PlanningData, "captions" | "hashtags" | "designRequest" | "referenceFiles" | "selectedTemplateImages">> = {
  // #66 - 여름 출근룩, 격식과 편안함 사이에서
  "879": {
    captions: [
      {
        id: "1",
        label: "캡션 1 (썸네일)",
        original: "여름 출근룩, 매일 고민되시나요?",
        designRequest: "- 썸네일용 강한 비주얼\n- 밝은 톤, 시원한 느낌\n- 타이틀 텍스트 공간 확보",
        designReferenceImages: [
          { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", alt: "여름 오피스룩 레퍼런스 1" },
          { src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop", alt: "여름 오피스룩 레퍼런스 2" },
        ],
        attachmentUrl: "https://www.pinterest.com/summer-office-inspo",
      },
      { id: "2", label: "캡션 2", original: "에어컨 빵빵한 사무실과 찜통 같은 바깥, 둘 다 대비해야 합니다." },
      {
        id: "3",
        label: "캡션 3",
        original: "격식을 갖추면서도 시원한 소재를 선택하는 것이 핵심입니다.",
        designRequest: "- 소재 클로즈업 컷\n- 냉감 소재 질감 강조",
        designReferenceImages: [
          { src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop", alt: "소재 클로즈업 레퍼런스" },
        ],
      },
      { id: "4", label: "캡션 4", original: "얇은 울 블렌드 슬랙스는 냉방과 더위 모두에 대응할 수 있습니다." },
      {
        id: "5",
        label: "캡션 5",
        original: "셔츠 대신 니트 폴로를 매치하면 캐주얼하면서도 단정한 인상을 줍니다.",
        attachmentUrl: "https://example.com/knit-polo-guide",
      },
      { id: "6", label: "캡션 6", original: "올여름, 출근길에서도 스타일을 포기하지 마세요." },
    ],
    hashtags: ["#모레노", "#여름출근룩", "#오피스룩", "#슬랙스코디", "#남자여름패션"],
    designRequest: "- 사무실 + 야외 대비 이미지 구성\n- 밝고 시원한 톤\n- 소재 클로즈업 컷 포함\n- 착장 전후 비교 느낌",
    referenceFiles: [
      { name: "summer-office-01.jpg", type: "image", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
      { name: "fabric-detail.jpg", type: "image", src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop" },
    ],
    selectedTemplateImages: [
      { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&sat=-100&bri=20", alt: "B안 1번" },
    ],
  },
  // #65 - 라인업을 확장하기 전에 먼저 해야 할 일
  "874": {
    captions: [
      { id: "1", label: "캡션 1 (썸네일)", original: "새로운 제품을 출시하고 싶은 마음, 충분히 이해합니다." },
      { id: "2", label: "캡션 2", original: "하지만 기존 제품이 충분히 완성되었는지 먼저 점검해야 합니다." },
      { id: "3", label: "캡션 3", original: "핏, 소재, 디테일 — 하나의 제품을 끝까지 다듬는 과정이 브랜드의 기준이 됩니다." },
      { id: "4", label: "캡션 4", original: "고객이 재구매하는 이유는 새로운 제품이 아니라 신뢰할 수 있는 품질입니다." },
      { id: "5", label: "캡션 5", original: "라인업 확장은 기본기를 완성한 뒤에 해도 늦지 않습니다." },
      { id: "6", label: "캡션 6", original: "모레노는 하나의 바지를 완벽하게 만드는 것부터 시작했습니다." },
    ],
    hashtags: ["#모레노", "#브랜드철학", "#품질관리", "#패션브랜딩", "#기본에충실"],
    designRequest: "- 브랜드 스토리텔링 느낌\n- 제작 과정 이미지 활용\n- 차분하고 진중한 톤\n- 텍스트 비중 높여도 OK",
    referenceFiles: [
      { name: "brand-story-ref.jpg", type: "image", src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop" },
    ],
    selectedTemplateImages: [
      { src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&sat=-100&bri=20", alt: "C안 2번" },
    ],
  },
  // #64 - 모레노 팬츠는 레귤러 핏부터 시작합니다
  "872": {
    captions: [
      { id: "1", label: "캡션 1 (썸네일)", original: "왜 레귤러 핏부터일까요?" },
      { id: "2", label: "캡션 2", original: "슬림핏, 와이드핏 — 유행은 계속 바뀝니다." },
      { id: "3", label: "캡션 3", original: "하지만 레귤러 핏은 체형과 상관없이 가장 많은 사람에게 어울립니다." },
      { id: "4", label: "캡션 4", original: "허벅지에 여유가 있으면서도 깔끔한 실루엣을 유지하는 것이 핵심입니다." },
      { id: "5", label: "캡션 5", original: "모레노의 레귤러 핏은 수백 번의 피팅을 거쳐 완성되었습니다." },
      { id: "6", label: "캡션 6", original: "기본 중의 기본, 그래서 가장 어려운 핏입니다." },
    ],
    hashtags: ["#모레노", "#레귤러핏", "#팬츠핏가이드", "#남자바지", "#기본핏"],
    designRequest: "- 핏 비교 이미지 (슬림/레귤러/와이드)\n- 깔끔한 흰 배경\n- 사이즈 스펙 인포그래픽\n- 착용 실루엣 강조",
    referenceFiles: [
      { name: "fit-comparison.jpg", type: "image", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" },
      { name: "silhouette-ref.jpg", type: "image", src: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400&h=400&fit=crop" },
    ],
    selectedTemplateImages: [
      { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&sat=-100&bri=20", alt: "A안 1번" },
    ],
  },
  // #63 - 폴리에스터, 바지에 왜 자주 쓰일까요? (기존 기본값과 유사하지만 주제에 맞게 조정)
  "873": {
    captions: [
      { id: "1", label: "캡션 1 (썸네일)", original: "폴리에스터라고 하면 어떤 이미지가 떠오르시나요?" },
      { id: "2", label: "캡션 2", original: "값싸고 뻣뻣한 소재? 그건 10년 전 이야기입니다." },
      { id: "3", label: "캡션 3", original: "최근의 폴리에스터는 구김이 적고, 가볍고, 관리가 쉽습니다." },
      { id: "4", label: "캡션 4", original: "면 바지는 세탁할수록 변형되지만, 폴리 블렌드는 형태를 오래 유지합니다." },
      { id: "5", label: "캡션 5", original: "출장이 잦거나 관리가 번거로운 분들에게 특히 추천드립니다." },
      { id: "6", label: "캡션 6", original: "소재에 대한 편견을 버리면 선택지가 넓어집니다." },
    ],
    hashtags: ["#모레노", "#폴리에스터", "#소재이야기", "#바지소재", "#관리편한바지"],
    designRequest: "- 소재 확대 이미지 중심\n- 면 vs 폴리 비교 구성\n- 미니멀하고 깔끔한 느낌\n- 텍스트는 최소화",
    referenceFiles: [
      { name: "lookbook-spring.jpg", type: "image", src: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop" },
      { name: "style-ref-01.png", type: "image", src: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=400&fit=crop" },
    ],
    selectedTemplateImages: [
      { src: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop&sat=-100&bri=20", alt: "A안 3번" },
    ],
  },
  // #62 - 봄에는 이렇게 입어보세요
  "823": {
    captions: [
      { id: "1", label: "캡션 1 (썸네일)", original: "봄이 왔는데 아직 겨울 옷장 그대로인가요?" },
      { id: "2", label: "캡션 2", original: "두꺼운 코트를 벗으면 오히려 뭘 입어야 할지 막막해집니다." },
      { id: "3", label: "캡션 3", original: "봄 스타일링의 핵심은 레이어링입니다." },
      { id: "4", label: "캡션 4", original: "얇은 니트 위에 가벼운 재킷, 아래는 면 혼방 치노 팬츠면 충분합니다." },
      { id: "5", label: "캡션 5", original: "색감은 베이지, 카키, 라이트 그레이처럼 부드러운 톤을 추천합니다." },
      { id: "6", label: "캡션 6", original: "계절이 바뀔 때마다 새 옷을 살 필요는 없습니다. 조합을 바꾸면 됩니다." },
    ],
    hashtags: ["#모레노", "#봄코디", "#남자봄패션", "#레이어링", "#치노팬츠"],
    designRequest: "- 봄 느낌 따뜻한 자연광\n- 야외 촬영 이미지 중심\n- 파스텔/뉴트럴 톤\n- 코디 조합 예시 3가지",
    referenceFiles: [
      { name: "spring-lookbook.jpg", type: "image", src: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=400&fit=crop" },
      { name: "layering-ref.jpg", type: "image", src: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=400&fit=crop" },
    ],
    selectedTemplateImages: [
      { src: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=200&h=200&fit=crop&sat=-100&bri=20", alt: "B안 2번" },
    ],
  },
}

// Default fallback data (used when ID not found and not in map)
const defaultPlanningData: PlanningData = {
  title: "카드뉴스 #63 - 폴리에스터, 바지에 왜 많이 쓰일까",
  contentType: "카드뉴스",
  builder: "김동현",
  sprint: "Sp.16 제작",
  captions: planningContentMap["873"].captions,
  hashtags: planningContentMap["873"].hashtags,
  addedHashtags: [],
  designRequest: planningContentMap["873"].designRequest,
  referenceFiles: planningContentMap["873"].referenceFiles,
  selectedTemplateImages: planningContentMap["873"].selectedTemplateImages,
}

const defaultPlanningFeedback: FeedbackComment[] = [
  {
    id: "1",
    author: "클라이언트(나)",
    authorType: "client",
    content: "캡션 5에서 네 가지 기준을 불릿 포인트 대신 한 문장으로 이어서 작성하면 더 자연스러울 것 같습니다.",
    timestamp: "4/12 10:30",
    replies: [
      {
        id: "1-1",
        author: "김동현",
        authorType: "builder",
        content: "네, 문장 흐름을 자연스럽게 수정하겠습니다.",
        timestamp: "4/12 11:00",
      },
    ],
  },
  {
    id: "2",
    author: "클라이언트(나)",
    authorType: "client",
    content: "해시태그에 #남자바지도 추가해주세요.",
    timestamp: "4/12 10:35",
    replies: [],
  },
]

// Legacy exports for backward compatibility
export const planningDetailData = defaultPlanningData
export const planningFeedback = defaultPlanningFeedback

export function getPlanningDetailById(id: string): { data: PlanningData; feedback: FeedbackComment[]; sprintNumber: number } {
  const content = allContents.find((c) => c.id === id)
  if (!content) {
    return { data: defaultPlanningData, feedback: defaultPlanningFeedback, sprintNumber: 13 }
  }

  const uniqueContent = planningContentMap[id]
  const generated = !uniqueContent ? generatePlanContent(id, content.title) : null

  const data: PlanningData = {
    ...defaultPlanningData,
    title: content.title,
    contentType: content.contentTypeLabel,
    builder: content.builderName,
    sprint: `Sp.${content.sprint} 제작`,
    ...(uniqueContent
      ? {
          captions: uniqueContent.captions,
          hashtags: uniqueContent.hashtags,
          designRequest: uniqueContent.designRequest,
          referenceFiles: uniqueContent.referenceFiles,
          selectedTemplateImages: uniqueContent.selectedTemplateImages,
        }
      : generated && {
          captions: generated.captions,
          hashtags: generated.hashtags,
          designRequest: generated.designRequest,
        }),
  }

  const mockFeedback = getMockFeedback(id)
  const feedback: FeedbackComment[] = mockFeedback.length > 0 ? mockFeedback : defaultPlanningFeedback

  return { data, feedback, sprintNumber: content.sprint }
}
