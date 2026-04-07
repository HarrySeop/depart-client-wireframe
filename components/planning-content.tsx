"use client"

import * as React from "react"
import { Download, FileText, Image as ImageIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface CaptionData {
  id: string
  label: string
  original: string
  edited?: string
}

interface PlanningData {
  title: string
  contentType: string
  builder: string
  sprint: string
  captions: CaptionData[]
  hashtags: string[]
  addedHashtags?: string[]
  designRequest: string
  referenceFiles: { name: string; type: "image" | "file"; src?: string }[]
  selectedTemplateImages?: { src: string; alt: string }[]
}

interface PlanningContentProps {
  data: PlanningData
  isEditMode: boolean
  onDataChange?: (data: PlanningData) => void
  onImageClick?: (images: { src: string; alt: string }[], index: number) => void
}

// Inline diff component — shows deleted (strikethrough) and added (underline) in same line
function TrackedText({
  original,
  edited,
}: {
  original: string
  edited?: string
}) {
  if (!edited || original === edited) {
    return <span>{original}</span>
  }

  // Find common prefix
  let prefixEnd = 0
  while (
    prefixEnd < original.length &&
    prefixEnd < edited.length &&
    original[prefixEnd] === edited[prefixEnd]
  ) {
    prefixEnd++
  }

  // Find common suffix
  let suffixStart = 0
  while (
    suffixStart < original.length - prefixEnd &&
    suffixStart < edited.length - prefixEnd &&
    original[original.length - 1 - suffixStart] ===
      edited[edited.length - 1 - suffixStart]
  ) {
    suffixStart++
  }

  const prefix = original.slice(0, prefixEnd)
  const deletedPart = original.slice(prefixEnd, original.length - suffixStart)
  const insertedPart = edited.slice(prefixEnd, edited.length - suffixStart)
  const suffix = original.slice(original.length - suffixStart)

  return (
    <span>
      {prefix}
      {deletedPart && (
        <span
          className="font-bold line-through"
          style={{ color: "#dd3d2e" }}
        >
          {deletedPart}
        </span>
      )}
      {deletedPart && insertedPart && " "}
      {insertedPart && (
        <span
          className="font-bold underline"
          style={{ color: "#dd3d2e" }}
        >
          {insertedPart}
        </span>
      )}
      {suffix}
    </span>
  )
}

export function PlanningContent({
  data,
  isEditMode,
  onDataChange,
  onImageClick,
}: PlanningContentProps) {
  const updateCaption = (id: string, value: string) => {
    if (!onDataChange) return
    const newCaptions = data.captions.map((c) =>
      c.id === id ? { ...c, edited: value } : c
    )
    onDataChange({ ...data, captions: newCaptions })
  }

  const updateHashtags = (value: string) => {
    if (!onDataChange) return
    const tags = value.split(" ").filter((t) => t.startsWith("#"))
    const newTags = tags.filter((t) => !data.hashtags.includes(t))
    onDataChange({ ...data, addedHashtags: newTags })
  }

  const updateDesignRequest = (value: string) => {
    if (!onDataChange) return
    onDataChange({ ...data, designRequest: value })
  }

  const imageFiles = data.referenceFiles.filter((f) => f.type === "image")

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Title Section */}
        <section className="rounded-lg bg-card border border-border p-4">
          <h3 className="text-xs font-medium text-muted-foreground mb-2">
            기획안 제목
          </h3>
          {isEditMode ? (
            <Input
              value={data.title}
              onChange={(e) =>
                onDataChange?.({ ...data, title: e.target.value })
              }
              className="text-lg font-medium"
            />
          ) : (
            <p className="text-lg font-medium">{data.title}</p>
          )}
        </section>

        {/* Content Type + Builder + Sprint */}
        <section className="rounded-lg bg-card border border-border p-4">
          <h3 className="text-xs font-medium text-muted-foreground mb-2">
            콘텐츠 타입
          </h3>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-500/15 text-blue-600 border border-blue-500/30">
              {data.contentType}
            </span>
            <span className="text-sm text-muted-foreground">
              빌더: {data.builder}
            </span>
            <span className="text-sm text-muted-foreground">
              {data.sprint}
            </span>
          </div>
        </section>

        {/* Captions */}
        {data.captions.map((caption) => (
          <section
            key={caption.id}
            className="rounded-lg bg-card border border-border p-4"
          >
            <h3 className="text-xs font-medium text-muted-foreground mb-2">
              {caption.label}
            </h3>
            {isEditMode ? (
              <div className="space-y-2">
                {/* Real-time inline diff preview */}
                <div className="text-sm leading-relaxed p-3 rounded-md bg-muted/50 border border-border/50">
                  <TrackedText
                    original={caption.original}
                    edited={caption.edited ?? caption.original}
                  />
                </div>
                {/* Edit textarea */}
                <Textarea
                  value={caption.edited ?? caption.original}
                  onChange={(e) => updateCaption(caption.id, e.target.value)}
                  className="min-h-[60px] text-sm resize-none"
                  placeholder="수정할 내용을 입력하세요..."
                />
              </div>
            ) : (
              <p className="text-sm leading-relaxed">
                {caption.edited && caption.edited !== caption.original ? (
                  <TrackedText
                    original={caption.original}
                    edited={caption.edited}
                  />
                ) : (
                  caption.original
                )}
              </p>
            )}
          </section>
        ))}

        {/* Hashtags */}
        <section className="rounded-lg bg-card border border-border p-4">
          <h3 className="text-xs font-medium text-muted-foreground mb-3">
            해시태그
          </h3>
          {isEditMode ? (
            <div className="space-y-2">
              {/* Live preview of hashtag changes */}
              <div className="flex flex-wrap gap-2 p-3 rounded-md bg-muted/50 border border-border/50">
                {data.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-foreground"
                  >
                    {tag}
                  </span>
                ))}
                {data.addedHashtags?.map((tag, idx) => (
                  <span
                    key={`added-${idx}`}
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold underline"
                    style={{ color: "#dd3d2e" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Input
                value={[...data.hashtags, ...(data.addedHashtags || [])].join(" ")}
                onChange={(e) => updateHashtags(e.target.value)}
                className="text-sm"
                placeholder="#태그1 #태그2"
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-foreground"
                >
                  {tag}
                </span>
              ))}
              {data.addedHashtags?.map((tag, idx) => (
                <span
                  key={`added-${idx}`}
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold underline"
                  style={{ color: "#dd3d2e" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Design Request */}
        <section className="rounded-lg bg-card border border-border p-4">
          <h3 className="text-xs font-medium text-muted-foreground mb-2">
            디자인 요청사항
          </h3>
          {isEditMode ? (
            <Textarea
              value={data.designRequest}
              onChange={(e) => updateDesignRequest(e.target.value)}
              className="min-h-[100px] text-sm resize-none"
            />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {data.designRequest}
            </p>
          )}
        </section>

        {/* Selected Template Images */}
        {data.selectedTemplateImages && data.selectedTemplateImages.length > 0 && (
          <section className="rounded-lg bg-card border border-border p-4">
            <h3 className="text-xs font-medium text-muted-foreground mb-3">
              선택된 디자인 템플릿
            </h3>
            <div className="flex gap-2 flex-wrap">
              {data.selectedTemplateImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    onImageClick?.(data.selectedTemplateImages!, idx)
                  }
                  className="relative w-20 h-20 rounded-md overflow-hidden border-2 border-blue-500 hover:border-blue-600 transition-colors"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Reference Files */}
        <section className="rounded-lg bg-card border border-border p-4">
          <h3 className="text-xs font-medium text-muted-foreground mb-3">
            레퍼런스 파일
          </h3>
          <div className="space-y-3">
            {imageFiles.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {imageFiles.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      onImageClick?.(
                        imageFiles.map((f) => ({
                          src: f.src || "/placeholder.svg",
                          alt: f.name,
                        })),
                        idx
                      )
                    }
                    className="relative w-20 h-20 rounded-md overflow-hidden border border-border hover:border-muted-foreground/50 transition-colors"
                  >
                    <img
                      src={file.src || "/placeholder.svg"}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
                  </button>
                ))}
              </div>
            )}
            {data.referenceFiles
              .filter((f) => f.type === "file")
              .map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <FileText className="size-4" />
                  <span>{file.name}</span>
                  <button className="ml-auto p-1 hover:text-foreground transition-colors">
                    <Download className="size-4" />
                  </button>
                </div>
              ))}
          </div>
        </section>
      </div>
    </ScrollArea>
  )
}

export type { PlanningData, CaptionData }
