"use client"

import * as React from "react"
import { Reply, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface FeedbackComment {
  id: string
  author: string
  authorType: "client" | "builder"
  content: string
  timestamp: string
  replies?: FeedbackComment[]
}

interface FeedbackPanelProps {
  comments: FeedbackComment[]
  onAddComment: (content: string, parentId?: string) => void
  isReadOnly?: boolean
  feedbackInputRef?: React.RefObject<HTMLTextAreaElement | null>
}

function CommentBlock({
  comment,
  isReply = false,
  isReadOnly = false,
  onReply,
}: {
  comment: FeedbackComment
  isReply?: boolean
  isReadOnly?: boolean
  onReply?: (parentId: string) => void
}) {
  const isClient = comment.authorType === "client"

  return (
    <div
      className={cn(
        "rounded-lg border border-border",
        isReply && "ml-6",
        isClient ? "bg-blue-500/5" : "bg-card"
      )}
    >
      {/* Comment header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded",
              isClient
                ? "bg-blue-600/15 text-blue-600"
                : "bg-purple-600/15 text-purple-600"
            )}
          >
            {isClient ? "클라이언트" : "빌더"}
          </span>
          <span className="text-sm font-medium">{comment.author}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {comment.timestamp}
        </span>
      </div>
      {/* Comment body */}
      <div className="px-3 py-2.5">
        <p className="text-sm leading-relaxed text-foreground/90">
          {comment.content}
        </p>
      </div>
      {/* Comment actions */}
      {!isReply && !isReadOnly && onReply && (
        <div className="px-3 pb-2">
          <button
            onClick={() => onReply(comment.id)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Reply className="size-3" />
            답글
          </button>
        </div>
      )}
    </div>
  )
}

export function FeedbackPanel({
  comments,
  onAddComment,
  isReadOnly = false,
  feedbackInputRef,
}: FeedbackPanelProps) {
  const [newComment, setNewComment] = React.useState("")
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null)
  const [replyContent, setReplyContent] = React.useState("")
  const scrollEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    setTimeout(() => scrollEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
  }

  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    onAddComment(newComment)
    setNewComment("")
    scrollToBottom()
  }

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) return
    onAddComment(replyContent, parentId)
    setReplyContent("")
    setReplyingTo(null)
    scrollToBottom()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">
            피드백
            {comments.length > 0 && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({comments.length})
              </span>
            )}
          </h3>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0 overflow-y">
        <div className="p-4 space-y-3">
          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              아직 피드백이 없습니다.
            </p>
          )}
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-2">
              <CommentBlock
                comment={comment}
                isReadOnly={isReadOnly}
                onReply={(id) => setReplyingTo(id)}
              />
              {comment.replies?.map((reply) => (
                <CommentBlock
                  key={reply.id}
                  comment={reply}
                  isReply
                  isReadOnly={isReadOnly}
                />
              ))}
              {replyingTo === comment.id && (
                <div className="ml-6 space-y-2">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="답글을 입력하세요..."
                    className="min-h-[60px] text-sm resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmitReply(comment.id)
                      }
                    }}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyContent("")
                      }}
                    >
                      취소
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyContent.trim()}
                    >
                      등록
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={scrollEndRef} />
        </div>
      </ScrollArea>

      {/* New comment input — board-style */}
      {!isReadOnly && (
        <div className="p-4 border-t border-border">
          <Textarea
            ref={feedbackInputRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="피드백을 입력하세요..."
            className="min-h-[80px] text-sm resize-none mb-2"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
            >
              등록
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export type { FeedbackComment }
