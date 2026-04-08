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
  captionEditMode?: "A" | "B" | "C" | "D" | "E"
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

// --- C안 Helper Functions ---

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>")
}

function buildDiffHTML(original: string, edited: string): string {
  if (!edited || original === edited) {
    return escapeHTML(original)
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

  let html = ""
  if (prefix) html += escapeHTML(prefix)
  if (deletedPart) {
    html += `<span contenteditable="false" data-diff="deleted" class="font-bold line-through" style="color:#dd3d2e;user-select:none;-webkit-user-select:none;pointer-events:none;" aria-label="삭제된 텍스트" role="deletion">${escapeHTML(deletedPart)}</span>`
  }
  if (insertedPart) {
    html += `<span data-diff="inserted" class="font-bold underline" style="color:#dd3d2e;" role="insertion">${escapeHTML(insertedPart)}</span>`
  }
  if (suffix) html += escapeHTML(suffix)
  return html
}

function extractEditedText(container: HTMLDivElement): string {
  let text = ""
  for (const node of container.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? ""
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      if (el.dataset.diff === "deleted") continue
      if (el.tagName === "BR") {
        text += "\n"
        continue
      }
      // Handle nested <br> inside inserted spans
      if (el.dataset.diff === "inserted") {
        for (const child of el.childNodes) {
          if (child.nodeType === Node.TEXT_NODE) {
            text += child.textContent ?? ""
          } else if (
            child.nodeType === Node.ELEMENT_NODE &&
            (child as HTMLElement).tagName === "BR"
          ) {
            text += "\n"
          }
        }
        continue
      }
      text += el.textContent ?? ""
    }
  }
  return text
}

function isInsideDeleted(node: Node): boolean {
  let current: Node | null = node
  while (current) {
    if (
      current.nodeType === Node.ELEMENT_NODE &&
      (current as HTMLElement).dataset?.diff === "deleted"
    ) {
      return true
    }
    current = current.parentNode
  }
  return false
}

function saveCursorPosition(container: HTMLDivElement): number | null {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return null

  const range = sel.getRangeAt(0)

  // Check if cursor is within our container
  if (!container.contains(range.startContainer)) return null

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if (isInsideDeleted(node)) return NodeFilter.FILTER_REJECT
        if (node.nodeType === Node.ELEMENT_NODE) {
          if ((node as HTMLElement).tagName === "BR") return NodeFilter.FILTER_ACCEPT
          return NodeFilter.FILTER_SKIP
        }
        return NodeFilter.FILTER_ACCEPT
      },
    }
  )

  let offset = 0
  let currentNode: Node | null
  while ((currentNode = walker.nextNode())) {
    if (currentNode === range.startContainer) {
      offset += range.startOffset
      return offset
    }
    // If the cursor's container is the parent of this BR
    if (
      currentNode.nodeType === Node.ELEMENT_NODE &&
      (currentNode as HTMLElement).tagName === "BR"
    ) {
      // Check if this BR is at the cursor position
      if (
        range.startContainer === currentNode.parentNode &&
        Array.from(currentNode.parentNode!.childNodes).indexOf(
          currentNode as ChildNode
        ) < range.startOffset
      ) {
        offset += 1
        continue
      }
      offset += 1
      continue
    }
    offset += currentNode.textContent?.length ?? 0
  }

  return offset
}

function restoreCursorPosition(
  container: HTMLDivElement,
  targetOffset: number
): void {
  const sel = window.getSelection()
  if (!sel) return

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if (isInsideDeleted(node)) return NodeFilter.FILTER_REJECT
        if (node.nodeType === Node.ELEMENT_NODE) {
          if ((node as HTMLElement).tagName === "BR") return NodeFilter.FILTER_ACCEPT
          return NodeFilter.FILTER_SKIP
        }
        return NodeFilter.FILTER_ACCEPT
      },
    }
  )

  let remaining = targetOffset
  let currentNode: Node | null
  while ((currentNode = walker.nextNode())) {
    if (
      currentNode.nodeType === Node.ELEMENT_NODE &&
      (currentNode as HTMLElement).tagName === "BR"
    ) {
      if (remaining <= 1) {
        // Place cursor after this BR
        const range = document.createRange()
        const parent = currentNode.parentNode!
        const idx =
          Array.from(parent.childNodes).indexOf(currentNode as ChildNode) + 1
        range.setStart(parent, idx)
        range.collapse(true)
        sel.removeAllRanges()
        sel.addRange(range)
        return
      }
      remaining -= 1
      continue
    }
    const len = currentNode.textContent?.length ?? 0
    if (remaining <= len) {
      const range = document.createRange()
      range.setStart(currentNode, remaining)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
      return
    }
    remaining -= len
  }

  // Fallback: place cursor at end
  const range = document.createRange()
  range.selectNodeContents(container)
  range.collapse(false)
  sel.removeAllRanges()
  sel.addRange(range)
}

