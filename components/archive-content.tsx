"use client"

import * as React from "react"
import { FileText, Image as ImageIcon, Download, ExternalLink } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageViewer } from "./image-viewer"

interface BrandDocument {
  id: string
  title: string
  description: string
  type: "pdf" | "link" | "file"
  updatedAt: string
}

interface DesignTemplateSet {
  id: string
  name: string
  description: string
  images: { src: string; alt: string }[]
}

const brandDocuments: BrandDocument[] = [
  {
    id: "1",
    title: "브랜드 가이드라인",
    description: "로고, 컬러, 타이포그래피 등 브랜드 기초 규정",
    type: "pdf",
    updatedAt: "2026-03-15",
  },
  {
    id: "2",
    title: "톤앤매너 가이드",
    description: "SNS 채널별 문체, 어조, 금지 표현 안내",
    type: "pdf",
    updatedAt: "2026-03-20",
  },
  {
    id: "3",
    title: "제품 카탈로그 (2026 S/S)",
    description: "시즌별 제품 정보 및 이미지 자료",
    type: "file",
    updatedAt: "2026-03-01",
  },
  {
    id: "4",
    title: "경쟁사 레퍼런스",
    description: "주요 경쟁 브랜드 콘텐츠 분석 자료",
    type: "link",
    updatedAt: "2026-02-28",
  },
]

const designTemplateSets: DesignTemplateSet[] = [
  {
    id: "A",
    name: "A안 — 미니멀 클린",
    description: "깔끔한 여백과 제품 중심의 미니멀 레이아웃",
    images: Array.from({ length: 6 }, (_, i) => ({
      src: `https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop&sat=-100&bri=${10 + i * 5}`,
      alt: `A안 ${i + 1}번`,
    })),
  },
  {
    id: "B",
    name: "B안 — 스트리트 캐주얼",
    description: "착용 이미지 중심, 도시적 감성의 레이아웃",
    images: Array.from({ length: 6 }, (_, i) => ({
      src: `https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&h=300&fit=crop&sat=-100&bri=${10 + i * 5}`,
      alt: `B안 ${i + 1}번`,
    })),
  },
  {
    id: "C",
    name: "C안 — 내추럴 무드",
    description: "자연광, 따뜻한 톤의 라이프스타일 무드",
    images: Array.from({ length: 6 }, (_, i) => ({
      src: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&sat=-100&bri=${10 + i * 5}`,
      alt: `C안 ${i + 1}번`,
    })),
  },
]

export function ArchiveContent() {
  const [viewerOpen, setViewerOpen] = React.useState(false)
  const [viewerImages, setViewerImages] = React.useState<{ src: string; alt: string }[]>([])
  const [viewerIndex, setViewerIndex] = React.useState(0)

  const openImageViewer = (images: { src: string; alt: string }[], index: number) => {
    setViewerImages(images)
    setViewerIndex(index)
    setViewerOpen(true)
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Tabs defaultValue="brand" className="flex flex-col h-full">
        <div className="px-4 sm:px-6 pt-4">
          <TabsList>
            <TabsTrigger value="brand">브랜드 기초자료</TabsTrigger>
            <TabsTrigger value="templates">디자인 템플릿</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="brand" className="flex-1 m-0 overflow-auto">
          <div className="p-4 sm:p-6">
            <div className="grid gap-3">
              {brandDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:border-muted-foreground/30 transition-colors cursor-pointer"
                >
                  <div className="shrink-0 p-2.5 rounded-lg bg-muted">
                    {doc.type === "link" ? (
                      <ExternalLink className="size-5 text-muted-foreground" />
                    ) : (
                      <FileText className="size-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium">{doc.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {doc.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      업데이트: {doc.updatedAt}
                    </p>
                  </div>
                  <button className="shrink-0 p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                    <Download className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="flex-1 m-0 overflow-auto">
          <div className="p-4 sm:p-6 space-y-6">
            {designTemplateSets.map((template) => (
              <div
                key={template.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="mb-3">
                  <h3 className="text-sm font-semibold">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {template.description}
                  </p>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {template.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => openImageViewer(template.images, idx)}
                      className="aspect-square rounded-md overflow-hidden border border-border hover:border-muted-foreground/50 transition-colors"
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <ImageViewer
        images={viewerImages}
        initialIndex={viewerIndex}
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  )
}
