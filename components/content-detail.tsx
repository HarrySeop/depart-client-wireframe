"use client"

import * as React from "react"
import {
  Check,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge, type StatusType } from "./status-badge"
import { FeedbackPanel, type FeedbackComment } from "./feedback-panel"
import { ImageViewer } from "./image-viewer"
import { useIsMobile } from "@/components/ui/use-mobile"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { getContentDetailById, type ContentData } from "@/lib/mock-data"
import { sprints, getContentFridayCutoff } from "@/lib/mock-data/contents"
import { useSimulatedDate } from "@/lib/simulated-date-context"

export function ContentDetail({ id }: { id: string }) {
  const isMobile = useIsMobile()
  const { todayStr } = useSimulatedDate()
  const feedbackInputRef = React.useRef<HTMLTextAreaElement>(null)

  const { data: contentData, feedback: initialFeedback, sprint } = React.useMemo(
    () => getContentDetailById(id),
    [id]
  )

  const nextSprint = React.useMemo(() => {
    return sprints.find((s) => s.id === sprint + 1)
  }, [sprint])

  const [status, setStatus] = React.useState<StatusType>("제작완료")
  const [isFeedbackMode, setIsFeedbackMode] = React.useState(false)
  const [feedback, setFeedback] = React.useState(initialFeedback)
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

  const [approveModalOpen, setApproveModalOpen] = React.useState(false)
  const [revisionModalOpen, setRevisionModalOpen] = React.useState(false)
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false)
  const [viewerOpen, setViewerOpen] = React.useState(false)

  const initialFeedbackRef = React.useRef(initialFeedback)
  const hasNewFeedback = feedback.length > initialFeedbackRef.current.length

  const initialCommentIds = React.useMemo(() => {
    const ids = new Set<string>()
    const collect = (comments: FeedbackComment[]) => {
      for (const c of comments) {
        ids.add(c.id)
        if (c.replies) collect(c.replies)
      }
    }
    collect(initialFeedbackRef.current)
    return ids
  }, [])

  const pendingIds = React.useMemo(() => {
    const pending = new Set<string>()
    const check = (comments: FeedbackComment[]) => {
      for (const c of comments) {
        if (!initialCommentIds.has(c.id)) pending.add(c.id)
        if (c.replies) check(c.replies)
      }
    }
    check(feedback)
    return pending
  }, [feedback, initialCommentIds])

  const isReadOnlyFeedback = status !== "제작완료"

  const handleApprove = () => {
    setStatus("승인완료")
    setApproveModalOpen(false)
    setIsFeedbackMode(false)
    toast.success("콘텐츠가 승인되었습니다. 업로드가 진행됩니다.")
  }

  const handleEdit = () => {
    setIsFeedbackMode(true)
    setTimeout(() => feedbackInputRef.current?.focus(), 300)
  }

  const handleCompleteEdit = () => {
    setRevisionModalOpen(true)
  }

  const handleCancel = () => {
    if (hasNewFeedback) {
      setCancelModalOpen(true)
    } else {
      setIsFeedbackMode(false)
    }
  }

  const handleConfirmCancel = () => {
    setCancelModalOpen(false)
    setFeedback(initialFeedback)
    setIsFeedbackMode(false)
  }

  const handleConfirmRevision = () => {
    setRevisionModalOpen(false)
    setIsFeedbackMode(false)

    const fridayCutoff = getContentFridayCutoff(sprint)
    const isBeforeFriday = fridayCutoff && todayStr <= fridayCutoff

    if (isBeforeFriday) {
      setStatus("수정 요청")
      toast.success("수정 요청이 빌더에게 전달되었습니다. 빌더 수정 후 재전달됩니다.")
    } else {
      setStatus("컨펌 보류")
      toast.success("피드백이 빌더에게 전달되었습니다. 해당 콘텐츠는 다음 스프린트로 이월됩니다.")
    }
  }

  const handleAddFeedback = (content: string, parentId?: string) => {
    const newComment: FeedbackComment = {
      id: Date.now().toString(),
      author: "클라이언트(나)",
      authorType: "client",
      content,
      timestamp: new Date().toLocaleString("ko-KR", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      replies: [],
    }

    if (parentId) {
      setFeedback((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : c
        )
      )
    } else {
      setFeedback((prev) => [...prev, newComment])
    }
  }

  // Image navigation
  const goToPrevImage = () =>
    setCurrentImageIndex((p) => (p > 0 ? p - 1 : contentData.images.length - 1))
  const goToNextImage = () =>
    setCurrentImageIndex((p) => (p < contentData.images.length - 1 ? p + 1 : 0))

  const touchStartX = React.useRef(0)
  const touchEndX = React.useRef(0)
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.touches[0].clientX }
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) { diff > 0 ? goToNextImage() : goToPrevImage() }
  }

  const ApprovalContent = () => (
    <div className="space-y-2">
      <p className="text-sm text-foreground">승인 후 업로드가 진행됩니다.</p>
      <p className="text-sm text-muted-foreground">{contentData.title}</p>
    </div>
  )

  const nextSprintLabel = nextSprint
    ? `${nextSprint.name} (${nextSprint.startDate.slice(5).replace("-", "/")}~${nextSprint.endDate.slice(5).replace("-", "/")})`
    : "다음 스프린트"

  const fridayCutoff = getContentFridayCutoff(sprint)
  const isBeforeFridayCutoff = fridayCutoff && todayStr <= fridayCutoff

  const RevisionContent = () => (
    <div className="space-y-2">
      <p className="text-sm text-foreground">
        {isBeforeFridayCutoff
          ? "수정 요청이 빌더에게 전달됩니다. 빌더 수정 후 재전달됩니다. 수정 요청하시겠습니까?"
          : `피드백이 빌더에게 전달되며, 해당 콘텐츠는 ${nextSprintLabel}로 이월됩니다. 수정 요청하시겠습니까?`
        }
      </p>
      <p className="text-sm text-muted-foreground">{contentData.title}</p>
    </div>
  )

  const isShortForm = !!contentData.videoUrl

  // Content area (shared between layouts)
  const ContentArea = () => (
    <div className="p-4 sm:p-6 space-y-6">
      {isShortForm ? (
        /* Short-form video player (9:16) */
        <div className="space-y-4">
          <div className="relative max-w-[300px] mx-auto aspect-[9/16] bg-black rounded-lg overflow-hidden border border-border">
            <video
              src={contentData.videoUrl}
              controls
              playsInline
              loop
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ) : (
        /* Card news image gallery */
        <div className="space-y-4">
          <div
            className="relative aspect-square max-w-md mx-auto bg-card rounded-lg overflow-hidden border border-border cursor-pointer"
            onClick={() => setViewerOpen(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={contentData.images[currentImageIndex]?.src}
              alt={contentData.images[currentImageIndex]?.alt}
              className="w-full h-full object-cover"
            />
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevImage() }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="이전 이미지"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNextImage() }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="다음 이미지"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-sm">
              {currentImageIndex + 1} / {contentData.images.length}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 sm:justify-center sm:flex-wrap">
            {contentData.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all",
                  currentImageIndex === index
                    ? "border-primary"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Original plan accordion */}
      <Accordion type="single" collapsible className="border border-border rounded-lg">
        <AccordionItem value="original-plan" className="border-0">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <span>원본 기획서</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <div className="space-y-4 pt-2">
              <div>
                <h4 className="text-xs text-muted-foreground mb-1">기획안 제목</h4>
                <p className="text-sm">{contentData.originalPlan.title}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs text-muted-foreground">캡션</h4>
                {contentData.originalPlan.captions.map((caption, i) => (
                  <div key={i} className="pl-3 border-l-2 border-border">
                    <span className="text-xs text-muted-foreground">{caption.label}</span>
                    <p className="text-sm">{caption.text}</p>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-xs text-muted-foreground mb-1">해시태그</h4>
                <div className="flex flex-wrap gap-1.5">
                  {contentData.originalPlan.hashtags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs bg-secondary rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 border-b border-border">
        <div className="px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <StatusBadge status={status} />
              <h1 className="text-lg font-semibold line-clamp-1">{contentData.title}</h1>
              {isFeedbackMode && (
                <span className="text-xs text-orange-600 bg-orange-600/15 px-2 py-0.5 rounded-full border border-orange-600/30">
                  피드백 중
                </span>
              )}
            </div>

            {/* Desktop actions */}
            <div className="hidden sm:flex items-center gap-2">
              {isReadOnlyFeedback ? (
                <>
                  {isFeedbackMode ? (
                    <Button variant="outline" size="sm" onClick={() => setIsFeedbackMode(false)}>
                      <X className="size-4 mr-1.5" />
                      닫기
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setIsFeedbackMode(true)}>
                      <MessageSquare className="size-4 mr-1.5" />
                      피드백
                    </Button>
                  )}
                </>
              ) : !isFeedbackMode ? (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            size="sm"
                            disabled={hasNewFeedback}
                            onClick={() => setApproveModalOpen(true)}
                          >
                            <Check className="size-4 mr-1.5" />
                            승인
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {hasNewFeedback && (
                        <TooltipContent>
                          <p>피드백이 작성되어 승인할 수 없습니다. 피드백을 완료해주세요.</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <MessageSquare className="size-4 mr-1.5" />
                    피드백
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="size-4 mr-1.5" />
                    취소
                  </Button>
                  <Button size="sm" disabled={feedback.length === 0} onClick={handleCompleteEdit}>
                    피드백완료
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Desktop layout */}
        <div className="hidden md:flex flex-1 h-full">
          {isFeedbackMode ? (
            <>
              <div className="w-[70%] h-full overflow-auto border-r border-border">
                <ContentArea />
              </div>
              <div className="w-[30%] flex flex-col overflow-hidden">
                <FeedbackPanel
                  comments={feedback}
                  onAddComment={handleAddFeedback}
                  isReadOnly={isReadOnlyFeedback}
                  feedbackInputRef={feedbackInputRef}
                  pendingIds={isReadOnlyFeedback ? undefined : pendingIds}
                  wrapPending={!isReadOnlyFeedback}
                />
              </div>
            </>
          ) : (
            <div className="w-full overflow-auto">
              <ContentArea />
            </div>
          )}
        </div>

        {/* Mobile layout */}
        <div className="md:hidden flex-1 overflow-auto">
          <ContentArea />
        </div>
      </div>

      {/* Mobile bottom action bar — 승인만 가능 (피드백/수정 불가) */}
      {!isReadOnlyFeedback && (
        <div className="md:hidden shrink-0 border-t border-border p-4 bg-background">
          <Button
            size="sm"
            className="w-full"
            onClick={() => setApproveModalOpen(true)}
          >
            승인
          </Button>
        </div>
      )}

      {/* Approval Modal - Desktop */}
      {!isMobile && (
        <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>콘텐츠 승인</DialogTitle>
              <DialogDescription asChild>
                <div><ApprovalContent /></div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setApproveModalOpen(false)}>취소</Button>
              <Button onClick={handleApprove}>확인</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Approval Drawer - Mobile */}
      {isMobile && (
        <Drawer open={approveModalOpen} onOpenChange={setApproveModalOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>콘텐츠 승인</DrawerTitle>
              <DrawerDescription asChild>
                <div><ApprovalContent /></div>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button onClick={handleApprove}>확인</Button>
              <DrawerClose asChild><Button variant="outline">취소</Button></DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

      {/* Revision Confirm Modal - Desktop */}
      {!isMobile && (
        <Dialog open={revisionModalOpen} onOpenChange={setRevisionModalOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>수정 요청</DialogTitle>
              <DialogDescription asChild>
                <div><RevisionContent /></div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setRevisionModalOpen(false)}>취소</Button>
              <Button onClick={handleConfirmRevision}>확인</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Revision Confirm Drawer - Mobile */}
      {isMobile && (
        <Drawer open={revisionModalOpen} onOpenChange={setRevisionModalOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>수정 요청</DrawerTitle>
              <DrawerDescription asChild>
                <div><RevisionContent /></div>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button onClick={handleConfirmRevision}>확인</Button>
              <DrawerClose asChild><Button variant="outline">취소</Button></DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

      {/* Cancel Confirm Modal - Desktop */}
      {!isMobile && (
        <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>피드백 취소</DialogTitle>
              <DialogDescription>
                작성 중인 피드백이 삭제됩니다. 취소하시겠습니까?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setCancelModalOpen(false)}>돌아가기</Button>
              <Button onClick={handleConfirmCancel}>확인</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Cancel Confirm Drawer - Mobile */}
      {isMobile && (
        <Drawer open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>피드백 취소</DrawerTitle>
              <DrawerDescription>
                작성 중인 피드백이 삭제됩니다. 취소하시겠습니까?
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button onClick={handleConfirmCancel}>확인</Button>
              <DrawerClose asChild><Button variant="outline">돌아가기</Button></DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

      {/* Fullscreen image viewer (card news only) */}
      {!isShortForm && (
        <ImageViewer
          images={contentData.images}
          initialIndex={currentImageIndex}
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  )
}
