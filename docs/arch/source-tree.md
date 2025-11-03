# 源代码结构说明 (Source Tree)

## 项目概述

Cover Craft AI 采用 **Monorepo** 架构，使用 **Next.js 14** (App Router) 作为前端框架。项目结构清晰，职责分离明确，便于维护和扩展。

---

## 完整目录结构

```
/cover-craft-ai-monorepo
│
├── apps/                          # 应用目录
│   └── web/                       # Next.js 主应用
│       │
│       ├── src/                   # 源代码根目录
│       │   ├── app/               # App Router (Next.js 14)
│       │   │   ├── (editor)/      # 编辑器路由组
│       │   │   │   ├── page.tsx           # 编辑器主页
│       │   │   │   └── layout.tsx         # 编辑器布局
│       │   │   │
│       │   │   ├── api/           # API Routes (Serverless Functions)
│       │   │   │   ├── share/            # 分享相关 API
│       │   │   │   │   ├── route.ts      # POST /api/share
│       │   │   │   │   └── [id]/         # 分享链接详情
│       │   │   │   │       ├── route.ts  # GET /api/share/[id]
│       │   │   │   │       └── page.tsx  # 分享页面
│       │   │   │   │
│       │   │   │   └── template/         # 模板相关 API
│       │   │   │       ├── route.ts      # POST /api/template
│       │   │   │       └── [id]/
│       │   │   │           └── route.ts  # GET /api/template/[id]
│       │   │   │
│       │   │   ├── share/        # 公开分享页面
│       │   │   │   └── [id]/
│       │   │   │       └── page.tsx      # 动态分享页面
│       │   │   │
│       │   │   ├── globals.css           # 全局样式
│       │   │   ├── layout.tsx            # 根布局
│       │   │   └── page.tsx              # 首页（可选）
│       │   │
│       │   ├── components/       # React 组件
│       │   │   ├── ui/                  # 基础 UI 组件
│       │   │   │   ├── Button/
│       │   │   │   │   ├── Button.tsx
│       │   │   │   │   ├── Button.module.css
│       │   │   │   │   └── index.ts
│       │   │   │   │
│       │   │   │   ├── Input/
│       │   │   │   ├── Modal/
│       │   │   │   ├── Dropdown/
│       │   │   │   └── index.ts          # 统一导出
│       │   │   │
│       │   │   ├── editor/        # 编辑器核心组件
│       │   │   │   ├── Canvas/
│       │   │   │   │   ├── Canvas.tsx          # Fabric.js 画布组件
│       │   │   │   │   ├── CanvasControls.tsx  # 画布控制面板
│       │   │   │   │   └── index.ts
│       │   │   │   │
│       │   │   │   ├── Toolbar/
│       │   │   │   │   ├── Toolbar.tsx         # 顶部工具栏
│       │   │   │   │   ├── ToolbarButton.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   │
│       │   │   │   ├── AssetPanel/
│       │   │   │   │   ├── AssetPanel.tsx      # 左侧素材面板
│       │   │   │   │   ├── TemplateTab.tsx     # 模板标签页
│       │   │   │   │   ├── TextTab.tsx         # 文字标签页
│       │   │   │   │   ├── ImageTab.tsx        # 图片标签页
│       │   │   │   │   ├── GalleryTab.tsx      # 图库标签页
│       │   │   │   │   ├── AIGeneratedTab.tsx  # AI 生成标签页
│       │   │   │   │   └── index.ts
│       │   │   │   │
│       │   │   │   ├── PropertyPanel/
│       │   │   │   │   ├── PropertyPanel.tsx   # 右侧属性面板
│       │   │   │   │   ├── FontProperties.tsx  # 字体属性
│       │   │   │   │   ├── ImageProperties.tsx # 图片属性
│       │   │   │   │   ├── AIEditPanel.tsx     # AI 编辑面板
│       │   │   │   │   └── index.ts
│       │   │   │   │
│       │   │   │   └── modals/          # 模态框组件
│       │   │   │       ├── AIPromptModal.tsx   # AI 提示词输入
│       │   │   │       ├── ShareModal.tsx      # 分享对话框
│       │   │   │       └── TemplateSaveModal.tsx # 模板保存
│       │   │   │
│       │   │   └── index.ts             # 统一导出
│       │   │
│       │   ├── lib/              # 工具库和配置
│       │   │   ├── fabric/            # Fabric.js 配置
│       │   │   │   ├── canvas.ts           # Canvas 初始化
│       │   │   │   ├── objects.ts          # 对象操作工具
│       │   │   │   ├── events.ts           # 事件处理
│       │   │   │   └── utils.ts            # 工具函数
│       │   │   │
│       │   │   ├── api/             # 第三方 API 客户端
│       │   │   │   ├── seedream.ts         # Seedream API
│       │   │   │   ├── unsplash.ts         # Unsplash API
│       │   │   │   └── removebg.ts         # Remove.bg API
│       │   │   │
│       │   │   ├── database/       # 数据库操作
│       │   │   │   ├── client.ts           # 数据库客户端
│       │   │   │   ├── queries.ts          # 查询函数
│       │   │   │   └── schema.sql          # 数据库模式
│       │   │   │
│       │   │   ├── utils/          # 通用工具
│       │   │   │   ├── cn.ts              # 类名合并
│       │   │   │   ├── image.ts           # 图片处理
│       │   │   │   └── download.ts        # 下载工具
│       │   │   │
│       │   │   ├── constants.ts    # 常量定义
│       │   │   ├── config.ts       # 应用配置
│       │   │   └── types.ts        # 类型定义
│       │   │
│       │   ├── hooks/              # 自定义 Hooks
│       │   │   ├── useCanvas.ts         # 画布操作 Hook
│       │   │   ├── useFabricObject.ts   # Fabric 对象 Hook
│       │   │   ├── useKeyboard.ts       # 键盘事件 Hook
│       │   │   ├── useImageUpload.ts    # 图片上传 Hook
│       │   │   ├── useAIGeneration.ts   # AI 生成 Hook
│       │   │   ├── useShare.ts          # 分享功能 Hook
│       │   │   └── index.ts              # 统一导出
│       │   │
│       │   └── stores/             # Zustand 状态管理
│       │       ├── canvasStore.ts       # 画布状态
│       │       ├── uiStore.ts           # UI 状态
│       │       ├── assetStore.ts        # 素材状态
│       │       ├── aiStore.ts           # AI 状态
│       │       └── index.ts             # 统一导出
│       │
│       ├── public/              # 静态资源
│       │   ├── fonts/                 # 字体文件
│       │   ├── icons/                 # 图标文件
│       │   └── images/                # 示例图片
│       │
│       ├── tests/               # 测试文件
│       │   ├── __mocks__/            # Mock 文件
│       │   ├── components/            # 组件测试
│       │   ├── hooks/                 # Hook 测试
│       │   └── utils/                 # 工具测试
│       │
│       ├── .next/              # Next.js 构建输出
│       │
│       ├── package.json         # 项目依赖
│       ├── next.config.js       # Next.js 配置
│       ├── tailwind.config.js   # Tailwind 配置
│       ├── tsconfig.json        # TypeScript 配置
│       └── .eslintrc.json       # ESLint 配置
│
├── packages/                    # 共享包
│   └── shared-types/            # 共享类型定义
│       ├── src/
│       │   ├── index.ts              # 统一导出
│       │   ├── canvas.ts             # 画布相关类型
│       │   ├── design.ts             # 设计相关类型
│       │   ├── api.ts                # API 相关类型
│       │   └── user.ts               # 用户相关类型
│       │
│       ├── package.json
│       └── tsconfig.json
│
├── .bmad-core/                  # BMAD 配置
│   └── core-config.yaml              # 核心配置文件
│
├── docs/                        # 文档目录
│   ├── arch/                    # 架构文档
│   │   ├── index.md
│   │   ├── high-level-architecture.md
│   │   ├── tech-stack.md
│   │   ├── data-models.md
│   │   ├── unified-project-structure.md
│   │   ├── deployment-architecture.md
│   │   ├── coding-standards.md
│   │   └── source-tree.md
│   │
│   ├── brief/                   # 项目简报
│   ├── prd/                     # 产品需求文档
│   ├── uiux/                    # UI/UX 规范
│   └── qa/                      # QA 测试文档
│
├── .ai/                         # AI 相关
│   └── debug-log.md             # 调试日志
│
├── stories/                     # 用户故事
│   └── user-stories.md
│
├── package.json                 # Monorepo 根配置
├── tsconfig.base.json           # 基础 TypeScript 配置
├── .gitignore                   # Git 忽略文件
├── README.md                    # 项目说明
└── LICENSE                      # 开源协议
```

