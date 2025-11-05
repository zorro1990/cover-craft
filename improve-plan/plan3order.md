# Claude Code 执行指令 - 阶段3测试与质量保障

你好 Claude Code，请按照以下计划执行"阶段 3 测试与质量保障"开发任务：

## 📄 任务文档
详细的改进计划已写入：`improve-plan/plan3.md`（1377 行）

请仔细阅读该文档，它包含：
- 逐文件、逐行的修改指令（精确到行号）
- 完整的代码示例（可直接复制）
- 详细的验收标准
- 测试策略和原子提交建议

## 🎯 执行顺序（严格按此顺序）

### Part 1: 解决 Fabric.js 版本冲突（0.5天）
**目标**：修复生产构建失败

**任务清单**：
1. 修改根目录 `package.json`
   - 删除 L25-27 的 `"fabric": "^6.7.1"` 依赖
   - 只保留 `engines` 配置
2. 清理并重新安装依赖
   ```bash
   rm -rf node_modules package-lock.json
   rm -rf apps/web/node_modules apps/web/package-lock.json
   npm install
   ```
3. 验证 fabric 版本
   ```bash
   npm list fabric -w apps/web
   # 应该输出：fabric@5.3.0
   ```
4. 验证构建成功
   ```bash
   cd apps/web
   npm run build
   ```

**验收标准**：
- [ ] 根目录 package.json 无 fabric 依赖
- [ ] apps/web 保留 fabric 5.3.0
- [ ] `npm run build` 构建成功
- [ ] 无 TypeScript 类型错误

**提交**：
```
fix: 解决 Fabric.js 版本冲突，修复生产构建失败

- 删除根目录 package.json 中的 fabric 依赖
- 统一使用 apps/web 的 fabric 5.3.0
- 清理并重新安装依赖
- 修复 TypeScript 类型错误
```

---

### Part 2: 修复现有测试失败（1天）
**目标**：测试通过率从 88.2% 提升到 100%

**任务清单**：

#### 2.1 修复 text.test.ts（6个失败）
**文件**：`apps/web/tests/lib/fabric/text.test.ts`

**策略**：简化测试，测试行为而非实现细节

**修改要点**（详见 plan3.md L171-260）：
- 删除 `require('fabric')` 和 mock 构造函数的代码
- 改为测试函数行为（是否调用 add、renderAll、setActiveObject）
- 验证返回对象的属性，而非 fabric.Text 的调用细节

**示例修改**（createText 测试）：
```typescript
it('should create a text object with default options', () => {
  const text = createText(mockCanvas as any)

  // 只测试行为，不测试 fabric.Text 的调用细节
  expect(mockCanvas.add).toHaveBeenCalled()
  expect(mockCanvas.renderAll).toHaveBeenCalled()
  expect(mockCanvas.setActiveObject).toHaveBeenCalled()

  // 验证返回的对象有正确的属性
  const addedObject = mockCanvas.add.mock.calls[0][0]
  expect(addedObject.type).toBe('text')
  expect(addedObject.text).toBe('双击编辑文字')
})
```

#### 2.2 修复 objects.test.ts（3个失败）
**文件**：`apps/web/tests/lib/fabric/objects.test.ts`

**修改位置**：L15-30

**修改前**：
```typescript
jest.mock('fabric', () => ({
  Canvas: jest.fn().mockImplementation(() => mockCanvas),
  Text: jest.fn().mockImplementation(function (text: string, props: any) {
    return { ... }
  }),
}))
```

**修改后**：
```typescript
jest.mock('fabric', () => ({
  fabric: {  // 添加 fabric 命名空间
    Canvas: jest.fn().mockImplementation(() => mockCanvas),
    Text: jest.fn().mockImplementation(function (this: any, text: string, props: any) {
      Object.assign(this, {  // 使用 this 和 Object.assign
        type: 'text',
        text,
        left: props.left || 0,
        top: props.top || 0,
        fontSize: props.fontSize || 24,
        fontFamily: props.fontFamily || 'Arial',
        fill: props.fill || '#000000',
        originX: props.originX || 'left',
        originY: props.originY || 'top',
        set: jest.fn(),
        setCoords: jest.fn(),
      })
      return this
    }),
  },
}))
```

#### 2.3 修复 image.test.ts（1个失败）
**文件**：`apps/web/tests/lib/fabric/image.test.ts`

**修改1**：L23, L38 - 函数名错误
```typescript
// 修改前
const dimensions = getImageObject(mockImageObject as any)

// 修改后
const dimensions = getImageDimensions(mockImageObject as any)
```

**修改2**：L60-80 - 断言不匹配
```typescript
// 修改前
expect(mockImageObject.set).toHaveBeenCalledWith('scaleX', 1)
expect(mockImageObject.set).toHaveBeenCalledWith('scaleY', 1)

// 修改后
expect(mockImageObject.set).toHaveBeenCalledWith({
  scaleX: 1,
  scaleY: 1,
})
```

**验收标准**：
- [ ] `npm test` 通过率：85/85 (100%)
- [ ] 无失败测试
- [ ] 所有修改的测试都通过

**提交**：
```
test: 修复 10 个失败测试，达到 100% 通过率

- 简化 text.test.ts，测试行为而非实现细节
- 修复 objects.test.ts 的 fabric mock 配置
- 修复 image.test.ts 的函数名和断言
- 所有测试通过（85/85）
```

---

### Part 3: 为阶段2新功能添加测试（1.5天）
**目标**：新增 30+ 个测试用例，覆盖阶段2所有新功能

**任务清单**：

