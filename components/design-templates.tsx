"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface DesignTemplate {
  id: string
  name: string
  images: { src: string; alt: string }[]
}

interface DesignTemplatesProps {
  templates: DesignTemplate[]
  selectedTemplateId: string
  selectedImageIndex: number
  onImageClick: (templateId: string, images: { src: string; alt: string }[], imageIndex: number) => void
}

export function DesignTemplates({
  templates,
  selectedTemplateId,
  selectedImageIndex,
  onImageClick,
}: DesignTemplatesProps) {
  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-medium text-sm">디자인 템플릿</h3>
      </div>
      <div className="p-4 space-y-4">
        {templates.map((template) => (
          <div key={template.id} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              {template.name}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {template.images.map((image, idx) => {
                const isSelected =
                  template.id === selectedTemplateId && idx === selectedImageIndex
                return (
                  <button
                    key={idx}
                    onClick={() => onImageClick(template.id, template.images, idx)}
                    className={cn(
                      "relative aspect-square rounded-md overflow-hidden border-2 transition-all",
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-500/30"
                        : "border-border hover:border-muted-foreground/50"
                    )}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5">
                        <Check className="size-3" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export type { DesignTemplate }
