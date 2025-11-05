# Claude Code 执行指令 - 阶段3C：生产准备

你好 Claude Code，请按照以下计划执行"阶段 3C 生产准备"开发任务：

## 📄 任务文档
详细的改进计划已写入：`improve-plan/plan3.md`（1377 行）

本次执行范围：**Part 4-5**（生产准备）

## 🎯 本次目标

**工作量**：1 天  
**优先级**：⭐ 低（可选，建议上线前执行）  
**风险等级**：低（主要是配置，不影响核心功能）

**核心目标**：
- ✅ 优化代码质量（ESLint、性能）
- ✅ 完成部署准备（环境变量、配置、文档）
- ✅ 项目达到生产就绪状态

**前置条件**：
- ✅ Plan3A 已完成（构建成功 + 测试 100%）
- ✅ Plan3B 已完成（测试覆盖 115+）
- ✅ 当前测试通过率：115/115 (100%)

---

## 📋 Part 4: 代码质量优化（0.5天）

### 任务清单

#### 4.1 优化 ESLint 规则
**文件**：`apps/web/.eslintrc.json`

**当前配置**：
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@next/next/no-img-element": "off",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

**优化后**：
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@next/next/no-img-element": "off",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["error", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }]
  }
}
```

**说明**：
- 禁止 `console.log`（允许 `console.warn` 和 `console.error`）
- 警告使用 `any` 类型
- 错误未使用的变量（允许 `_` 前缀）

**验证**：
```bash
npm run lint
# 应该无错误
```

---

#### 4.2 添加 Canvas 渲染防抖优化
**文件**：`apps/web/src/lib/fabric/canvas.ts`

**在文件末尾添加**（详见 plan3.md L838-858）：

```typescript
/**
 * 防抖渲染画布
 * @param canvas Fabric.js Canvas 实例
 * @param delay 延迟时间（毫秒）
 */
let renderTimeout: NodeJS.Timeout | null = null

export function debouncedRenderAll(
  canvas: fabric.Canvas | null,
  delay: number = 16 // ~60fps
) {
  if (!canvas) return

  if (renderTimeout) {
    clearTimeout(renderTimeout)
  }

  renderTimeout = setTimeout(() => {
    canvas.renderAll()
    renderTimeout = null
  }, delay)
}
```

**修改 panCanvas 函数**（使用防抖渲染）：

找到 `panCanvas` 函数，将最后的 `canvas.renderAll()` 改为 `debouncedRenderAll(canvas)`：

```typescript
export function panCanvas(
  canvas: fabric.Canvas | null,
  deltaX: number,
  deltaY: number
) {
  if (!canvas) {
    logger.warn('Canvas is not initialized')
    return
  }

  const vpt = canvas.viewportTransform
  if (!vpt) return

  vpt[4] += deltaX
  vpt[5] += deltaY

  canvas.setViewportTransform(vpt)
  debouncedRenderAll(canvas) // 使用防抖渲染
}
```

**说明**：
- 防止频繁渲染导致性能问题
- 16ms 延迟约等于 60fps
- 提升拖拽操作的流畅度

**验证**：
```bash
npm run dev
# 测试拖拽画布，应该更流畅
```

---

### Part 4 验收标准
- [ ] `npm run lint` 无错误
- [ ] `npm run type-check` 无错误
- [ ] Canvas 拖拽流畅（60fps）
- [ ] 无 `console.log` 直接调用

### Part 4 Git 提交
```
refactor: 代码质量优化与性能提升

- 优化 ESLint 规则（禁止 console.log）
- 添加 Canvas 渲染防抖优化
- 修复所有 TypeScript 类型警告
- 提升拖拽/缩放性能
```

---

## 📋 Part 5: 部署准备（0.5天）

### 任务清单

#### 5.1 创建环境变量模板
**新建文件**：`apps/web/.env.example`

**内容**（详见 plan3.md L982-996）：
```bash
# 应用配置
NEXT_PUBLIC_APP_NAME=Cover Craft AI
NEXT_PUBLIC_APP_URL=https://cover-craft.vercel.app