#### 3.1 新建 canvas-view.test.ts
**文件**：`apps/web/tests/lib/fabric/canvas-view.test.ts`

**完整代码**（详见 plan3.md L467-551）：
- 测试 `setCanvasZoom` 函数（5个测试）
- 测试 `resetCanvasView` 函数（2个测试）
- 测试 `panCanvas` 函数（2个测试）

#### 3.2 新建 shape-drag-draw.test.ts
**文件**：`apps/web/tests/lib/fabric/shape-drag-draw.test.ts`

**完整代码**（详见 plan3.md L559-651）：
- 测试 `startDragDrawShape` 函数（3个测试）
- 测试 `updateDragDrawShape` 函数（1个测试）
- 测试 `finishDragDrawShape` 函数（1个测试）

#### 3.3 新建 ExportDialog.test.tsx
**文件**：`apps/web/tests/components/ExportDialog.test.tsx`

**完整代码**（详见 plan3.md L659-780）：
- 测试组件渲染（2个测试）
- 测试格式选择（1个测试）
- 测试质量选择（1个测试）
- 测试透明背景（1个测试）
- 测试导出按钮（2个测试）

**验收标准**：
- [ ] 新增 3 个测试文件
- [ ] 新增 30+ 个测试用例
- [ ] 总测试数：115+ (85 + 30)
- [ ] 通过率：100%

**提交**：
```
test: 为阶段2新功能添加测试覆盖

- 新增 canvas-view.test.ts（画布缩放/拖拽/重置）
- 新增 shape-drag-draw.test.ts（形状拖拽绘制）
- 新增 ExportDialog.test.tsx（导出设置弹窗）
- 新增 30+ 个测试用例
- 测试覆盖率提升至 100%
```

---

### Part 4: 代码质量优化（0.5天）
**目标**：ESLint 0错误，TypeScript 0错误，性能优化

**任务清单**：

#### 4.1 优化 ESLint 规则
**文件**：`apps/web/.eslintrc.json`

**修改**（详见 plan3.md L794-810）：
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

#### 4.2 添加 Canvas 渲染防抖优化
**文件**：`apps/web/src/lib/fabric/canvas.ts`

**新增函数**（在文件末尾，详见 plan3.md L838-858）：
```typescript
/**
 * 防抖渲染画布
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

**验收标准**：
- [ ] `npm run lint` 无错误
- [ ] `npm run type-check` 无错误
- [ ] Canvas 拖拽流畅（60fps）

**提交**：
```
refactor: 代码质量优化与性能提升

- 优化 ESLint 规则（禁止 console.log）
- 添加 Canvas 渲染防抖优化
- 修复所有 TypeScript 类型警告
- 提升拖拽/缩放性能
```

---

### Part 5: 部署准备（0.5天）
**目标**：环境变量、构建优化、部署配置

**任务清单**：

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

#### 5.2 优化 Next.js 配置
**文件**：`apps/web/next.config.js`

**完整配置**（详见 plan3.md L1004-1044）：
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

#### 5.4 更新 README
**文件**：`README.md`（根目录）

**新增内容**（详见 plan3.md L1072-1200）：
- 快速开始指南
- 测试覆盖率说明
- 技术栈介绍
- 项目结构说明
- 开发规范
- 环境变量配置
- 问题排查指南

**验收标准**：
- [ ] `.env.example` 已创建
- [ ] `next.config.js` 已优化
- [ ] `vercel.json` 已配置
- [ ] README 已更新
- [ ] `npm run build` 成功

**提交**：
```
chore: 部署准备与配置优化

- 添加环境变量模板 (.env.example)
- 优化 Next.js 构建配置
- 添加 Vercel 部署配置
- 更新 README 文档
- 生产构建测试通过
```

---

## ✅ 每个 Part 完成后必须执行

1. **运行测试**：
   ```bash
   npm test
   ```
   - 确保所有测试通过
   - 如有失败，立即修复

2. **运行 Lint**：
   ```bash
   npm run lint
   ```
   - 确保无 ESLint 错误

3. **类型检查**：
   ```bash
   npm run type-check
   ```
   - 确保无 TypeScript 错误

4. **构建检查**：
   ```bash
   npm run build
   ```
   - 确保构建成功

5. **Git 提交**：
   - 使用原子提交（每个功能点一个提交）
   - 提交信息格式：`fix:` / `test:` / `refactor:` / `chore:` + 简短描述

---

## ⚠️ 重要注意事项

1. **严格按顺序执行**：Part 1 → Part 2 → Part 3 → Part 4 → Part 5
2. **每个 Part 独立提交**：不要一次性完成所有功能再提交
3. **遇到问题立即反馈**：如果 plan3.md 中的指令有歧义或错误，立即告知
4. **保持代码质量**：
   - 所有错误处理使用 logger.error + toast.error
   - 所有成功提示使用 toast.success
   - 所有信息提示使用 toast.info
5. **测试优先**：每完成一个功能点，立即测试验证
6. **详细阅读 plan3.md**：所有代码示例都在文档中，可直接复制使用

---

## 📊 预期结果

完成后应达到：
- ✅ 测试通过率：100% (115/115)
- ✅ 生产构建成功
- ✅ ESLint 0 错误
- ✅ TypeScript 0 错误
- ✅ 性能优化完成（60fps）
- ✅ 部署配置完成
- ✅ 13 个原子提交（清晰的 Git 历史）

---

## 🚀 开始执行

请从 **Part 1** 开始执行，完成后向我汇报进度和测试结果。

如有任何疑问，随时询问。加油！💪
