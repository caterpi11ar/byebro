"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Download } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { exportApprovalPng } from "@/lib/render-approval"

const DEFAULT_NAME = "毛毛虫"
const NOTICE_DAYS = 30
const CARD_WIDTH = 760

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

const inputClass =
  "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

export function ApprovalScreenshot({ className }: { className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const previewWrapperRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState(DEFAULT_NAME)
  const [lastDay, setLastDay] = useState("")
  const [downloading, setDownloading] = useState(false)
  const [scale, setScale] = useState(1)
  const [previewHeight, setPreviewHeight] = useState<number | undefined>(
    undefined,
  )

  useEffect(() => {
    // Defer date init to client to avoid SSR/CSR timezone hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLastDay(formatDate(new Date(Date.now() + NOTICE_DAYS * 86_400_000)))
  }, [])

  useEffect(() => {
    const wrapper = previewWrapperRef.current
    const card = cardRef.current
    if (!wrapper || !card) return
    const ro = new ResizeObserver(() => {
      const availableWidth = wrapper.clientWidth
      const naturalWidth = card.offsetWidth || CARD_WIDTH
      const nextScale = Math.min(1, availableWidth / naturalWidth)
      setScale(nextScale)
      setPreviewHeight(card.offsetHeight * nextScale)
    })
    ro.observe(wrapper)
    ro.observe(card)
    return () => ro.disconnect()
  }, [])

  const handleDownload = useCallback(async () => {
    const node = cardRef.current
    if (!node) return
    setDownloading(true)
    try {
      const blob = await exportApprovalPng(node)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `离职审批-${Date.now()}.png`
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
  }, [])

  const displayName = name.trim() || DEFAULT_NAME

  return (
    <Card className={cn("w-full max-w-xl", className)}>
      <CardHeader>
        <CardTitle>生成你的离职审批截图</CardTitle>
        <CardDescription>
          编辑姓名和最后工作日,一键导出审批卡片截图。
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="approval-name">申请人姓名</Label>
            <input
              id="approval-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="approval-date">最后工作日</Label>
            <input
              id="approval-date"
              type="date"
              value={lastDay}
              onChange={(e) => setLastDay(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div
          ref={previewWrapperRef}
          className="overflow-hidden rounded-lg border border-border bg-muted/40"
          style={{ height: previewHeight }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: CARD_WIDTH,
            }}
          >
            <ApprovalCard
              ref={cardRef}
              name={displayName}
              lastDay={lastDay}
            />
          </div>
        </div>

        <div className="mt-auto flex">
          <Button
            onClick={handleDownload}
            disabled={downloading || !lastDay}
            className="flex-1"
          >
            <Download className="size-4" />
            {downloading ? "导出中..." : "下载图片"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function WLogo({ size = 44 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(180deg, #FF8A3D 0%, #FF7A1A 100%)",
        boxShadow: "0 1px 2px rgba(255,122,26,0.25)",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        width={size * 0.55}
        height={size * 0.55}
        fill="none"
        stroke="white"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.5 5 L7.5 19 L12 9 L16.5 19 L21.5 5" />
      </svg>
    </div>
  )
}

function ApprovalCard({
  ref,
  name,
  lastDay,
}: {
  ref: React.Ref<HTMLDivElement>
  name: string
  lastDay: string
}) {
  return (
    <div
      ref={ref}
      className="bg-white font-sans"
      style={{ width: CARD_WIDTH, padding: "24px 28px" }}
    >
      <section className="flex items-start gap-4">
        <WLogo size={44} />

        <article className="flex-1 overflow-hidden rounded-xl border border-neutral-200/70 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div
            className="px-6 py-4"
            style={{
              background:
                "linear-gradient(180deg, #FFE7C9 0%, #FFF2DF 55%, #FFFBF3 100%)",
            }}
          >
            <h2
              className="text-[17px] font-semibold leading-tight"
              style={{ color: "#8B5A2B" }}
            >
              {"“"}
              {name}提交的离职申请审批流程{"”"} 待你审批
            </h2>
          </div>

          <div className="px-6 pt-5 pb-6">
            <div>
              <p className="text-[15px] font-semibold text-neutral-900">
                申请人
              </p>
            </div>
            <div className="mb-6">
              <button
                type="button"
                className="inline-flex items-center rounded-full bg-[#2F7BFF] px-3 py-1 text-[13px] font-medium text-white transition-colors hover:bg-[#1f6ae8]"
              >
                @{name}
              </button>
            </div>

            <div className="mb-1">
              <p className="text-[15px] font-semibold text-neutral-900">
                审批事由
              </p>
            </div>
            <p className="text-[14px] text-neutral-800">
              最后工作日：{lastDay}
            </p>

            <p className="mt-5 text-[14px] leading-relaxed text-neutral-500">
              当前业务不支持快捷审批，请点击进入卡片详情页进行审批操作
            </p>

            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-5 py-2 text-[14px] text-neutral-800 transition-colors hover:bg-neutral-50 active:bg-neutral-100"
              >
                查看详情
              </button>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}
