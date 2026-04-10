"use client"

import * as React from "react"
import { FileText, Plus, MoreVertical, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/components/ui/use-mobile"
import { ImageViewer } from "./image-viewer"
import { ArchiveAddDocumentDialog } from "./archive-add-document-dialog"

interface BrandDocument {
  id: string
  name: string
  links: string[]
  description: string
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
    name: "브랜드 키 컬러 등 디자인 가이드",
    links: ["https://instagram.com/iam_erkan/"],
    description: "레퍼런스 참고 필요..ㅠㅠ",
  },
  {
    id: "2",
    name: "BI 원본 파일",
    links: [],
    description: "페이지 내 파일 업로드",
  },
  {
    id: "3",
    name: "제품 이미지",
    links: ["https://drive.google.com/drive/folders/haring"],
    description: "구글 드라이브 링크 첨부",
  },
  {
    id: "4",
    name: "콘텐츠 주제",
    links: [],
    description: "하고 싶은 주제들을 정리해놓은 자료입니다.",
  },
  {
    id: "5",
    name: "라트로프 리뷰 모음",
    links: ["https://docs.google.com/spreadsheets/haring"],
    description: "라트로프 제품 리뷰를 모두 모아놓은 구글 시트입니다.",
  },
  {
    id: "6",
    name: "라트로프 창업 이야기",
    links: [],
    description: "",
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
  const isMobile = useIsMobile()
  const [documents, setDocuments] = React.useState<BrandDocument[]>(brandDocuments)
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
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
            <div className="flex justify-end mb-4">
              <Button size="sm" onClick={() => setAddDialogOpen(true)}>
                <Plus className="size-4 mr-1" />
                추가
              </Button>
            </div>

            {isMobile ? (
              /* Mobile: 카드 리스트 */
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-lg border border-border space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-muted-foreground shrink-0" />
                      <span className="text-sm font-bold truncate flex-1">{doc.name}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="shrink-0 size-7 text-muted-foreground">
                            <MoreVertical className="size-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="size-4" />
                            편집
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDocuments((prev) => prev.filter((d) => d.id !== doc.id))}
                          >
                            <Trash2 className="size-4" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {doc.description && (
                      <p className="text-sm text-foreground truncate pl-6">
                        {doc.description}
                      </p>
                    )}
                    {doc.links.length > 0 && (
                      <div className="pl-6 space-y-0.5">
                        {doc.links.map((link, i) => (
                          <a
                            key={i}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-foreground underline truncate py-0.5"
                          >
                            {link}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Desktop: 표 뷰 */
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[220px]">이름</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead className="w-[280px]">링크</TableHead>
                    <TableHead className="w-[50px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="size-4 text-muted-foreground shrink-0" />
                          <span className="font-bold">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        <p className="text-sm text-foreground">
                          {doc.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          {doc.links.map((link, i) => (
                            <a
                              key={i}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm text-foreground underline truncate max-w-[260px]"
                            >
                              {link}
                            </a>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="size-4" />
                              편집
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDocuments((prev) => prev.filter((d) => d.id !== doc.id))}
                            >
                              <Trash2 className="size-4" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="flex-1 m-0 overflow-auto">
          <div className="p-4 sm:p-6 space-y-6">
            {designTemplateSets.filter((t) => t.id === "A").map((template) => (
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

      <ArchiveAddDocumentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={(newDoc) => {
          setDocuments((prev) => [
            ...prev,
            { ...newDoc, id: String(Date.now()) },
          ])
        }}
      />

      <ImageViewer
        images={viewerImages}
        initialIndex={viewerIndex}
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  )
}