---

## 目录详细说明

### 1. 应用层 (`apps/web/`)

#### 1.1 页面层 (`src/app/`)

**路由组 `(editor)`**:
- 包含编辑器相关的所有页面
- 使用 `(editor)` 命名约定，目录不会影响 URL 结构
- `layout.tsx`: 定义编辑器页面的公共布局
- `page.tsx`: 编辑器主页

**API Routes (`src/app/api/`)**:
- 使用 Next.js App Router 的 API Routes 功能
- 每个文件夹对应一个路由路径
- `route.ts`: 定义 GET/POST 等 HTTP 方法处理

**公开分享页 (`share/[id]`)**:用户可以通过此页面无需登录即可查看分享的设计

#### 1.2 组件层 (`src/components/`)

**UI 组件 (`ui/`)**: 可复用的基础 UI 组件
- Button: 按钮组件
- Input: 输入框组件
- Modal: 模态框组件
- Dropdown: 下拉菜单组件
- 每个组件都有独立的文件夹和 `index.ts` 导出文件

**编辑器组件 (`editor/`)**: 编辑器专用组件
- Canvas: 核心画布组件，集成 Fabric.js
- Toolbar: 顶部工具栏
- AssetPanel: 左侧素材面板
- PropertyPanel: 右侧属性面板
- modals: 各种功能模态框