// --- C안 Component ---

function ContentEditableCaption({
  caption,
  onUpdate,
}: {
  caption: CaptionData
  onUpdate: (id: string, value: string) => void
}) {
  const divRef = React.useRef<HTMLDivElement>(null)
  const isComposingRef = React.useRef(false)
  const lastEditedRef = React.useRef(caption.edited ?? caption.original)
  const cursorOffsetRef = React.useRef<number | null>(null)
  const isMountedRef = React.useRef(false)

  // Initialize innerHTML on mount
  React.useEffect(() => {
    if (!divRef.current) return
    const edited = caption.edited ?? caption.original
    divRef.current.innerHTML = buildDiffHTML(caption.original, edited)
    lastEditedRef.current = edited
    isMountedRef.current = true
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync when caption.edited changes from OUTSIDE (e.g., reset/cancel)
  React.useEffect(() => {
    if (!isMountedRef.current) return
    const edited = caption.edited ?? caption.original
    if (edited === lastEditedRef.current) return
    if (!divRef.current) return

    const savedOffset = cursorOffsetRef.current
    divRef.current.innerHTML = buildDiffHTML(caption.original, edited)
    lastEditedRef.current = edited

    if (savedOffset !== null && document.activeElement === divRef.current) {
      restoreCursorPosition(divRef.current, savedOffset)
    }
  }, [caption.edited, caption.original])

  const processInput = React.useCallback(() => {
    if (isComposingRef.current) return
    if (!divRef.current) return

    const newText = extractEditedText(divRef.current)
    const cursorOffset = saveCursorPosition(divRef.current)

    // Always rebuild DOM synchronously to fix structural issues
    // (e.g. browser removing contentEditable="false" deleted spans on Backspace)
    divRef.current.innerHTML = buildDiffHTML(caption.original, newText)

    // Restore cursor synchronously — no rAF delay
    if (cursorOffset !== null && document.activeElement === divRef.current) {
      restoreCursorPosition(divRef.current, cursorOffset)
    }

    // Only notify parent if text actually changed
    if (newText !== lastEditedRef.current) {
      lastEditedRef.current = newText
      onUpdate(caption.id, newText)
    }
  }, [caption.id, caption.original, onUpdate])

  const handleInput = React.useCallback(() => {
    processInput()
  }, [processInput])

  const handleCompositionStart = React.useCallback(() => {
    isComposingRef.current = true
  }, [])

  const handleCompositionEnd = React.useCallback(() => {
    isComposingRef.current = false
    processInput()
  }, [processInput])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        document.execCommand("insertLineBreak")
      }
    },
    []
  )

  const handlePaste = React.useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault()
      const text = e.clipboardData.getData("text/plain")
      document.execCommand("insertText", false, text)
    },
    []
  )

  return (
    <div
      ref={divRef}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      aria-label={`${caption.label} 편집`}
      onInput={handleInput}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      className="text-sm leading-relaxed p-3 rounded-md bg-muted/50 border border-border/50 whitespace-pre-wrap break-words min-h-[60px] outline-none focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 transition-[color,box-shadow]"
      data-placeholder="수정할 내용을 입력하세요..."
    />
  )
}

export function PlanningContent({
  data,
  isEditMode,
  captionEditMode = "A",
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
              captionEditMode === "C" ? (
                /* C안: contentEditable 인라인 diff 에디터 */
                <ContentEditableCaption
                  caption={caption}
                  onUpdate={updateCaption}
                />
              ) : captionEditMode === "B" ? (
                /* B안: 편집 영역 자체가 미리보기 — transparent textarea overlay */
                <div className="relative min-h-[60px]">
                  {/* Visual layer: styled diff */}
                  <div
                    className="text-sm leading-relaxed p-3 rounded-md bg-muted/50 border border-border/50 whitespace-pre-wrap break-words min-h-[60px]"
                    aria-hidden="true"
                  >
                    <TrackedText
                      original={caption.original}
                      edited={caption.edited ?? caption.original}
                    />
                  </div>
                  {/* Interactive layer: transparent textarea */}
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
              ) : captionEditMode === "D" ? (
                /* D안(피드백 변경): A안과 동일한 미리보기 + Textarea 2단 구조 */
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
              ) : captionEditMode === "E" ? (
                /* E안(테스트): D안과 동일한 미리보기 + Textarea 2단 구조 */
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
                /* A안(기존): 미리보기 + Textarea 2단 구조 */
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
              )
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
