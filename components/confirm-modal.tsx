"use client"

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
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useIsMobile } from "@/components/ui/use-mobile"

interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  items: { id: string; title: string }[]
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  items,
  onConfirm,
  confirmText = "확인",
  cancelText = "취소",
}: ConfirmModalProps) {
  const isMobile = useIsMobile()

  const ItemList = () => (
    <ScrollArea className="max-h-[200px] pr-4">
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="text-sm text-muted-foreground py-2 px-3 rounded-md bg-muted/50"
          >
            {item.title}
          </li>
        ))}
      </ul>
    </ScrollArea>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <ItemList />
          </div>
          <DrawerFooter>
            <Button onClick={onConfirm}>{confirmText}</Button>
            <DrawerClose asChild>
              <Button variant="outline">{cancelText}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ItemList />
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelText}
          </Button>
          <Button onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
