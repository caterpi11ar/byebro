import type { Metadata } from "next"
import { AvatarEditor } from "@/components/avatar-editor"

export const metadata: Metadata = {
  title: "byebro — 一键给头像盖上「离职了」印章",
  description:
    "上传头像,自动转为灰度并叠加「离职了」印章。导出 1024×1024 JPEG,纯浏览器本地处理,图片不上传。",
  alternates: { canonical: "/" },
}

const faqs = [
  {
    q: "会上传到服务器吗?",
    a: "不会。读取、转灰度、叠印章、导出 JPEG 都在你的浏览器标签页里完成,没有任何网络请求把图片发出去。",
  },
  {
    q: "头像不是正方形会怎样?",
    a: "按短边中心裁切为 1:1,再铺满到 1024×1024 的输出画布。",
  },
  {
    q: "导出是什么规格?",
    a: "1024×1024 JPEG,质量 0.92,适合大多数社交平台的头像和配图。",
  },
]

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "byebro",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  description:
    "在浏览器内本地生成带「离职了」灰度印章的 1024×1024 头像,不上传任何图片。",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CNY",
  },
  browserRequirements: "Requires a modern browser with Canvas support.",
  inLanguage: "zh-CN",
}

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:py-10 lg:flex-row lg:items-stretch lg:gap-12 lg:py-12">
        <section
          aria-label="产品介绍"
          className="flex flex-col gap-6 lg:w-1/2 lg:max-w-xl lg:justify-center"
        >
          <header className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Resignation Avatar Maker
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              byebro
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              上传头像 → 自动灰度 → 盖上「离职了」印章 → 导出 1024×1024 JPEG。全程浏览器本地,零上传。
            </p>
          </header>

          <div className="space-y-2">
            <h2 id="faq-heading" className="sr-only">
              常见问题
            </h2>
            {faqs.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-lg border border-border bg-card px-4 py-2.5 text-sm open:shadow-sm"
              >
                <summary className="cursor-pointer list-none font-medium marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="mr-2 text-muted-foreground">Q.</span>
                  {q}
                </summary>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {a}
                </p>
              </details>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            本工具所有操作都在浏览器本地完成,不会上传任何图片。愿你下一份工作顺利。
          </p>
        </section>

        <section
          aria-label="头像编辑器"
          className="flex w-full justify-center lg:w-1/2 lg:justify-stretch"
        >
          <AvatarEditor className="lg:h-full" />
        </section>
      </main>
    </>
  )
}
