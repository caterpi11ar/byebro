import type { Metadata, Viewport } from "next"
import { Noto_Sans_SC } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const notoSansSC = Noto_Sans_SC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://byebro.caterpi11ar.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "byebro — 一键给头像盖上「离职了」印章",
    template: "%s | byebro",
  },
  description:
    "免费在线「byebro」:上传头像,一键叠加灰度「离职了」印章,导出 1024×1024 JPEG。所有处理在浏览器本地完成,不上传任何图片,保护隐私。",
  keywords: [
    "byebro",
    "离职了吗",
    "离职头像",
    "离职头像生成器",
    "离职了",
    "离职印章",
    "头像生成器",
    "灰度头像",
    "离职图片",
    "头像加印章",
  ],
  authors: [{ name: "byebro" }],
  creator: "byebro",
  applicationName: "byebro",
  category: "utilities",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName: "byebro",
    title: "byebro — 一键给头像盖上「离职了」印章",
    description:
      "上传头像,一键叠加灰度「离职了」印章。纯浏览器本地处理,不上传图片。",
    images: [
      {
        url: "/cover.png",
        width: 1200,
        height: 630,
        alt: "byebro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "byebro — 一键给头像盖上「离职了」印章",
    description: "纯浏览器本地,上传头像即生成灰度离职印章头像。",
    images: ["/cover.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/cover.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${notoSansSC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
