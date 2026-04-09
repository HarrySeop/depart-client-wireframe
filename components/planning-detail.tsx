"use client"

import * as React from "react"
import { Check, Pencil, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { StatusBadge, type StatusType } from "./status-badge"
import { PlanningContent } from "./planning-content"
import { ImageViewer } from "./image-viewer"
import { useIsMobile } from "@/components/ui/use-mobile"
import { getPlanningDetailById } from "@/lib/mock-data"

export function PlanningDetail({ id }: { id: string }) {
  const isMobile = useIsMobile()


  const { data: initialPlanningData } = React.useMemo(
    () => getPlanningDetailById(id),
    [id]
  )

  // State
  const [status, setStatus] = React.useState<StatusType>("검토중")
  const [isEditMode, setIsEditMode] = React.useState(false)
  const [planningData, setPlanningData] = React.useState(initialPlanningData)
  const [editedData, setEditedData] = React.useState(initialPlanningData)
  const [originalData] = React.useState(initialPlanningData)
  const [captionEditMode, setCaptionEditMode] = React.useState<"A" | "B" | "C" | "D" | "E" | "F">("A")

  // Derived state
  const hasEditChanges = JSON.stringify(editedData) !== JSON.stringify(planningData)
  const hasUnsavedChanges = hasEditChanges

  // Split view logic
  const isSplitMode = captionEditMode <= "D"
  const showSplitView = (status === "수정 요청" || isEditMode) && isSplitMode
  const diffStyle = (captionEditMode === "B" || captionEditMode === "D") ? "background" as const : "strikethrough" as const
  const internalCaptionEditMode =
    (captionEditMode === "A" || captionEditMode === "B") ? "D" as const :
    (captionEditMode === "C" || captionEditMode === "D") ? "A" as const :
    captionEditMode === "E" ? "A" as const :
    "D" as const

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
    if (isMobile) return
    const demoEditData = {
      ...planningData,
      editedTitle: planningData.title.replace("왜", "왜 자주"),
      captions: planningData.captions.map((c) =>
        c.id === "2"
          ? { ...c, edited: "옷장에 바지는 많은데 막상 입는 바지는 몇 벌 안 됩니다." }
          : c
      ),
    }
    setEditedData(demoEditData)
    setIsEditMode(true)
  }

  const handleCompleteEdit = () => {
    setRevisionModalOpen(true)
  }

  const handleConfirmRevision = () => {
    setPlanningData(editedData)
    setRevisionModalOpen(false)
    setIsEditMode(false)
    setStatus("수정 요청")
    toast.success("수정 사항이 빌더에게 전달되었습니다. 수정 요청 상태로 변경됩니다.")
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
    setEditedData(planningData)
    setIsEditMode(false)
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

  const RevisionContent = () => (
    <div className="space-y-2">
      <p className="text-sm text-foreground">
        수정 사항과 피드백이 빌더에게 전달되며, 수정 요청 상태로 변경됩니다. 수정 요청하시겠습니까?
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
              <Button
                size="sm"
                onClick={() => setApproveModalOpen(true)}
              >
                <Check className="size-4 mr-1.5" />
                승인
              </Button>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Pencil className="size-4 mr-1.5" />
                수정
              </Button>
            </>
          ) : (
            <>
              <Select value={captionEditMode} onValueChange={(v) => setCaptionEditMode(v as "A" | "B" | "C" | "D" | "E" | "F")}>
                <SelectTrigger size="sm" className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A안 (직접편집·취소선)</SelectItem>
                  <SelectItem value="B">B안 (직접편집·빨강/초록)</SelectItem>
                  <SelectItem value="C">C안 (프리뷰·취소선)</SelectItem>
                  <SelectItem value="D">D안 (프리뷰·빨강/초록)</SelectItem>
                  <SelectItem value="E">E안 (상하수정)</SelectItem>
                  <SelectItem value="F">F안 (폼수정)</SelectItem>
                </SelectContent>
              </Select>
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
          {showSplitView ? (
            <div className="flex w-full h-full">
              {/* Left panel - 원본 */}
              <div className="w-1/2 h-full border-r border-border flex flex-col overflow-hidden">
                <div className="shrink-0 px-4 py-2 border-b border-border bg-muted/30">
                  <span className="text-xs font-medium text-muted-foreground">원본</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <PlanningContent
                    data={originalData}
                    isEditMode={false}
                    panelRole="original"
                    onImageClick={openImageViewer}
                  />
                </div>
              </div>
              {/* Right panel - 수정본 */}
              <div className="w-1/2 h-full flex flex-col overflow-hidden">
                <div className="shrink-0 px-4 py-2 border-b border-border bg-muted/30">
                  <span className="text-xs font-medium text-muted-foreground">수정본</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <PlanningContent
                    data={isEditMode ? editedData : planningData}
                    isEditMode={isEditMode}
                    captionEditMode={internalCaptionEditMode}
                    diffStyle={diffStyle}
                    panelRole="modified"
                    onDataChange={setEditedData}
                    onImageClick={openImageViewer}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <PlanningContent
                data={isEditMode ? editedData : planningData}
                isEditMode={isEditMode}
                captionEditMode={isEditMode ? internalCaptionEditMode : undefined}
                onDataChange={setEditedData}
                onImageClick={openImageViewer}
              />
            </div>
          )}
        </div>

        {/* Mobile layout */}
        <div className="md:hidden flex-1 flex flex-col min-h-0">
          {status === "수정 요청" ? (
            /* 수정 요청 상태: 상하 분할 읽기전용 */
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="border-b border-border">
                <div className="px-4 py-2 bg-muted/30 border-b border-border">
                  <span className="text-xs font-medium text-muted-foreground">원본</span>
                </div>
                <PlanningContent
                  data={originalData}
                  isEditMode={false}
                  panelRole="original"
                  onImageClick={openImageViewer}
                />
              </div>
              <div>
                <div className="px-4 py-2 bg-muted/30 border-b border-border">
                  <span className="text-xs font-medium text-muted-foreground">수정본</span>
                </div>
                <PlanningContent
                  data={planningData}
                  isEditMode={false}
                  diffStyle="strikethrough"
                  panelRole="modified"
                  onImageClick={openImageViewer}
                />
              </div>
            </div>
          ) : (
            /* 기타 상태: 단일 컬럼 */
            <div className="flex-1 min-h-0 overflow-y-auto">
              <PlanningContent
                data={planningData}
                isEditMode={false}
                onImageClick={openImageViewer}
              />
            </div>
          )}

          {/* Mobile bottom action bar - 승인만 */}
          <div className="shrink-0 border-t border-border p-4 bg-background">
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => setApproveModalOpen(true)}
              >
                승인
              </Button>
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
