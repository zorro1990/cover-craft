# 4. 统一项目结构 (Unified Project Structure)

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
