export const OUTPUT_SIZE = 1024

export interface CoverAnchor {
  x: number
  y: number
}

export interface RenderOptions {
  user: HTMLImageElement | ImageBitmap
  cover: HTMLImageElement | ImageBitmap
  coverScale: number
  coverAnchor?: CoverAnchor
  size?: number
}

export function computeCoverAnchor(
  cover: HTMLImageElement | ImageBitmap,
): CoverAnchor {
  const w = "width" in cover ? cover.width : 0
  const h = "height" in cover ? cover.height : 0
  if (w === 0 || h === 0) return { x: 0.5, y: 0.5 }
  const scratch = document.createElement("canvas")
  scratch.width = w
  scratch.height = h
  const ctx = scratch.getContext("2d")
  if (!ctx) return { x: 0.5, y: 0.5 }
  ctx.drawImage(cover as CanvasImageSource, 0, 0)
  let data: Uint8ClampedArray
  try {
    data = ctx.getImageData(0, 0, w, h).data
  } catch {
    return { x: 0.5, y: 0.5 }
  }
  let sumX = 0
  let sumY = 0
  let sumW = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const a = data[i + 3]
      if (a < 16) continue
      const lum =
        (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255
      const darkness = 1 - lum
      if (darkness < 0.2) continue
      const weight = darkness * darkness * (a / 255)
      sumX += x * weight
      sumY += y * weight
      sumW += weight
    }
  }
  if (sumW === 0) return { x: 0.5, y: 0.5 }
  return { x: sumX / sumW / w, y: sumY / sumW / h }
}

export function renderToCanvas(
  canvas: HTMLCanvasElement,
  opts: RenderOptions,
): void {
  const size = opts.size ?? OUTPUT_SIZE
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas 2D context unavailable")

  ctx.imageSmoothingQuality = "high"
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, size, size)

  const { user, cover, coverScale, coverAnchor } = opts

  ctx.save()
  ctx.filter = "grayscale(100%)"
  const userW = "width" in user ? user.width : 0
  const userH = "height" in user ? user.height : 0
  const userRatio = userW / userH
  let sx = 0
  let sy = 0
  let sw = userW
  let sh = userH
  if (userRatio > 1) {
    sw = userH
    sx = (userW - sw) / 2
  } else if (userRatio < 1) {
    sh = userW
    sy = (userH - sh) / 2
  }
  ctx.drawImage(user as CanvasImageSource, sx, sy, sw, sh, 0, 0, size, size)
  ctx.restore()

  const coverW = "width" in cover ? cover.width : 0
  const coverH = "height" in cover ? cover.height : 0
  const targetW = size * coverScale
  const targetH = (coverH / coverW) * targetW
  const anchor = coverAnchor ?? { x: 0.5, y: 0.5 }
  const dx = size / 2 - anchor.x * targetW
  const dy = size / 2 - anchor.y * targetH
  ctx.drawImage(cover as CanvasImageSource, dx, dy, targetW, targetH)
}

export function exportJpeg(
  canvas: HTMLCanvasElement,
  quality = 0.92,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Canvas 导出失败"))
      },
      "image/jpeg",
      quality,
    )
  })
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`加载图片失败: ${src}`))
    img.src = src
  })
}

export async function fileToImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    return img
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
  }
}