# API 配置（预留，阶段3功能使用）
# NEXT_PUBLIC_SEEDREAM_API_KEY=your_api_key_here
# NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_access_key_here
# NEXT_PUBLIC_REMOVE_BG_API_KEY=your_api_key_here

# 分析与监控（可选）
# NEXT_PUBLIC_GA_TRACKING_ID=your_ga_id_here
# NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

**说明**：
- 提供环境变量模板
- 开发者复制为 `.env.local` 使用
- 敏感信息不提交到 Git

---

#### 5.2 优化 Next.js 配置
**文件**：`apps/web/next.config.js`

**当前配置**：
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
```

**优化后**（详见 plan3.md L1004-1044）：
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 生产构建优化
  swcMinify: true,

  // 图片优化
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },

  // 严格模式
  reactStrictMode: true,

  // 输出配置
  output: 'standalone',

  // 性能优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Webpack 配置
  webpack: (config, { isServer }) => {
    // Fabric.js 配置
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },
}

module.exports = nextConfig
```

**说明**：
- 启用 SWC 压缩
- 生产环境移除 console.log
- 配置 Fabric.js 的 Webpack fallback
- 启用 React 严格模式

**验证**：
```bash
npm run build
# 应该构建成功
```

---

#### 5.3 创建 Vercel 部署配置
**新建文件**：`vercel.json`（根目录）

**内容**（详见 plan3.md L1052-1064）：
```json
{
  "buildCommand": "npm run build -w apps/web",
  "outputDirectory": "apps/web/.next",
  "devCommand": "npm run dev -w apps/web",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["hkg1"],
  "env": {
    "NEXT_PUBLIC_APP_NAME": "Cover Craft AI"
  }
}
```

**说明**：
- 配置 monorepo 构建命令
- 指定输出目录
- 设置部署区域（香港）
- 配置环境变量

---

#### 5.4 更新 README
**文件**：`README.md`（根目录）

**在现有内容后添加**（详见 plan3.md L1072-1200）：

```markdown
## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 开发环境

\`\`\`bash
npm run dev
\`\`\`

访问 http://localhost:3000

### 生产构建

\`\`\`bash
npm run build
npm run start
\`\`\`

### 运行测试

\`\`\`bash
npm test
\`\`\`

## 📊 测试覆盖率

当前测试覆盖率：**100%** (115/115 测试通过)

- 单元测试：85 个
- 组件测试：20 个
- 集成测试：10 个

## 🏗️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5.3+
- **UI**: React 18 + Tailwind CSS
- **Canvas**: Fabric.js 5.3.0
- **状态管理**: Zustand 4.4.7
- **测试**: Jest + Testing Library
- **部署**: Vercel

## 📁 项目结构

\`\`\`
cover-craft/
├── apps/
│   └── web/                 # Next.js 应用
│       ├── src/
│       │   ├── app/         # App Router 页面
│       │   ├── components/  # React 组件
│       │   ├── lib/         # 工具库
│       │   ├── hooks/       # React Hooks
│       │   └── stores/      # Zustand 状态
│       └── tests/           # 测试文件
├── packages/
│   └── shared-types/        # 共享类型定义
└── docs/                    # 文档
\`\`\`

## 🔧 开发规范

### 编码规范

- 文件命名：kebab-case
- 组件命名：PascalCase
- 函数命名：camelCase
- 常量命名：UPPER_SNAKE_CASE

### Git 提交规范

\`\`\`
feat: 新功能
fix: 修复 bug
refactor: 重构
test: 测试
docs: 文档
chore: 构建/工具
\`\`\`

### 测试策略

- 单元测试：覆盖核心函数
- 组件测试：覆盖用户交互
- 集成测试：覆盖关键流程
- 目标覆盖率：>95%

## 📝 环境变量

复制 \`.env.example\` 为 \`.env.local\`：

\`\`\`bash
cp apps/web/.env.example apps/web/.env.local
\`\`\`

## 🐛 问题排查

### Fabric.js 版本冲突

如果遇到 \`Module '"fabric"' has no exported member 'fabric'\` 错误：

\`\`\`bash
rm -rf node_modules package-lock.json
rm -rf apps/web/node_modules apps/web/package-lock.json
npm install
\`\`\`

### 测试失败

确保使用正确的 Node.js 版本：

\`\`\`bash
node -v  # 应该 >= 18.0.0
npm test
\`\`\`

## 📄 许可证

MIT License
```

