# Claude Code 执行指令 - 阶段3A：核心修复

你好 Claude Code，请按照以下计划执行"阶段 3A 核心修复"开发任务：

## 📄 任务文档
详细的改进计划已写入：`improve-plan/plan3.md`（1377 行）

本次执行范围：**Part 1-2**（核心修复）

## 🎯 本次目标

**工作量**：1.5 天  
**优先级**：⭐⭐⭐ 最高（必做）  
**风险等级**：低（只修复现有问题，不新增功能）

**核心目标**：
- ✅ 修复生产构建失败（Fabric.js 版本冲突）
- ✅ 修复 10 个失败测试
- ✅ 测试通过率从 88.2% 提升到 100%

---

## 📋 Part 1: 解决 Fabric.js 版本冲突（0.5天）

### 问题描述
- 根目录 `package.json` 有 `fabric: ^6.7.1`（错误）
- `apps/web/package.json` 有 `fabric: 5.3.0`（正确）
- 导致生产构建失败：`Module '"fabric"' has no exported member 'fabric'`

### 任务清单

#### 1.1 修改根目录 package.json
**文件**：`package.json`（根目录）

**操作**：删除 L25-27 的 fabric 依赖

**修改前**（L21-28）：
```json
"engines": {
  "node": ">=18.0.0",
  "npm": ">=9.0.0"
},
"dependencies": {
  "fabric": "^6.7.1"
}
```

**修改后**（L21-26）：
```json
"engines": {
  "node": ">=18.0.0",
  "npm": ">=9.0.0"
}
```

#### 1.2 清理并重新安装依赖
**在项目根目录执行**：
```bash
rm -rf node_modules package-lock.json
rm -rf apps/web/node_modules apps/web/package-lock.json
npm install
```

#### 1.3 验证 fabric 版本
```bash
npm list fabric -w apps/web
# 应该输出：fabric@5.3.0
```

#### 1.4 验证构建成功
```bash
cd apps/web
npm run build
```

### 验收标准
- [ ] 根目录 package.json 无 fabric 依赖
- [ ] apps/web 保留 fabric 5.3.0
- [ ] `npm run build` 构建成功，无 TypeScript 错误
- [ ] `npm run dev` 正常启动

### Git 提交
```
fix: 解决 Fabric.js 版本冲突，修复生产构建失败

- 删除根目录 package.json 中的 fabric 依赖
- 统一使用 apps/web 的 fabric 5.3.0
- 清理并重新安装依赖
- 修复 TypeScript 类型错误
```

---

## 📋 Part 2: 修复现有测试失败（1天）

### 问题描述
当前测试结果：10 failed, 75 passed, 85 total

**失败分类**：
- text.test.ts：6 个失败
- objects.test.ts：3 个失败
- image.test.ts：1 个失败

### 任务清单

#### 2.1 修复 text.test.ts（6个失败）
**文件**：`apps/web/tests/lib/fabric/text.test.ts`

**策略**：简化测试，测试行为而非实现细节

**详细修改指令**（参考 plan3.md L171-260）：

**核心思路**：
- 删除 `require('fabric')` 和 mock 构造函数的代码
- 改为测试函数行为（是否调用 add、renderAll、setActiveObject）
- 验证返回对象的属性，而非 fabric.Text 的调用细节

**示例修改**（第一个测试）：
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

**需要修改的测试**：
- L23-53：第一个 createText 测试
- L55-92：第二个 createText 测试
- L94-137：applyTextFormatting 测试
- L139-175：removeTextFormatting 测试
- L177-311：其他测试（同样简化）

**完整修改后的文件结构**（参考 plan3.md L195-260）

#### 2.2 修复 objects.test.ts（3个失败）
**文件**：`apps/web/tests/lib/fabric/objects.test.ts`

**问题**：Mock 配置不正确，fabric.Text 未定义

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

**详细说明**（参考 plan3.md L262-320）

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

**详细说明**（参考 plan3.md L322-424）

### 验收标准
- [ ] `npm test` 通过率：85/85 (100%)
- [ ] 无失败测试
- [ ] text.test.ts 的 6 个测试全部通过
- [ ] objects.test.ts 的 3 个测试全部通过
- [ ] image.test.ts 的 1 个测试通过

### Git 提交
```
test: 修复 10 个失败测试，达到 100% 通过率

- 简化 text.test.ts，测试行为而非实现细节
- 修复 objects.test.ts 的 fabric mock 配置
- 修复 image.test.ts 的函数名和断言
- 所有测试通过（85/85）
```

---

## ✅ 每个 Part 完成后必须执行

### 1. 运行测试
```bash
npm test
```
- 确保所有测试通过
- 如有失败，立即修复

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

### 5. Git 提交
- 使用原子提交（每个 Part 一个提交）
- 提交信息格式：`fix:` / `test:` + 简短描述

---

## ⚠️ 重要注意事项

1. **严格按顺序执行**：Part 1 → Part 2
2. **Part 1 完成后先验证**：确保构建成功后再执行 Part 2
3. **遇到问题立即反馈**：如果 plan3.md 中的指令有歧义或错误，立即告知
4. **保持代码质量**：
   - 所有错误处理使用 logger.error + toast.error
   - 所有成功提示使用 toast.success
5. **详细阅读 plan3.md**：所有代码示例都在文档中，可直接复制使用
6. **本次只执行 Part 1-2**：不要继续执行 Part 3-5，等待下一批指令

---

## 📊 预期结果

完成后应达到：
- ✅ 根目录无 fabric 依赖
- ✅ 生产构建成功（`npm run build`）
- ✅ 测试通过率：100% (85/85)
- ✅ 无 ESLint 错误
- ✅ 无 TypeScript 错误
- ✅ 2 个原子提交（Part 1 和 Part 2 各一个）

---

## 🚀 开始执行

请从 **Part 1** 开始执行。

**执行步骤**：
1. 修改根目录 package.json
2. 清理并重新安装依赖
3. 验证构建成功
4. 提交 Part 1
5. 修复 text.test.ts
6. 修复 objects.test.ts
7. 修复 image.test.ts
8. 验证测试全部通过
9. 提交 Part 2
10. 向我汇报完成情况

**完成后请汇报**：
- Part 1 和 Part 2 的执行结果
- 测试通过率（应该是 85/85）
- 构建是否成功
- 遇到的问题（如有）

如有任何疑问，随时询问。加油！💪

