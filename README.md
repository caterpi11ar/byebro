# byebro

一个纯浏览器本地运行的「离职头像」生成工具:上传头像 → 自动转灰度 → 叠加「离职了」印章 → 导出 1024×1024 JPEG。所有处理在当前浏览器标签页内完成,不向任何服务器上传图片。

技术栈:Next.js 16 App Router · React 19 · Tailwind CSS v4 · shadcn/ui(base-nova preset) · lucide-react · sonner。

## 开发

```bash
pnpm install
pnpm dev
```

打开 http://localhost:3000 。

可选环境变量(部署时替换):

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

影响 metadataBase / canonical / sitemap / robots。

## 构建

```bash
pnpm build
pnpm start
```

## 目录要点

| 路径 | 作用 |
| --- | --- |
| `public/cover.png` | 「离职了」印章,部署时会作为静态资源 |
| `lib/render-avatar.ts` | 画布渲染与 JPEG 导出的纯函数 |
| `components/avatar-editor.tsx` | 主交互组件,client-side |
| `components/upload-zone.tsx` | 拖拽/点击上传 |
| `app/layout.tsx` | 全站 metadata、Noto Sans SC 字体、Toaster |
| `app/page.tsx` | 首屏、FAQ、JSON-LD 结构化数据 |
| `app/sitemap.ts` / `app/robots.ts` | SEO 基建 |

## SEO

- `<html lang="zh-CN">`
- Open Graph / Twitter Card 完整配置
- WebApplication + FAQPage 两份 JSON-LD
- robots.txt / sitemap.xml 自动生成
- 唯一页面,canonical 指向 `/`

## 隐私

项目不引入任何 analytics、追踪、API 路由或上传接口。用户的图片只会在浏览器内存中被解码、绘制、导出。