#### 1.3 工具库 (`src/lib/`)

**Fabric.js 配置 (`fabric/`)**: Canvas 操作的核心逻辑
- `canvas.ts`: Canvas 初始化和基本配置
- `objects.ts`: Fabric 对象（文本、图片、形状）操作
- `events.ts`: 事件监听和处理
- `utils.ts`: 画布相关的工具函数

**API 客户端 (`api/`)**: 第三方服务集成
- `seedream.ts`: AI 图片生成
- `unsplash.ts`: 图库搜索
- `removebg.ts`: AI 去背景

**数据库操作 (`database/`)**: Vercel Postgres
- `client.ts`: 数据库连接和配置
- `queries.ts`: 数据库查询函数
- `schema.sql`: 数据库表结构定义

**通用工具 (`utils/`)**:
- `cn.ts`: 合并 CSS 类名（clsx 的替代）
- `image.ts`: 图片处理工具
- `download.ts`: 文件下载工具

#### 1.4 自定义 Hooks (`src/hooks/`)

**状态和交互逻辑**:
- `useCanvas.ts`: 画布操作封装
- `useFabricObject.ts`: Fabric 对象操作
- `useKeyboard.ts`: 键盘快捷键
- `useImageUpload.ts`: 图片上传逻辑
- `useAIGeneration.ts`: AI 功能调用
- `useShare.ts`: 分享功能

#### 1.5 状态管理 (`src/stores/`)

**Zustand Store**:
- `canvasStore.ts`: 画布对象、选中状态
- `uiStore.ts`: UI 状态（加载、提示等）
- `assetStore.ts`: 素材库状态
- `aiStore.ts`: AI 相关状态

### 2. 共享包 (`packages/`)

#### 2.1 共享类型 (`shared-types/`)

**前后端共享的类型定义**:
- `canvas.ts`: 画布相关类型
- `design.ts`: 设计对象类型
- `api.ts`: API 请求/响应类型
- `user.ts`: 用户相关类型

避免在前后端重复定义类型，提高类型安全性。

### 3. 文档系统 (`docs/`)

#### 3.1 架构文档 (`arch/`)

- 高层架构设计
- 技术栈选型和理由
- 数据模型定义
- 项目结构说明
- 部署架构
- 编码规范
- 源代码结构（本文档）

#### 3.2 其他文档

- `brief/`: 项目简报和商业背景
- `prd/`: 产品需求文档
- `uiux/`: UI/UX 设计和规范
- `qa/`: 测试用例和 QA 流程

---

## 关键路径说明

### 重要文件

1. **编辑器主页**: `apps/web/src/app/(editor)/page.tsx`
   - 编辑器的主入口页面
   - 组合所有编辑器组件

2. **画布组件**: `apps/web/src/components/editor/Canvas/Canvas.tsx`
   - Fabric.js 集成的核心组件
   - 处理所有 Canvas 交互

3. **状态管理**: `apps/web/src/stores/canvasStore.ts`
   - Zustand store 管理画布状态
   - 整个应用的数据中心

4. **API 处理**: `apps/web/src/app/api/share/route.ts`
   - 分享功能的 API 端点
   - Vercel Serverless Function

