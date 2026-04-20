"use client"

import { useCallback, useRef, useState } from "react"
import { ImagePlus } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadZoneProps {
  onFile: (file: File) => void
  className?: string
}

export function UploadZone({ onFile, className }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0]
      if (!file) return
      if (!file.type.startsWith("image/")) {
        return
      }
      onFile(file)
    },
    [onFile],
  )

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={cn(
        "group relative flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/40 p-6 text-center transition-colors",
        "hover:border-foreground/40 hover:bg-muted",
        dragging && "border-foreground bg-muted",
        className,
      )}
    >
      <ImagePlus className="size-8 text-muted-foreground group-hover:text-foreground" />
      <div className="space-y-1">
        <p className="text-sm font-medium">点击或拖拽上传头像</p>
        <p className="text-xs text-muted-foreground">
          支持 JPG / PNG / WebP,非 1:1 图片将自动中心裁切
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </button>
  )
}
