全栈架构文档: Cover Craft AI

1. 高层架构 (High Level Architecture)

技术摘要: 本项目将采用基于 Next.js 的 Jamstack 架构，部署于 Vercel 平台。前端负责所有设计和渲染逻辑，利用 Fabric.js 实现高性能画布。后端功能（如作品分享、模板存储）将通过 Vercel 的 Serverless Functions 和数据库（Vercel Postgres）实现，形成一个高度集成、易于扩展的全栈应用。

仓库结构: 采用 Monorepo 结构，便于管理前端应用和未来可能出现的共享库（如共享类型定义）。

2. 技术栈 (Tech Stack)
| 类别 | 技术 | 版本 | 用途与理由 |
| :--- | :--- | :--- |:--- |
| 前端框架 | Next.js | ~14.x | 业界领先的 React 框架，与 Vercel 部署无缝集成。 |
| 样式 | Tailwind CSS | ~3.x | 提供高效的原子化 CSS 开发体验，易于维护。 |
| 画布库 | Fabric.js | ~5.x | 功能强大且成熟的 HTML5 Canvas 库，支持对象模型。 |
| 状态管理 | Zustand | ~4.x | 轻量、简洁的 React 状态管理库，足以应对本项目复杂度。 |
| 后端运行时 | Vercel Serverless | - | 无需管理服务器，按需执行，与前端项目紧密集成。 |
| 数据库 | Vercel Postgres | - | Vercel 提供的无服务器 Postgres，用于支持分享和模板功能。 |
| 图标 | Lucide | ~0.3x | 文章中提到的图标库，轻量且美观。 |
| AI去背景 | @imgly/background-removal | ~1.x | 备选方案1：纯前端模型（~80M）。 |
| API (外部) | Remove.bg API | v1 | 备选方案2：效果更好的API方案。 |
| API (外部) | Seedream 4.0 API | - | AI 文生图、图生图功能。 |
| API (外部) | Unsplash API | v1 | 全球最大的免费图库。 |
| CDN (外部) | 中文网字计划 | - | 提供精选的开源中文字体 CDN 链接。 |
| CDN (外部) | Gradient Hunt | - | (非API) 作为渐变色背景的灵感来源。 |

3. 数据模型 (Data Models)
(用于支持 Phase 4 的分享功能)

Design (设计稿)

interface Design {
  id: string;          // 唯一ID (用于分享URL, e.g., DVlejG)
  userId?: string;     // (可选) 创建者ID
  content: JSON;       // Fabric.js 画布内容的 JSON 序列化
  isPublicTemplate: boolean; // 是否公开为模板
  createdAt: Date;
  previewUrl?: string; // 预览图 URL (用于模板库展示)
  name?: string;       // 模板名称
}


SharedMaterial (共享素材)

interface SharedMaterial {
  id: string;
  userId?: string;     // (可选) 分享者ID
  imageUrl: string;      // 素材的URL
  type: 'meme' | 'transparent_ai' | 'other'; // 素材类型
  tags: string[];        // 搜索标签
  createdAt: Date;
}


4. 统一项目结构 (Unified Project Structure)

/cover-craft-ai-monorepo
├── apps/
│   └── web/                # Next.js 前端应用
│       ├── src/
│       │   ├── app/        # App Router
│       │   │   ├── (editor)/ # 编辑器主页面
│       │   │   ├── api/      # Vercel Serverless API 路由
│       │   │   │   ├── share/
│       │   │   │   └── template/
│       │   │   └── share/
│       │   │       └── [id]/ # 分享链接的公开页面
│       │   ├── components/ # React 组件 (ui/, core/)
│       │   ├── lib/        # 辅助函数, Fabric.js 配置, 第三方 API 客户端
│       │   └── hooks/      # 自定义 Hooks
│       ├── public/
│       └── package.json
├── packages/
│   └── shared-types/       # 前后端共享的 TypeScript 类型 (例如 Design)
└── package.json            # Monorepo 根目录


5. 部署架构 (Deployment Architecture)

CI/CD: 直接利用 Vercel 与 GitHub 的集成。每次 main 分支的 push 都会触发自动构建和部署。

环境变量: 需要在 Vercel 项目中配置以下 Secrets：

SEEDREAM_API_KEY

UNSPLASH_ACCESS_KEY

REMOVE_BG_API_KEY

POSTGRES_URL (由 Vercel 自动注入)

环境:

开发 (Development): 本地 next dev 命令。

预览 (Preview): 每个 Pull Request 自动生成一个预览链接。

生产 (Production): 合并到 main 分支后自动部署到主域名。