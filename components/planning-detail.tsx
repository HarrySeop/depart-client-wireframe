"use client"

import * as React from "react"
import { Check, Pencil, X } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge, type StatusType } from "./status-badge"
import { PlanningContent, type PlanningData } from "./planning-content"
import { FeedbackPanel, type FeedbackComment } from "./feedback-panel"
import { ImageViewer } from "./image-viewer"
import { useIsMobile } from "@/components/ui/use-mobile"
import { getPlanningDetailById } from "@/lib/mock-data"
import { sprints } from "@/lib/mock-data/contents"

export function PlanningDetail({ id }: { id: string }) {
  const isMobile = useIsMobile()
  const feedbackInputRef = React.useRef<HTMLTextAreaElement>(null)

  const { data: initialPlanningData, feedback: initialFeedback, sprintNumber } = React.useMemo(
    () => getPlanningDetailById(id),
    [id]
  )

  const nextSprint = React.useMemo(() => {
    return sprints.find((s) => s.id === sprintNumber + 1)
  }, [sprintNumber])

  // State
  const [status, setStatus] = React.useState<StatusType>("검토중")
  const [isEditMode, setIsEditMode] = React.useState(false)
  const [planningData, setPlanningData] = React.useState(initialPlanningData)
  const [editedData, setEditedData] = React.useState(initialPlanningData)
  const [feedback, setFeedback] = React.useState(initialFeedback)
  const [mobileTab, setMobileTab] = React.useState("planning")

  // Derived state for unsaved changes
  const initialFeedbackRef = React.useRef(initialFeedback)
  const hasNewFeedback = feedback.length > initialFeedbackRef.current.length
  const hasEditChanges = JSON.stringify(editedData) !== JSON.stringify(planningData)
  const hasUnsavedChanges = hasNewFeedback || hasEditChanges

  // Modals
  const [approveModalOpen, setApproveModalOpen] = React.useState(false)
  const [revisionModalOpen, setRevisionModalOpen] = React.useState(false)
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false)


  // Image viewer
  const [viewerOpen, setViewerOpen] = React.useState(false)
  const [viewerImages, setViewerImages] = React.useState<{ src: string; alt: string }[]>([])
  const [viewerIndex, setViewerIndex] = React.useState(0)

  // Handlers
  const handleApprove = () => {
    setStatus("승인완료")
    setApproveModalOpen(false)
    if (isEditMode) {
      setIsEditMode(false)

    }
    toast.success("기획서가 승인되었습니다.")
  }

  const handleEdit = () => {
    const demoEditData = {
      ...planningData,
      captions: planningData.captions.map((c) =>
        c.id === "2"
          ? { ...c, edited: "옷장에 바지는 많은데 막상 입는 바지는 몇 벌 안 됩니다." }
          : c
      ),
      addedHashtags: ["#남자바지"],
    }
    setEditedData(demoEditData)
    if (isMobile) {
      setIsEditMode(true)
    } else {
      setIsEditMode(true)
    }
  }

  const handleCompleteEdit = () => {
    setRevisionModalOpen(true)
  }

  const handleConfirmRevision = () => {
    setPlanningData(editedData)
    setRevisionModalOpen(false)
    setIsEditMode(false)
    setMobileEditDrawerOpen(false)
    setStatus("컨펌 보류")
    toast.success("피드백이 빌더에게 전달되었습니다. 해당 기획은 다음 스프린트로 이월됩니다.")
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setCancelModalOpen(true)
    } else {
      setIsEditMode(false)

      setEditedData(planningData)
    }
  }

  const handleConfirmCancel = () => {
    setCancelModalOpen(false)
    setFeedback(initialFeedbackRef.current)
    setEditedData(planningData)
    setIsEditMode(false)
  }

  const handleAddComment = (content: string, parentId?: string) => {
    const newComment: FeedbackComment = {
      id: `${Date.now()}`,
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

  const openImageViewer = (
    images: { src: string; alt: string }[],
    index: number
  ) => {
    setViewerImages(images)
    setViewerIndex(index)
    setViewerOpen(true)
  }

  // Approval Modal content
  const ApprovalContent = () => (
    <>
      <p className="text-sm text-muted-foreground">
        이 기획서를 승인하시겠습니까?
      </p>
      <p className="text-sm mt-2">{planningData.title}</p>
    </>
  )

  const nextSprintLabel = nextSprint
    ? `${nextSprint.name} (${nextSprint.startDate.slice(5).replace("-", "/")}~${nextSprint.endDate.slice(5).replace("-", "/")})`
    : "다음 스프린트"

  const RevisionContent = () => (
    <div className="space-y-2">
      <p className="text-sm text-foreground">
        피드백이 빌더에게 전달되며, 해당 기획은 {nextSprintLabel}로 이월됩니다. 수정 요청하시겠습니까?
      </p>
      <p className="text-sm text-muted-foreground">{planningData.title}</p>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          <h1 className="text-lg font-semibold truncate max-w-[400px]">
            {planningData.title}
          </h1>
          {isEditMode && (
            <span className="text-xs text-orange-600 bg-orange-600/15 px-2 py-0.5 rounded-full border border-orange-600/30">
              수정 중
            </span>
          )}
        </div>

        {/* Action buttons - Desktop */}
        <div className="hidden sm:flex items-center gap-2">
          {!isEditMode ? (
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
                      <p>피드백이 작성되어 승인할 수 없습니다. 피드백을 완료하거나 취소해주세요.</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Pencil className="size-4 mr-1.5" />
                수정
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="size-4 mr-1.5" />
                취소
              </Button>
              <Button size="sm" onClick={handleCompleteEdit}>
                수정완료
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Desktop layout */}
        <div className="hidden md:flex flex-1 h-full">
          {isEditMode ? (
            <>
              {/* Edit mode: 70/30 split — planning + feedback */}
              <div className="w-[70%] border-r border-border overflow-hidden">
                <PlanningContent
                  data={editedData}
                  isEditMode={true}
                  onDataChange={setEditedData}
                  onImageClick={openImageViewer}
                />
              </div>
              <div className="w-[30%] flex flex-col overflow-hidden">
                <FeedbackPanel
                  comments={feedback}
                  onAddComment={handleAddComment}
                  isReadOnly={false}
                  feedbackInputRef={feedbackInputRef}
                />
              </div>
            </>
          ) : (
            /* Read-only: 70/30 split — planning + feedback read-only */
            <>
              <div className="w-[70%] border-r border-border overflow-hidden">
                <PlanningContent
                  data={planningData}
                  isEditMode={false}
                  onImageClick={openImageViewer}
                />
              </div>
              <div className="w-[30%] flex flex-col overflow-hidden">
                <FeedbackPanel
                  comments={feedback}
                  onAddComment={handleAddComment}
                  isReadOnly={true}
                />
              </div>
            </>
          )}
        </div>

        {/* Mobile layout */}
        <div className="md:hidden flex-1 flex flex-col min-h-0">
          {isEditMode ? (
            /* Edit mode: tabs for planning + feedback */
            <Tabs
              value={mobileTab}
              onValueChange={setMobileTab}
              className="flex-1 flex flex-col min-h-0"
            >
              <TabsList className="w-full rounded-none border-b border-border bg-transparent h-auto p-0">
                <TabsTrigger
                  value="planning"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
                >
                  기획서
                </TabsTrigger>
                <TabsTrigger
                  value="feedback"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
                >
                  피드백
                </TabsTrigger>
              </TabsList>
              <TabsContent value="planning" className="flex-1 m-0 min-h-0 overflow-y-auto">
                <PlanningContent
                  data={editedData}
                  isEditMode={true}
                  onDataChange={setEditedData}
                  onImageClick={openImageViewer}
                />
              </TabsContent>
              <TabsContent value="feedback" className="flex-1 m-0 min-h-0 overflow-hidden flex flex-col">
                <FeedbackPanel
                  comments={feedback}
                  onAddComment={handleAddComment}
                  isReadOnly={false}
                  feedbackInputRef={feedbackInputRef}
                />
              </TabsContent>
            </Tabs>
          ) : (
            /* Read-only: tabs for planning + feedback read-only */
            <Tabs
              value={mobileTab}
              onValueChange={setMobileTab}
              className="flex-1 flex flex-col min-h-0"
            >
              <TabsList className="w-full rounded-none border-b border-border bg-transparent h-auto p-0">
                <TabsTrigger
                  value="planning"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
                >
                  기획서
                </TabsTrigger>
                <TabsTrigger
                  value="feedback"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
                >
                  피드백
                </TabsTrigger>
              </TabsList>
              <TabsContent value="planning" className="flex-1 m-0 min-h-0 overflow-y-auto">
                <PlanningContent
                  data={planningData}
                  isEditMode={false}
                  onImageClick={openImageViewer}
                />
              </TabsContent>
              <TabsContent value="feedback" className="flex-1 m-0 min-h-0 overflow-hidden flex flex-col">
                <FeedbackPanel
                  comments={feedback}
                  onAddComment={handleAddComment}
                  isReadOnly={true}
                />
              </TabsContent>
            </Tabs>
          )}

          {/* Mobile bottom action bar */}
          <div className="shrink-0 border-t border-border p-4 bg-background">
            <div className="flex gap-2">
              {!isEditMode ? (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <span className="flex-1">
                        <Button
                          size="sm"
                          className="w-full"
                          disabled={hasNewFeedback}
                          onClick={() => {
                            if (!hasNewFeedback) setApproveModalOpen(true)
                          }}
                        >
                          승인
                        </Button>
                      </span>
                    </PopoverTrigger>
                    {hasNewFeedback && (
                      <PopoverContent className="w-auto max-w-[240px] p-3">
                        <p className="text-sm">피드백이 작성되어 승인할 수 없습니다. 피드백을 완료하거나 취소해주세요.</p>
                      </PopoverContent>
                    )}
                  </Popover>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleEdit}
                  >
                    수정
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleCancel}
                  >
                    취소
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={handleCompleteEdit}
                  >
                    수정완료
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approval Modal - Desktop */}
      {!isMobile && (
        <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>기획서 승인</DialogTitle>
              <DialogDescription asChild>
                <div>
                  <ApprovalContent />
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setApproveModalOpen(false)}>
                취소
              </Button>
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
              <DrawerTitle>기획서 승인</DrawerTitle>
              <DrawerDescription asChild>
                <div>
                  <ApprovalContent />
                </div>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button onClick={handleApprove}>확인</Button>
              <DrawerClose asChild>
                <Button variant="outline">취소</Button>
              </DrawerClose>
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
                <div>
                  <RevisionContent />
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setRevisionModalOpen(false)}>
                취소
              </Button>
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
                <div>
                  <RevisionContent />
                </div>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button onClick={handleConfirmRevision}>확인</Button>
              <DrawerClose asChild>
                <Button variant="outline">취소</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}


      {/* Cancel Confirmation Modal - Desktop */}
      {!isMobile && (
        <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>수정 취소</DialogTitle>
              <DialogDescription>
                수정사항과 피드백이 사라집니다. 취소하시겠습니까?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
                돌아가기
              </Button>
              <Button onClick={handleConfirmCancel}>확인</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Cancel Confirmation Drawer - Mobile */}
      {isMobile && (
        <Drawer open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>수정 취소</DrawerTitle>
              <DrawerDescription>
                수정사항과 피드백이 사라집니다. 취소하시겠습니까?
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button onClick={handleConfirmCancel}>확인</Button>
              <DrawerClose asChild>
                <Button variant="outline">돌아가기</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

      {/* Image Viewer */}
      <ImageViewer
        images={viewerImages}
        initialIndex={viewerIndex}
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  )
}
