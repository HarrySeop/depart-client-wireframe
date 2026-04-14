"use client"

import * as React from "react"
import { ChevronDown, ChevronRight, Download, FileText, Image as ImageIcon, Link as LinkIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface CaptionData {
  id: string
  label: string
  original: string
  edited?: string
  // 캡션 레벨 디자인 요청사항 (새 A/B안 전용, optional)
  designRequest?: string
  designReferenceImages?: { src: string; alt: string }[]
  attachmentUrl?: string
}

interface PlanningData {
  title: string
  editedTitle?: string
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
  captionEditMode?: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H"
  onDataChange?: (data: PlanningData) => void
  onImageClick?: (images: { src: string; alt: string }[], index: number) => void
  panelRole?: "original" | "modified"
  diffStyle?: "strikethrough" | "background"
  showDiff?: boolean
  formOnly?: boolean
  layoutVariant?: "default" | "interleaved" | "grouped"
  openCaptionRequests?: Record<string, boolean>
  onToggleCaptionRequest?: (captionId: string) => void
  hideDesignSections?: boolean
  registerCardRef?: (key: string, el: HTMLElement | null) => void
  viewportRef?: React.Ref<HTMLDivElement>
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

// Background-style diff component — deleted (red bg) and added (green bg)
function TrackedTextBg({
  original,
  edited,
}: {
  original: string
  edited?: string
}) {
  if (!edited || original === edited) {
    return <span>{original}</span>
  }

  let prefixEnd = 0
  while (
    prefixEnd < original.length &&
    prefixEnd < edited.length &&
    original[prefixEnd] === edited[prefixEnd]
  ) {
    prefixEnd++
  }

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
          className="font-bold line-through rounded-sm px-0.5"
          style={{ backgroundColor: "#fecaca" }}
        >
          {deletedPart}
        </span>
      )}
      {deletedPart && insertedPart && " "}
      {insertedPart && (
        <span
          className="font-bold rounded-sm px-0.5"
          style={{ backgroundColor: "#bbf7d0" }}
        >
          {insertedPart}
        </span>
      )}
      {suffix}
    </span>
  )
}

