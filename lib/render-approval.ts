import { toBlob } from "html-to-image"

export async function exportApprovalPng(node: HTMLElement): Promise<Blob> {
  await document.fonts.ready
  const blob = await toBlob(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#ffffff",
  })
  if (!blob) throw new Error("export failed")
  return blob
}
