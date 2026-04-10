"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useIsMobile } from "@/components/ui/use-mobile"
import { Plus, X } from "lucide-react"

interface ArchiveAddDocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (doc: { name: string; links: string[]; description: string }) => void
}

export function ArchiveAddDocumentDialog({
  open,
  onOpenChange,
  onSubmit,
}: ArchiveAddDocumentDialogProps) {
  const isMobile = useIsMobile()
  const [name, setName] = React.useState("")
  const [links, setLinks] = React.useState<string[]>([""])
  const [description, setDescription] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setName("")
      setLinks([""])
      setDescription("")
    }
  }, [open])

  const isValid = name.trim().length > 0

  const addLink = () => {
    if (links.length < 4) setLinks([...links, ""])
  }

  const updateLink = (index: number, value: string) => {
    const updated = [...links]
    updated[index] = value
    setLinks(updated)
  }

  const removeLink = (index: number) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = () => {
    if (!isValid) return
    onSubmit({
      name: name.trim(),
      links: links.filter((l) => l.trim() !== ""),
      description: description.trim(),
    })
    onOpenChange(false)
  }

  const formContent = (
    <div className="space-y-4 px-1">
      {/* 이름 (필수) */}
      <div className="space-y-2">
        <Label htmlFor="doc-name">이름</Label>
        <Input
          id="doc-name"
          placeholder="자료 이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* 설명 (선택, 최대 100자) */}
      <div className="space-y-2">
        <Label htmlFor="doc-description">
          설명 <span className="text-muted-foreground font-normal">(선택, 최대 100자)</span>
        </Label>
        <Textarea
          id="doc-description"
          placeholder="간단한 설명을 입력하세요"
          value={description}
          onChange={(e) => {
            if (e.target.value.length <= 100) setDescription(e.target.value)
          }}
          className="min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground text-right">
          {description.length}/100
        </p>
      </div>

      {/* 링크 (선택, 최대 4개) */}
      <div className="space-y-2">
        <Label>
          링크 <span className="text-muted-foreground font-normal">(최대 4개)</span>
        </Label>
        <div className="space-y-2">
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="https://..."
                value={link}
                onChange={(e) => updateLink(index, e.target.value)}
                className="flex-1"
              />
              {links.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 size-9"
                  onClick={() => removeLink(index)}
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          ))}
          {links.length < 4 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={addLink}
            >
              <Plus className="size-4 mr-1" />
              링크 추가
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>자료 추가</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-2 overflow-y-auto max-h-[60vh]">{formContent}</div>
          <DrawerFooter>
            <Button onClick={handleSubmit} disabled={!isValid}>추가</Button>
            <DrawerClose asChild>
              <Button variant="outline">취소</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>자료 추가</DialogTitle>
        </DialogHeader>
        {formContent}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
          <Button onClick={handleSubmit} disabled={!isValid}>추가</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