5. **类型定义**: `packages/shared-types/src/canvas.ts`
   - 前后端共享的类型定义
   - 确保类型一致性

### 配置文件

- `apps/web/next.config.js`: Next.js 配置
- `apps/web/tailwind.config.js`: Tailwind CSS 配置
- `apps/web/tsconfig.json`: TypeScript 配置
- `.bmad-core/core-config.yaml`: BMAD 工作流配置

---

## 开发工作流

### 1. 新增功能

1. 在 `apps/web/src/components/editor/` 下创建新组件
2. 在 `packages/shared-types/` 下添加类型定义（如需要）
3. 在 `docs/` 下更新相关文档
4. 在 `docs/qa/` 下添加测试用例

### 2. 修改 API

1. 在 `apps/web/src/app/api/` 下创建/修改 API 路由
2. 更新类型定义
3. 更新文档

### 3. 数据库变更

1. 在 `apps/web/src/lib/database/schema.sql` 中定义表结构
2. 在 `apps/web/src/lib/database/queries.ts` 中添加查询函数
3. 在 Vercel 控制台执行 SQL

---

## 模块依赖关系

```
app/page.tsx
    ↓
editor layout
    ↓
Canvas + Toolbar + AssetPanel + PropertyPanel
    ↓
hooks + stores
    ↓
lib/fabric + lib/api + lib/database
    ↓
packages/shared-types
```

**依赖原则**:
- 应用层不依赖组件层内部实现
- 使用 hooks 隔离状态管理逻辑
- 通过共享类型定义确保类型安全

---

## 部署结构

### Vercel 部署

```
apps/web/
    ├── src/app/           # 页面和 API Routes
    ├── public/            # 静态资源
    └── package.json       # 依赖和脚本
```

- Next.js 自动处理 App Router 和 API Routes
- 静态资源自动部署到 CDN
- Serverless Functions 按需扩展

### 环境变量

开发环境:
- `NEXT_PUBLIC_API_URL`: API 基础 URL
- `SEEDREAM_API_KEY`: Seedream API 密钥
- `UNSPLASH_ACCESS_KEY`: Unsplash API 密钥

生产环境:
- 所有变量通过 Vercel Dashboard 配置
- `POSTGRES_URL`: Vercel 自动注入

---

## 性能优化建议

### 1. 组件优化

- 使用 `React.lazy()` 懒加载编辑器组件
- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 缓存函数引用

### 2. Canvas 优化

- 使用对象池减少对象创建
- 批量操作避免频繁 `renderAll()`
- 使用 `willChange` 属性优化渲染

### 3. 状态优化

- 使用选择器（Zustand）避免不必要重渲染
- 最小化全局状态
- 及时清理副作用

---

## 扩展性考虑

### 1. 新增 AI 服务

1. 在 `lib/api/` 下添加新的 API 客户端
2. 在 `components/editor/AssetPanel/` 下添加标签页
3. 在 `hooks/` 下添加使用 Hook
4. 在类型定义中添加相关类型

### 2. 新增素材源

1. 在 `lib/api/` 下添加素材源 API
2. 在 `AssetPanel` 下添加对应的标签页组件
3. 更新状态管理

### 3. 新增导出格式

1. 在 `lib/utils/download.ts` 下添加导出函数
2. 在 `Toolbar` 下添加导出按钮
3. 更新测试用例

---

## 最佳实践

1. **遵循文件夹命名约定**
   - 组件: PascalCase
   - 文件: kebab-case
   - Hooks: use 前缀

2. **使用 TypeScript 严格模式**
   - 所有组件使用类型标注
   - 避免使用 `any`

3. **保持组件职责单一**
   - 一个组件只负责一个功能
   - 复杂逻辑提取到 hooks 或工具函数

4. **及时更新文档**
   - 修改代码后同步更新文档
   - 使用文档检查开发进度

5. **编写测试**
   - 核心逻辑必须编写测试
   - 使用 TDD 或 BDD 开发方式

---

## 总结

这个源代码结构提供了:
- **清晰的分层**: 页面、组件、工具、状态管理
- **职责分离**: 每个模块职责明确
- **易于扩展**: 新功能可以快速添加
- **类型安全**: TypeScript 和共享类型定义
- **可维护性**: 规范的命名和组织方式

遵循这个结构可以确保项目的长期可维护性和团队协作效率。
