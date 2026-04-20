"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Download, RotateCcw } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { UploadZone } from "@/components/upload-zone"
import { cn } from "@/lib/utils"
import {
  computeCoverAnchor,
  exportJpeg,
  fileToImage,
  loadImage,
  renderToCanvas,
  type CoverAnchor,
} from "@/lib/render-avatar"

const MIN_SCALE = 0.5
const MAX_SCALE = 1.5
const DEFAULT_SCALE = 0.9
const MAX_FILE_BYTES = 10 * 1024 * 1024

export function AvatarEditor({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null)
  const [coverImage, setCoverImage] = useState<HTMLImageElement | null>(null)
  const [coverAnchor, setCoverAnchor] = useState<CoverAnchor | null>(null)
  const [scale, setScale] = useState(DEFAULT_SCALE)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadImage("/cover.png")
      .then((img) => {
        if (cancelled) return
        setCoverImage(img)
        setCoverAnchor(computeCoverAnchor(img))
      })
      .catch(() => toast.error("加载印章失败,请刷新页面重试"))
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !coverImage) return
    if (!userImage) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        canvas.width = 1024
        canvas.height = 1024
        ctx.fillStyle = "#f5f5f5"
        ctx.fillRect(0, 0, 1024, 1024)
      }
      return
    }
    renderToCanvas(canvas, {
      user: userImage,
      cover: coverImage,
      coverScale: scale,
      coverAnchor: coverAnchor ?? undefined,
    })
  }, [userImage, coverImage, coverAnchor, scale])

  const handleFile = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_BYTES) {
      toast.error("图片超过 10MB,请换一张小一些的")
      return
    }
    try {
      const img = await fileToImage(file)
      setUserImage(img)
    } catch {
      toast.error("图片加载失败,请换一张试试")
    }
  }, [])

  const handleDownload = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas || !userImage) return
    setDownloading(true)
    try {
      const blob = await exportJpeg(canvas, 0.92)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `离职头像-${Date.now()}.jpeg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      toast.success("图片已保存")
    } catch {
      toast.error("导出失败,请重试")
    } finally {
      setDownloading(false)
    }
  }, [userImage])

  const handleReset = useCallback(() => {
    setUserImage(null)
    setScale(DEFAULT_SCALE)
  }, [])

  return (
    <Card className={cn("w-full max-w-xl", className)}>
      <CardHeader>
        <CardTitle>生成你的离职头像</CardTitle>
        <CardDescription>
          所有处理都在你的浏览器内完成,图片不会上传到任何服务器。
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">
        <div className="relative overflow-hidden rounded-lg bg-muted">
          <canvas
            ref={canvasRef}
            className="block aspect-square w-full"
            aria-label="离职头像预览"
          />
          {!userImage && (
            <div className="absolute inset-0 p-4">
              <UploadZone onFile={handleFile} className="h-full" />
            </div>
          )}
        </div>

        {userImage && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="cover-scale">印章大小</Label>
              <span className="text-xs font-mono text-muted-foreground">
                {Math.round(scale * 100)}%
              </span>
            </div>
            <Slider
              id="cover-scale"
              min={MIN_SCALE}
              max={MAX_SCALE}
              step={0.01}
              value={[scale]}
              onValueChange={(v) =>
                setScale(Array.isArray(v) ? v[0] : (v as number))
              }
            />
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={handleDownload}
            disabled={!userImage || downloading}
            className="flex-1"
          >
            <Download className="size-4" />
            {downloading ? "导出中..." : "下载 1024×1024 JPEG"}
          </Button>
          {userImage && (
            <Button
              variant="outline"
              onClick={handleReset}
              aria-label="重新上传"
            >
              <RotateCcw className="size-4" />
              换一张
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