**说明**：
- 添加快速开始指南
- 添加技术栈说明
- 添加项目结构说明
- 添加开发规范
- 添加问题排查指南

---

### Part 5 验收标准
- [ ] `.env.example` 已创建
- [ ] `next.config.js` 已优化
- [ ] `vercel.json` 已配置
- [ ] README 已更新
- [ ] `npm run build` 成功

### Part 5 Git 提交
```
chore: 部署准备与配置优化

- 添加环境变量模板 (.env.example)
- 优化 Next.js 构建配置
- 添加 Vercel 部署配置
- 更新 README 文档
- 生产构建测试通过
```

---

## ✅ 完成后必须执行

### 1. 运行测试
```bash
npm test
```
- 确保所有测试仍然通过（115/115）

### 2. 运行 Lint
```bash
npm run lint
```
- 确保无 ESLint 错误

### 3. 类型检查
```bash
npm run type-check
```
- 确保无 TypeScript 错误

### 4. 构建检查
```bash
npm run build
```
- 确保构建成功
- 检查构建产物大小（应该 < 5MB）

### 5. Git 提交
- Part 4 一个提交
- Part 5 一个提交
- 共 2 个原子提交

---

## ⚠️ 重要注意事项

1. **确保 Plan3A 和 Plan3B 已完成**：
   - 构建应该成功
   - 测试应该 115/115 通过
2. **本次主要是配置和文档**：不修改核心业务代码
3. **验证构建成功**：Part 5 完成后必须验证构建
4. **遇到问题立即反馈**：如果构建失败，检查配置是否正确
5. **详细阅读 plan3.md**：所有代码示例都在文档中

---

## 📊 预期结果

完成后应达到：
- ✅ ESLint 0 错误
- ✅ TypeScript 0 错误
- ✅ 测试通过率：100% (115/115)
- ✅ 生产构建成功
- ✅ 性能优化完成（60fps）
- ✅ 部署配置完成
- ✅ 文档完善
- ✅ 2 个原子提交

---

## 🚀 开始执行

请按以下顺序执行：

**执行步骤**：
1. 修改 `.eslintrc.json`
2. 添加 `debouncedRenderAll` 函数
3. 修改 `panCanvas` 函数
4. 运行 lint 和测试
5. 提交 Part 4
6. 创建 `.env.example`
7. 修改 `next.config.js`
8. 创建 `vercel.json`
9. 更新 `README.md`
10. 运行构建测试
11. 提交 Part 5
12. 向我汇报完成情况

**完成后请汇报**：
- Part 4 和 Part 5 的执行结果
- 构建是否成功
- 构建产物大小
- 遇到的问题（如有）

---

## 🎉 阶段3全部完成！

完成 Plan3C 后，整个阶段3就全部完成了！

**最终状态**：
- ✅ Fabric.js 版本冲突已解决
- ✅ 所有测试通过（115/115）
- ✅ 测试覆盖率 100%
- ✅ 代码质量优化完成
- ✅ 部署配置完成
- ✅ 项目生产就绪

**可以开始部署到 Vercel 了！** 🚀

如有任何疑问，随时询问。加油！💪