// 캡션 레벨 디자인 요청사항 카드 (새 A/B안 전용, 읽기 전용)
function CaptionDesignRequestCard({
  caption,
  collapsible = false,
  isOpen = true,
  onToggle,
  onImageClick,
}: {
  caption: CaptionData
  collapsible?: boolean
  isOpen?: boolean
  onToggle?: () => void
  onImageClick?: (images: { src: string; alt: string }[], index: number) => void
}) {
  const hasContent =
    !!caption.designRequest ||
    (caption.designReferenceImages && caption.designReferenceImages.length > 0) ||
    !!caption.attachmentUrl

  if (!hasContent) return null

  const headerLabel = `${caption.label} 디자인 요청사항`
  const refImages = caption.designReferenceImages ?? []

  return (
    <section className="rounded-lg bg-card border border-border p-4 min-w-0">
      {collapsible ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex items-center gap-1 w-full text-left mb-2 hover:opacity-80 transition-opacity"
        >
          {isOpen ? (
            <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
          )}
          <span className="text-xs font-medium text-muted-foreground">
            {headerLabel}
          </span>
        </button>
      ) : (
        <h3 className="text-xs font-medium text-muted-foreground mb-2">
          {headerLabel}
        </h3>
      )}

      {(!collapsible || isOpen) && (
        <div className="space-y-3">
          {caption.designRequest && (
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {caption.designRequest}
            </p>
          )}

          {refImages.length > 0 && (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1.5">
                레퍼런스 이미지
              </div>
              <div className="flex gap-2 flex-wrap">
                {refImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => onImageClick?.(refImages, idx)}
                    className="relative w-20 h-20 rounded-md overflow-hidden border border-border hover:border-muted-foreground/50 transition-colors shrink-0"
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
          )}

          {caption.attachmentUrl && (
            <div className="min-w-0">
              <div className="text-xs font-medium text-muted-foreground mb-1.5">
                첨부 링크
              </div>
              <a
                href={caption.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline max-w-full"
              >
                <LinkIcon className="size-3.5 shrink-0" />
                <span className="truncate">{caption.attachmentUrl}</span>
              </a>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export function PlanningContent({
  data,
  isEditMode,
  captionEditMode = "A",
  onDataChange,
  onImageClick,
  panelRole,
  diffStyle = "strikethrough",
  showDiff = false,
  formOnly = false,
  layoutVariant = "default",
  openCaptionRequests,
  onToggleCaptionRequest,
  hideDesignSections = false,
  registerCardRef,
  viewportRef,
}: PlanningContentProps) {
  const updateTitle = (value: string) => {
    if (!onDataChange) return
    onDataChange({ ...data, editedTitle: value })
  }

  const updateCaption = (id: string, value: string) => {
    if (!onDataChange) return
    const newCaptions = data.captions.map((c) =>
      c.id === id ? { ...c, edited: value } : c
    )
    onDataChange({ ...data, captions: newCaptions })
  }

  const imageFiles = data.referenceFiles.filter((f) => f.type === "image")

  const DiffComponent = diffStyle === "background" ? TrackedTextBg : TrackedText

  return (
    <ScrollArea className="h-full" viewportRef={viewportRef}>
      <div className="p-6 space-y-6">
        {/* Title Section */}
        <section
          ref={(el) => registerCardRef?.("title", el)}
          className="rounded-lg bg-card border border-border p-4"
        >
          <h3 className="text-xs font-medium text-muted-foreground mb-2">
            기획안 제목
          </h3>
          {panelRole === "original" ? (
            showDiff && data.editedTitle && data.editedTitle !== data.title ? (
              <p className="text-lg font-medium">
                <DiffComponent
                  original={data.title}
                  edited={data.editedTitle}
                />
              </p>
            ) : (
              <p className="text-lg font-medium">{data.title}</p>
            )
          ) : isEditMode && panelRole === "modified" ? (
            formOnly ? (
              <Textarea
                value={data.editedTitle ?? data.title}
                onChange={(e) => updateTitle(e.target.value)}
                className="min-h-[40px] text-lg font-medium resize-none"
                placeholder="수정할 제목을 입력하세요..."
              />
            ) : captionEditMode === "D" ? (
              <div className="relative min-h-[40px]">
                <div
                  className="text-lg font-medium leading-relaxed p-3 rounded-md bg-muted/50 border border-border/50 whitespace-pre-wrap break-words min-h-[40px]"
                  aria-hidden="true"
                >
                  <DiffComponent
                    original={data.title}
                    edited={data.editedTitle ?? data.title}
                  />
                </div>
                <textarea
                  value={data.editedTitle ?? data.title}
                  onChange={(e) => updateTitle(e.target.value)}
                  className="absolute inset-0 w-full h-full text-lg font-medium leading-relaxed p-3 rounded-md bg-transparent resize-none outline-none border border-transparent focus:border-ring focus:ring-ring/50 focus:ring-[3px]"
                  style={{
                    color: "transparent",
                    caretColor: "var(--foreground)",
                  }}
                  placeholder="수정할 제목을 입력하세요..."
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-lg font-medium leading-relaxed p-3 rounded-md bg-muted/50 border border-border/50">
                  <DiffComponent
                    original={data.title}
                    edited={data.editedTitle ?? data.title}
                  />
                </div>
                <Textarea
                  value={data.editedTitle ?? data.title}
                  onChange={(e) => updateTitle(e.target.value)}
                  className="min-h-[40px] text-lg font-medium resize-none"
                  placeholder="수정할 제목을 입력하세요..."
                />
              </div>
            )
          ) : isEditMode && !panelRole ? (
            /* E/F 모드: 기존 동작 유지 */
            captionEditMode === "D" ? (
              <div className="relative min-h-[40px]">
                <div
                  className="text-lg font-medium leading-relaxed p-3 rounded-md bg-muted/50 border border-border/50 whitespace-pre-wrap break-words min-h-[40px]"
                  aria-hidden="true"
                >
                  <TrackedText
                    original={data.title}
                    edited={data.editedTitle ?? data.title}
                  />
                </div>
                <textarea
                  value={data.editedTitle ?? data.title}
                  onChange={(e) => updateTitle(e.target.value)}
                  className="absolute inset-0 w-full h-full text-lg font-medium leading-relaxed p-3 rounded-md bg-transparent resize-none outline-none border border-transparent focus:border-ring focus:ring-ring/50 focus:ring-[3px]"
                  style={{
                    color: "transparent",
                    caretColor: "var(--foreground)",
                  }}
                  placeholder="수정할 제목을 입력하세요..."
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-lg font-medium leading-relaxed p-3 rounded-md bg-muted/50 border border-border/50">
                  <TrackedText
                    original={data.title}
                    edited={data.editedTitle ?? data.title}
                  />
                </div>
                <Textarea
                  value={data.editedTitle ?? data.title}
                  onChange={(e) => updateTitle(e.target.value)}
                  className="min-h-[40px] text-lg font-medium resize-none"
                  placeholder="수정할 제목을 입력하세요..."
                />
              </div>
            )
          ) : (
            <p className="text-lg font-medium">
              {panelRole === "modified" && data.editedTitle && data.editedTitle !== data.title ? (
                <DiffComponent
                  original={data.title}
                  edited={data.editedTitle}
                />
              ) : data.editedTitle && data.editedTitle !== data.title ? (
                <TrackedText
                  original={data.title}
                  edited={data.editedTitle}
                />
              ) : (
                data.title
              )}
            </p>
          )}
        </section>

        {/* Content Type + Builder + Sprint */}
        <section
          ref={(el) => registerCardRef?.("contentType", el)}
          className="rounded-lg bg-card border border-border p-4"
        >
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
          <React.Fragment key={caption.id}>
          <section
            ref={(el) => registerCardRef?.(`caption-${caption.id}`, el)}
            className="rounded-lg bg-card border border-border p-4"
          >
            <h3 className="text-xs font-medium text-muted-foreground mb-2">
              {caption.label}
            </h3>
            {panelRole === "original" ? (
              showDiff && caption.edited && caption.edited !== caption.original ? (
                <p className="text-sm leading-relaxed">
                  <DiffComponent
                    original={caption.original}
                    edited={caption.edited}
                  />
                </p>
              ) : (
                <p className="text-sm leading-relaxed">{caption.original}</p>
              )
            ) : isEditMode && panelRole === "modified" ? (
              formOnly ? (
                <Textarea
                  value={caption.edited ?? caption.original}
                  onChange={(e) => updateCaption(caption.id, e.target.value)}
                  className="min-h-[60px] text-sm resize-none"
                  placeholder="수정할 내용을 입력하세요..."
                />
              ) : captionEditMode === "D" ? (
                <div className="relative min-h-[60px]">
                  <div
                    className="text-sm leading-relaxed p-3 rounded-md bg-muted/50 border border-border/50 whitespace-pre-wrap break-words min-h-[60px]"
                    aria-hidden="true"
                  >
                    <DiffComponent
                      original={caption.original}
                      edited={caption.edited ?? caption.original}
                    />
                  </div>
                  <textarea
                    value={caption.edited ?? caption.original}
                    onChange={(e) => updateCaption(caption.id, e.target.value)}
                    className="absolute inset-0 w-full h-full text-sm leading-relaxed p-3 rounded-md bg-transparent resize-none outline-none border border-transparent focus:border-ring focus:ring-ring/50 focus:ring-[3px]"
                    style={{
                      color: "transparent",
                      caretColor: "var(--foreground)",
                    }}
                    placeholder="수정할 내용을 입력하세요..."
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm leading-relaxed p-3 rounded-md bg-muted/50 border border-border/50">
                    <DiffComponent
                      original={caption.original}
                      edited={caption.edited ?? caption.original}
                    />
                  </div>
                  <Textarea
                    value={caption.edited ?? caption.original}
                    onChange={(e) => updateCaption(caption.id, e.target.value)}
                    className="min-h-[60px] text-sm resize-none"
                    placeholder="수정할 내용을 입력하세요..."
                  />
                </div>
              )
            ) : isEditMode && !panelRole ? (
              /* E/F 모드: 기존 동작 유지 */
              captionEditMode === "D" ? (
                <div className="relative min-h-[60px]">
                  <div
                    className="text-sm leading-relaxed p-3 rounded-md bg-muted/50 border border-border/50 whitespace-pre-wrap break-words min-h-[60px]"
                    aria-hidden="true"
                  >
                    <TrackedText
                      original={caption.original}
                      edited={caption.edited ?? caption.original}
                    />
                  </div>
                  <textarea
                    value={caption.edited ?? caption.original}
                    onChange={(e) => updateCaption(caption.id, e.target.value)}
                    className="absolute inset-0 w-full h-full text-sm leading-relaxed p-3 rounded-md bg-transparent resize-none outline-none border border-transparent focus:border-ring focus:ring-ring/50 focus:ring-[3px]"
                    style={{
                      color: "transparent",
                      caretColor: "var(--foreground)",
                    }}
                    placeholder="수정할 내용을 입력하세요..."
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm leading-relaxed p-3 rounded-md bg-muted/50 border border-border/50">
                    <TrackedText
                      original={caption.original}
                      edited={caption.edited ?? caption.original}
                    />
                  </div>
                  <Textarea
                    value={caption.edited ?? caption.original}
                    onChange={(e) => updateCaption(caption.id, e.target.value)}
                    className="min-h-[60px] text-sm resize-none"
                    placeholder="수정할 내용을 입력하세요..."
                  />
                </div>
              )
            ) : (
              <p className="text-sm leading-relaxed">
                {panelRole === "modified" && caption.edited && caption.edited !== caption.original ? (
                  <DiffComponent
                    original={caption.original}
                    edited={caption.edited}
                  />
                ) : caption.edited && caption.edited !== caption.original ? (
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
          {layoutVariant === "interleaved" && (
            <CaptionDesignRequestCard
              caption={caption}
              collapsible
              isOpen={openCaptionRequests?.[caption.id] ?? true}
              onToggle={() => onToggleCaptionRequest?.(caption.id)}
              onImageClick={onImageClick}
            />
          )}
          </React.Fragment>
        ))}

        {/* Hashtags */}
        <section
          ref={(el) => registerCardRef?.("hashtags", el)}
          className="rounded-lg bg-card border border-border p-4"
        >
          <h3 className="text-xs font-medium text-muted-foreground mb-3">
            해시태그
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.hashtags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-foreground"
              >
                {tag}
              </span>
            ))}
            {panelRole !== "original" && data.addedHashtags?.map((tag, idx) => (
              <span
                key={`added-${idx}`}
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
                  diffStyle === "background"
                    ? "rounded-sm"
                    : "underline"
                )}
                style={
                  diffStyle === "background"
                    ? { backgroundColor: "#bbf7d0" }
                    : { color: "#dd3d2e" }
                }
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Grouped caption design requests (B안) */}
        {layoutVariant === "grouped" && !hideDesignSections &&
          data.captions.map((caption) => (
            <CaptionDesignRequestCard
              key={`req-${caption.id}`}
              caption={caption}
              onImageClick={onImageClick}
            />
          ))}

        {/* Design Request (문서 레벨, default 레이아웃 전용) */}
        {layoutVariant === "default" && (
          <section className="rounded-lg bg-card border border-border p-4">
            <h3 className="text-xs font-medium text-muted-foreground mb-2">
              디자인 요청사항
            </h3>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {data.designRequest}
            </p>
          </section>
        )}

        {/* Selected Template Images */}
        {!hideDesignSections && data.selectedTemplateImages && data.selectedTemplateImages.length > 0 && (
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

        {/* Reference Files (문서 레벨, default 레이아웃 전용) */}
        {layoutVariant === "default" && (
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
        )}
      </div>
    </ScrollArea>
  )
}

export type { PlanningData, CaptionData }
