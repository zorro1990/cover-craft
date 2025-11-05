# Cover Craft AI - 阶段 2 改进计划

## 📋 概述

**目标**：对齐 MVP 验收标准，补齐关键交互路径

**范围**：
1. ✅ **阶段1余留问题修复**（console.error + 测试 mock）
2. 🎯 **画布视图缩放/拖拽/重置**（US-101 场景3）
3. 🎯 **形状拖拽绘制交互**（US-104 场景1-3）
4. 🎯 **导出设置弹窗**（US-105 场景2）

**预计工时**：3.5 天
- 阶段1余留：0.5 天
- 画布视图操作：1.5 天
- 形状拖拽绘制：0.75 天
- 导出设置弹窗：0.75 天

---

## 🔧 Part 0: 阶段1余留问题修复

### 0.1 替换剩余的 console.error

**问题**：以下文件仍有直接 console.error 调用，违反编码规范

#### 修改文件 1: `apps/web/src/app/editor/page.tsx`

**位置与改动**：
- 顶部已有 `import { useToast } from '@/components/ui/Toast'`，无需新增
- L89: `console.error('Image upload error:', error)` → 删除（已有 toast.error）
- L113: `console.error('Shape creation error:', error)` → 删除（已有 toast.error）
- L130: `console.error('Export error:', error)` → 删除（已有 toast.error）
- L146: `console.error('Copy error:', error)` → 删除（已有 toast.error）

**示例修改**（L88-92）：
```tsx
// 旧代码
} catch (error) {
  console.error('Image upload error:', error)  // ← 删除此行
  toast.error('图片上传失败，请重试')
}

// 新代码
} catch (error) {
  toast.error('图片上传失败，请重试')
}
```

同样处理 L112-116、L129-133、L145-149。

---

#### 修改文件 2: `apps/web/src/hooks/useCanvas.ts`

**位置与改动**：
- 顶部新增：`import { logger } from '@/lib/utils/logger'`
- L12: `console.error('Canvas not initialized')` → `logger.warn('Canvas not initialized')`
- L19: `console.error('Failed to add text:', error)` → `logger.error('Failed to add text')`

**示例修改**（完整文件）：
```tsx
'use client'

import { useState } from 'react'
import { fabric } from 'fabric'
import { logger } from '@/lib/utils/logger'
import { createTextObject } from '@/lib/fabric/objects'

export function useCanvas() {
  const [canvas, setCanvasState] = useState<fabric.Canvas | null>(null)

  const addText = (options: any = {}) => {
    if (!canvas) {
      logger.warn('Canvas not initialized')
      return
    }

    try {
      createTextObject(canvas, options)
    } catch (error) {
      logger.error('Failed to add text')
    }
  }

  const setCanvas = (canvas: fabric.Canvas) => {
    setCanvasState(canvas)
  }

  return {
    canvas,
    setCanvas,
    addText,
  }
}
```

---

### 0.2 修复测试问题：Mock Canvas getContext

**问题**：Jest 环境下 jsdom 不支持 HTMLCanvasElement.prototype.getContext，导致 fabric.Text 测试失败

#### 新建文件: `apps/web/jest.setup.js`

**内容**：
```js
// Mock HTMLCanvasElement.prototype.getContext for fabric.js
HTMLCanvasElement.prototype.getContext = function() {
  return {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10,
    setLineDash: function() {},
    getLineDash: function() { return [] },
    fillRect: function() {},
    clearRect: function() {},
    getImageData: function(x, y, w, h) {
      return { data: new Array(w * h * 4) }
    },
    putImageData: function() {},
    createImageData: function() { return [] },
    setTransform: function() {},
    drawImage: function() {},
    save: function() {},
    fillText: function() {},
    restore: function() {},
    beginPath: function() {},
    moveTo: function() {},
    lineTo: function() {},
    closePath: function() {},
    stroke: function() {},
    translate: function() {},
    scale: function() {},
    rotate: function() {},
    arc: function() {},
    fill: function() {},
    measureText: function() {
      return { width: 0 }
    },
    transform: function() {},
    rect: function() {},
    clip: function() {},
  }
}

// Mock toDataURL
HTMLCanvasElement.prototype.toDataURL = function() {
  return 'data:image/png;base64,mock'
}
```

---

#### 修改文件: `apps/web/jest.config.js`

**位置与改动**：
- 在配置对象中新增 `setupFilesAfterEnv` 字段

**示例修改**（L10 附近）：
```js
module.exports = {
  // ... 现有配置
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],  // ← 新增此行
  // ... 其余配置
}
```

---

## 🎯 Part 1: 画布视图缩放/拖拽/重置

### 1.1 功能说明

**用户故事验收标准**（US-101 场景3）：
- [ ] 用户可以拖拽画布内容到合适位置
- [ ] 用户可以通过鼠标滚轮缩放画布视图
- [ ] 用户可以通过快捷键重置画布视图 (Ctrl+0)

**实现方案**：
- 使用 Fabric.js 的 viewport transform 功能
- 监听鼠标滚轮事件实现缩放（以鼠标位置为中心）
- 监听鼠标拖拽事件（按住空格键）实现平移
- 添加 Ctrl+0 快捷键重置视图到 100% 缩放、居中位置

---

### 1.2 修改文件清单

1. `apps/web/src/lib/fabric/canvas.ts` - 添加视图操作工具函数
2. `apps/web/src/components/editor/Canvas/Canvas.tsx` - 添加缩放/拖拽事件监听
3. `apps/web/src/app/editor/page.tsx` - 添加重置视图快捷键
4. `apps/web/src/components/editor/Toolbar/Toolbar.tsx` - 添加缩放控制按钮（可选）

---

### 1.3 详细修改指令

#### 修改文件 1: `apps/web/src/lib/fabric/canvas.ts`

**在文件末尾新增以下函数**（L168 之后）：

```typescript
/**
 * 设置画布缩放级别
 * @param canvas Fabric.js Canvas 实例
 * @param zoom 缩放级别（1 = 100%）
 * @param point 缩放中心点（可选，默认为画布中心）
 */
export function setCanvasZoom(
  canvas: fabric.Canvas | null,
  zoom: number,
  point?: { x: number; y: number }
) {
  if (!canvas) {
    logger.warn('Canvas is not initialized')
    return
  }

  // 限制缩放范围 0.1x - 5x
  const clampedZoom = Math.max(0.1, Math.min(5, zoom))

  if (point) {
    canvas.zoomToPoint(new fabric.Point(point.x, point.y), clampedZoom)
  } else {
    canvas.setZoom(clampedZoom)
  }

  canvas.requestRenderAll()
}

/**
 * 重置画布视图（100% 缩放，居中）
 * @param canvas Fabric.js Canvas 实例
 */
export function resetCanvasView(canvas: fabric.Canvas | null) {
  if (!canvas) {
    logger.warn('Canvas is not initialized')
    return
  }

  canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
  canvas.requestRenderAll()
}

/**
 * 平移画布视图
 * @param canvas Fabric.js Canvas 实例
 * @param deltaX X 轴偏移量
 * @param deltaY Y 轴偏移量
 */
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
  if (vpt) {
    vpt[4] += deltaX
    vpt[5] += deltaY
    canvas.requestRenderAll()
  }
}
```

---

#### 修改文件 2: `apps/web/src/components/editor/Canvas/Canvas.tsx`

**位置与改动**：

1. **顶部新增导入**（L5 附近）：
```tsx
import { setCanvasZoom, panCanvas } from '@/lib/fabric/canvas'
```

2. **在 useEffect 内部，canvas 初始化成功后新增事件监听**（L45 附近，`onCanvasReady(canvas)` 之后）：

```tsx
// 初始化成功后的代码
onCanvasReady(canvas)

// ========== 新增：缩放与拖拽事件监听 ==========

// 鼠标滚轮缩放
canvas.on('mouse:wheel', (opt) => {
  const delta = opt.e.deltaY
  let zoom = canvas.getZoom()
  zoom *= 0.999 ** delta
  setCanvasZoom(canvas, zoom, { x: opt.e.offsetX, y: opt.e.offsetY })
  opt.e.preventDefault()
  opt.e.stopPropagation()
})

// 按住空格键拖拽画布
let isPanning = false
let lastPosX = 0
let lastPosY = 0

canvas.on('mouse:down', (opt) => {
  const evt = opt.e as MouseEvent
  if (evt.spaceKey || evt.button === 1) { // 空格键或中键
    isPanning = true
    canvas.selection = false
    lastPosX = evt.clientX
    lastPosY = evt.clientY
  }
})

canvas.on('mouse:move', (opt) => {
  if (isPanning) {
    const evt = opt.e as MouseEvent
    const deltaX = evt.clientX - lastPosX
    const deltaY = evt.clientY - lastPosY
    panCanvas(canvas, deltaX, deltaY)
    lastPosX = evt.clientX
    lastPosY = evt.clientY
  }
})

canvas.on('mouse:up', () => {
  if (isPanning) {
    isPanning = false
    canvas.selection = true
  }
})

// ========== 新增结束 ==========
```

**注意**：需要在全局监听空格键状态，在 Canvas 组件外部添加：

3. **在 useEffect 外部新增空格键监听**（组件内部，return 之前）：

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault()
      ;(e as any).spaceKey = true
    }
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      ;(e as any).spaceKey = false
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)

  return () => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  }
}, [])
```

---

#### 修改文件 3: `apps/web/src/app/editor/page.tsx`

**位置与改动**：

1. **顶部新增导入**（L16 附近）：
```tsx
import { resetCanvasView } from '@/lib/fabric/canvas'
```

2. **在组件内部新增快捷键监听**（L25 附近，`const toast = useToast()` 之后）：

```tsx
// 重置视图快捷键 (Ctrl+0)
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '0') {
      e.preventDefault()
      resetCanvasView(canvasInstance)
      toast.success('视图已重置')
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [canvasInstance, toast])
```

---

## 🎯 Part 2: 形状拖拽绘制交互

### 2.1 功能说明

**用户故事验收标准**（US-104 场景1-3）：
- [ ] 用户按 R 键进入矩形绘制模式
- [ ] 鼠标在画布上点击并拖拽可以绘制矩形
- [ ] 释放鼠标后，矩形固定在画布上
- [ ] 同样适用于圆形（O键）和直线（L键）

**实现方案**：
- 在 EditorPage 中添加绘制模式状态（'none' | 'rectangle' | 'circle' | 'line'）
- 监听 R/O/L 键切换绘制模式
- 在画布上监听 mousedown/mousemove/mouseup 事件
- 实时绘制形状预览（半透明）
- 释放鼠标后固定形状并退出绘制模式

---

### 2.2 修改文件清单

1. `apps/web/src/app/editor/page.tsx` - 添加绘制模式状态和事件处理
2. `apps/web/src/lib/fabric/shape.ts` - 添加拖拽绘制函数
3. `apps/web/src/components/editor/AssetPanel/ShapeTab.tsx` - 添加绘制模式提示

---

### 2.3 详细修改指令

#### 修改文件 1: `apps/web/src/lib/fabric/shape.ts`

**在文件末尾新增以下函数**（L180 之后）：

```typescript
/**
 * 开始拖拽绘制形状
 * @param canvas Fabric.js Canvas 实例
 * @param type 形状类型
 * @param startPoint 起始点
 * @returns 临时形状对象
 */
export function startDragDrawShape(
  canvas: fabric.Canvas,
  type: 'rectangle' | 'circle' | 'line',
  startPoint: { x: number; y: number }
): fabric.Object | null {
  let shape: fabric.Object | null = null

  switch (type) {
    case 'rectangle':
      shape = new fabric.Rect({
        left: startPoint.x,
        top: startPoint.y,
        width: 0,
        height: 0,
        fill: 'rgba(59, 130, 246, 0.3)',
        stroke: '#3b82f6',
        strokeWidth: 2,
        selectable: false,
      })
      break

    case 'circle':
      shape = new fabric.Circle({
        left: startPoint.x,
        top: startPoint.y,
        radius: 0,
        fill: 'rgba(59, 130, 246, 0.3)',
        stroke: '#3b82f6',
        strokeWidth: 2,
        selectable: false,
      })
      break

    case 'line':
      shape = new fabric.Line([startPoint.x, startPoint.y, startPoint.x, startPoint.y], {
        stroke: '#3b82f6',
        strokeWidth: 2,
        selectable: false,
      })
      break
  }

  if (shape) {
    canvas.add(shape)
    canvas.requestRenderAll()
  }

  return shape
}

/**
 * 更新拖拽绘制中的形状
 * @param shape 形状对象
 * @param type 形状类型
 * @param startPoint 起始点
 * @param currentPoint 当前点
 */
export function updateDragDrawShape(
  shape: fabric.Object,
  type: 'rectangle' | 'circle' | 'line',
  startPoint: { x: number; y: number },
  currentPoint: { x: number; y: number }
) {
  switch (type) {
    case 'rectangle': {
      const rect = shape as fabric.Rect
      const width = currentPoint.x - startPoint.x
      const height = currentPoint.y - startPoint.y
      rect.set({
        width: Math.abs(width),
        height: Math.abs(height),
        left: width > 0 ? startPoint.x : currentPoint.x,
        top: height > 0 ? startPoint.y : currentPoint.y,
      })
      break
    }

    case 'circle': {
      const circle = shape as fabric.Circle
      const radius = Math.sqrt(
        Math.pow(currentPoint.x - startPoint.x, 2) +
        Math.pow(currentPoint.y - startPoint.y, 2)
      )
      circle.set({ radius })
      break
    }

    case 'line': {
      const line = shape as fabric.Line
      line.set({
        x2: currentPoint.x,
        y2: currentPoint.y,
      })
      break
    }
  }

  shape.canvas?.requestRenderAll()
}

/**
 * 完成拖拽绘制，固定形状
 * @param canvas Fabric.js Canvas 实例
 * @param shape 临时形状对象
 * @param type 形状类型
 */
export function finishDragDrawShape(
  canvas: fabric.Canvas,
  shape: fabric.Object,
  type: 'rectangle' | 'circle' | 'line'
) {
  // 移除临时形状
  canvas.remove(shape)

  // 创建最终形状（使用默认样式）
  const finalShape = createShapeByType(canvas, type, {
    left: shape.left,
    top: shape.top,
    ...(type === 'rectangle' && { width: (shape as fabric.Rect).width, height: (shape as fabric.Rect).height }),
    ...(type === 'circle' && { radius: (shape as fabric.Circle).radius }),
    ...(type === 'line' && {
      x1: (shape as fabric.Line).x1,
      y1: (shape as fabric.Line).y1,
      x2: (shape as fabric.Line).x2,
      y2: (shape as fabric.Line).y2,
    }),
  })

  canvas.setActiveObject(finalShape)
  canvas.requestRenderAll()
}

/**
 * 根据类型创建形状（内部辅助函数）
 */
function createShapeByType(
  canvas: fabric.Canvas,
  type: 'rectangle' | 'circle' | 'line',
  options: any
): fabric.Object {
  switch (type) {
    case 'rectangle':
      return createRectangle(canvas, options)
    case 'circle':
      return createCircle(canvas, options)
    case 'line':
      return createLine(canvas, options)
  }
}
```

---

#### 修改文件 2: `apps/web/src/app/editor/page.tsx`

**位置与改动**：

1. **顶部新增导入**（L16 附近）：
```tsx
import { startDragDrawShape, updateDragDrawShape, finishDragDrawShape } from '@/lib/fabric/shape'
```

2. **在组件内部新增绘制模式状态**（L24 附近）：
```tsx
const [drawMode, setDrawMode] = useState<'none' | 'rectangle' | 'circle' | 'line'>('none')
const [isDrawing, setIsDrawing] = useState(false)
const [tempShape, setTempShape] = useState<fabric.Object | null>(null)
const [drawStartPoint, setDrawStartPoint] = useState<{ x: number; y: number } | null>(null)
```

3. **新增绘制模式快捷键监听**（在重置视图快捷键之后）：

```tsx
// 形状绘制快捷键 (R/O/L)
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // 如果正在编辑文本，不触发快捷键
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
      return
    }

    switch (e.key.toLowerCase()) {
      case 'r':
        setDrawMode('rectangle')
        toast.info('矩形绘制模式：在画布上拖拽绘制')
        break
      case 'o':
        setDrawMode('circle')
        toast.info('圆形绘制模式：在画布上拖拽绘制')
        break
      case 'l':
        setDrawMode('line')
        toast.info('直线绘制模式：在画布上拖拽绘制')
        break
      case 'escape':
        if (drawMode !== 'none') {
          setDrawMode('none')
          toast.info('已退出绘制模式')
        }
        break
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [drawMode, toast])
```

4. **新增画布绘制事件监听**（在快捷键监听之后）：

```tsx
// 画布绘制事件监听
useEffect(() => {
  if (!canvasInstance || drawMode === 'none') return

  const handleMouseDown = (opt: fabric.IEvent) => {
    const pointer = canvasInstance.getPointer(opt.e)
    setIsDrawing(true)
    setDrawStartPoint(pointer)
    const shape = startDragDrawShape(canvasInstance, drawMode, pointer)
    setTempShape(shape)
  }

  const handleMouseMove = (opt: fabric.IEvent) => {
    if (!isDrawing || !tempShape || !drawStartPoint) return
    const pointer = canvasInstance.getPointer(opt.e)
    updateDragDrawShape(tempShape, drawMode, drawStartPoint, pointer)
  }

  const handleMouseUp = () => {
    if (!isDrawing || !tempShape) return
    finishDragDrawShape(canvasInstance, tempShape, drawMode)
    setIsDrawing(false)
    setTempShape(null)
    setDrawStartPoint(null)
    setDrawMode('none')
    toast.success('形状已创建')
  }

  canvasInstance.on('mouse:down', handleMouseDown)
  canvasInstance.on('mouse:move', handleMouseMove)
  canvasInstance.on('mouse:up', handleMouseUp)

  return () => {
    canvasInstance.off('mouse:down', handleMouseDown)
    canvasInstance.off('mouse:move', handleMouseMove)
    canvasInstance.off('mouse:up', handleMouseUp)
  }
}, [canvasInstance, drawMode, isDrawing, tempShape, drawStartPoint, toast])
```

---

#### 修改文件 3: `apps/web/src/components/editor/AssetPanel/ShapeTab.tsx`

**位置与改动**：

在现有按钮下方新增提示文本（L28 附近）：

```tsx
<div className="space-y-2">
  <button
    onClick={() => onAddShape('rectangle')}
    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    矩形
  </button>
  <button
    onClick={() => onAddShape('circle')}
    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    圆形
  </button>
  <button
    onClick={() => onAddShape('line')}
    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    直线
  </button>

  {/* 新增：快捷键提示 */}
  <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-600">
    <p className="font-semibold mb-2">快捷键绘制：</p>
    <ul className="space-y-1">
      <li><kbd className="px-2 py-1 bg-white rounded border">R</kbd> 矩形</li>
      <li><kbd className="px-2 py-1 bg-white rounded border">O</kbd> 圆形</li>
      <li><kbd className="px-2 py-1 bg-white rounded border">L</kbd> 直线</li>
      <li><kbd className="px-2 py-1 bg-white rounded border">Esc</kbd> 退出绘制</li>
    </ul>
  </div>
</div>
```

---

## 🎯 Part 3: 导出设置弹窗

### 3.1 功能说明

**用户故事验收标准**（US-105 场景2）：
- [ ] 用户点击顶部工具栏"下载"按钮
- [ ] 系统弹出下载选项对话框
- [ ] 用户可以选择图片质量（1x、2x、3x）
- [ ] 用户可以选择背景透明（是/否）
- [ ] 点击"下载"后，文件自动保存到默认下载目录
- [ ] 文件名格式：cover-{YYYYMMDD-HHMMSS}.png

**实现方案**：
- 创建 ExportDialog 组件（模态弹窗）
- 支持质量选择（1x/2x/3x 倍率）
- 支持透明背景选项（仅 PNG）
- 支持格式选择（PNG/JPEG）
- 修改 Toolbar 的导出按钮触发弹窗
- 修改导出逻辑支持倍率和透明背景

---

### 3.2 修改文件清单

1. 新建 `apps/web/src/components/editor/ExportDialog.tsx` - 导出设置弹窗组件
2. 修改 `apps/web/src/components/editor/Toolbar/Toolbar.tsx` - 添加弹窗触发
3. 修改 `apps/web/src/app/editor/page.tsx` - 处理导出逻辑
4. 修改 `apps/web/src/lib/fabric/canvas.ts` - 支持导出选项

---

### 3.3 详细修改指令

#### 新建文件: `apps/web/src/components/editor/ExportDialog.tsx`

**完整内容**：

```tsx
'use client'

import { useState } from 'react'

export interface ExportOptions {
  format: 'png' | 'jpeg'
  quality: 1 | 2 | 3
  transparent: boolean
}

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  onExport: (options: ExportOptions) => void
}

export function ExportDialog({ isOpen, onClose, onExport }: ExportDialogProps) {
  const [format, setFormat] = useState<'png' | 'jpeg'>('png')
  const [quality, setQuality] = useState<1 | 2 | 3>(1)
  const [transparent, setTransparent] = useState(false)

  if (!isOpen) return null

  const handleExport = () => {
    onExport({ format, quality, transparent })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h2 className="text-xl font-bold mb-4">导出设置</h2>

        {/* 格式选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">导出格式</label>
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('png')}
              className={`flex-1 px-4 py-2 rounded ${
                format === 'png'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              PNG
            </button>
            <button
              onClick={() => setFormat('jpeg')}
              className={`flex-1 px-4 py-2 rounded ${
                format === 'jpeg'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              JPEG
            </button>
          </div>
        </div>

        {/* 质量选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">导出质量</label>
          <div className="flex gap-2">
            {[1, 2, 3].map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q as 1 | 2 | 3)}
                className={`flex-1 px-4 py-2 rounded ${
                  quality === q
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {q}x
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {quality === 1 && '标准质量（适合网页）'}
            {quality === 2 && '高质量（适合打印）'}
            {quality === 3 && '超高质量（适合专业用途）'}
          </p>
        </div>

        {/* 透明背景选项（仅 PNG） */}
        {format === 'png' && (
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={transparent}
                onChange={(e) => setTransparent(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium">透明背景</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              导出时移除画布背景色
            </p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            取消
          </button>
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            导出
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

#### 修改文件 1: `apps/web/src/lib/fabric/canvas.ts`

**在文件末尾新增导出函数**（在 panCanvas 之后）：

```typescript
/**
 * 导出画布为图片（支持倍率和透明背景）
 * @param canvas Fabric.js Canvas 实例
 * @param options 导出选项
 * @returns DataURL 字符串
 */
export function exportCanvasImage(
  canvas: fabric.Canvas | null,
  options: {
    format?: 'png' | 'jpeg'
    quality?: number // 1x, 2x, 3x
    transparent?: boolean
  } = {}
): string | null {
  if (!canvas) {
    logger.warn('Canvas is not initialized')
    return null
  }

  const { format = 'png', quality = 1, transparent = false } = options

  // 保存原始背景色
  const originalBgColor = canvas.backgroundColor

  // 如果需要透明背景，临时移除背景色
  if (transparent && format === 'png') {
    canvas.backgroundColor = ''
  }

  // 导出图片
  const dataURL = canvas.toDataURL({
    format: format === 'jpeg' ? 'jpeg' : 'png',
    quality: 1, // Fabric.js 的 quality 参数（0-1）
    multiplier: quality, // 倍率
  })

  // 恢复原始背景色
  if (transparent && format === 'png') {
    canvas.backgroundColor = originalBgColor
    canvas.requestRenderAll()
  }

  return dataURL
}

/**
 * 下载画布为图片文件
 * @param canvas Fabric.js Canvas 实例
 * @param options 导出选项
 */
export function downloadCanvasImage(
  canvas: fabric.Canvas | null,
  options: {
    format?: 'png' | 'jpeg'
    quality?: number
    transparent?: boolean
    filename?: string
  } = {}
) {
  const dataURL = exportCanvasImage(canvas, options)
  if (!dataURL) return

  const { format = 'png', filename } = options

  // 生成文件名：cover-YYYYMMDD-HHMMSS.png
  const now = new Date()
  const timestamp = now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '-')
    .slice(0, 15)
  const defaultFilename = `cover-${timestamp}.${format}`

  // 创建下载链接
  const link = document.createElement('a')
  link.download = filename || defaultFilename
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
```

---

#### 修改文件 2: `apps/web/src/components/editor/Toolbar/Toolbar.tsx`

**位置与改动**：

1. **修改导出按钮**（L47-63）：

将现有的三个导出按钮改为：
- "复制图片"按钮保持不变
- "下载 PNG" 和 "下载 JPEG" 合并为一个"导出"按钮，触发弹窗

```tsx
// 旧代码（L47-63）
<button
  onClick={onExportPNG}
  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
>
  下载 PNG
</button>
<button
  onClick={onExportJPEG}
  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
>
  下载 JPEG
</button>
<button
  onClick={onCopyImage}
  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
>
  复制图片
</button>

// 新代码
<button
  onClick={onOpenExportDialog}  // ← 新增 prop
  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
>
  导出
</button>
<button
  onClick={onCopyImage}
  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
>
  复制图片
</button>
```

2. **修改 Props 接口**（L5-13）：

```tsx
// 旧代码
interface ToolbarProps {
  currentSize: string
  currentBackground: string
  onSizeChange: (size: string) => void
  onBackgroundChange: (color: string) => void
  onExportPNG: () => void
  onExportJPEG: () => void
  onCopyImage: () => void
}

// 新代码
interface ToolbarProps {
  currentSize: string
  currentBackground: string
  onSizeChange: (size: string) => void
  onBackgroundChange: (color: string) => void
  onOpenExportDialog: () => void  // ← 替换 onExportPNG 和 onExportJPEG
  onCopyImage: () => void
}
```

3. **修改函数签名**（L15）：

```tsx
// 旧代码
export function Toolbar({
  currentSize,
  currentBackground,
  onSizeChange,
  onBackgroundChange,
  onExportPNG,
  onExportJPEG,
  onCopyImage,
}: ToolbarProps) {

// 新代码
export function Toolbar({
  currentSize,
  currentBackground,
  onSizeChange,
  onBackgroundChange,
  onOpenExportDialog,  // ← 替换
  onCopyImage,
}: ToolbarProps) {
```

---

#### 修改文件 3: `apps/web/src/app/editor/page.tsx`

**位置与改动**：

1. **顶部新增导入**（L3 附近）：
```tsx
import { ExportDialog, ExportOptions } from '@/components/editor/ExportDialog'
import { downloadCanvasImage } from '@/lib/fabric/canvas'
```

2. **新增弹窗状态**（L24 附近）：
```tsx
const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
```

3. **新增导出处理函数**（在 handleCopyImage 之后）：

```tsx
const handleExport = (options: ExportOptions) => {
  if (!canvasInstance) {
    toast.error('画布未初始化')
    return
  }

  try {
    downloadCanvasImage(canvasInstance, {
      format: options.format,
      quality: options.quality,
      transparent: options.transparent,
    })
    toast.success('导出成功')
  } catch (error) {
    toast.error('导出失败，请重试')
  }
}
```

4. **修改 Toolbar 组件调用**（L200 附近）：

```tsx
// 旧代码
<Toolbar
  currentSize={canvasSize}
  currentBackground={backgroundColor}
  onSizeChange={handleSizeChange}
  onBackgroundChange={handleBackgroundChange}
  onExportPNG={handleExportPNG}
  onExportJPEG={handleExportJPEG}
  onCopyImage={handleCopyImage}
/>

// 新代码
<Toolbar
  currentSize={canvasSize}
  currentBackground={backgroundColor}
  onSizeChange={handleSizeChange}
  onBackgroundChange={handleBackgroundChange}
  onOpenExportDialog={() => setIsExportDialogOpen(true)}  // ← 修改
  onCopyImage={handleCopyImage}
/>
```

5. **在 return 中新增 ExportDialog**（在 Toolbar 之后）：

```tsx
<Toolbar
  currentSize={canvasSize}
  currentBackground={backgroundColor}
  onSizeChange={handleSizeChange}
  onBackgroundChange={handleBackgroundChange}
  onOpenExportDialog={() => setIsExportDialogOpen(true)}
  onCopyImage={handleCopyImage}
/>

{/* 新增：导出设置弹窗 */}
<ExportDialog
  isOpen={isExportDialogOpen}
  onClose={() => setIsExportDialogOpen(false)}
  onExport={handleExport}
/>
```

6. **删除旧的导出函数**（handleExportPNG 和 handleExportJPEG）：

找到并删除以下两个函数（约 L120-140）：
```tsx
const handleExportPNG = async () => {
  // ... 删除整个函数
}

const handleExportJPEG = async () => {
  // ... 删除整个函数
}
```

---

## ✅ 验收清单（阶段 2）

### Part 0: 阶段1余留问题修复

- [ ] apps/web/src/app/editor/page.tsx 中 4 处 console.error 已删除
- [ ] apps/web/src/hooks/useCanvas.ts 中 2 处 console.error 已替换为 logger
- [ ] apps/web/jest.setup.js 已创建并配置 canvas mock
- [ ] apps/web/jest.config.js 已添加 setupFilesAfterEnv 配置
- [ ] 运行 `npm test` 无 canvas getContext 相关错误

---

### Part 1: 画布视图缩放/拖拽/重置

**功能验收**：
- [ ] 鼠标滚轮可缩放画布视图（以鼠标位置为中心）
- [ ] 按住空格键可拖拽画布视图
- [ ] 按 Ctrl+0 可重置画布视图到 100% 缩放、居中位置
- [ ] 缩放范围限制在 0.1x - 5x
- [ ] 缩放/拖拽过程流畅，无卡顿

**代码验收**：
- [ ] apps/web/src/lib/fabric/canvas.ts 新增 setCanvasZoom、resetCanvasView、panCanvas 函数
- [ ] apps/web/src/components/editor/Canvas/Canvas.tsx 添加鼠标滚轮和拖拽事件监听
- [ ] apps/web/src/app/editor/page.tsx 添加 Ctrl+0 快捷键监听
- [ ] 所有新增代码使用 logger 而非 console

---

### Part 2: 形状拖拽绘制交互

**功能验收**：
- [ ] 按 R 键进入矩形绘制模式，显示提示
- [ ] 按 O 键进入圆形绘制模式，显示提示
- [ ] 按 L 键进入直线绘制模式，显示提示
- [ ] 在画布上拖拽可实时预览形状（半透明蓝色）
- [ ] 释放鼠标后形状固定，使用默认样式
- [ ] 按 Esc 键可退出绘制模式
- [ ] 绘制过程中画布其他对象不可选中

**代码验收**：
- [ ] apps/web/src/lib/fabric/shape.ts 新增 startDragDrawShape、updateDragDrawShape、finishDragDrawShape 函数
- [ ] apps/web/src/app/editor/page.tsx 添加绘制模式状态和事件监听
- [ ] apps/web/src/components/editor/AssetPanel/ShapeTab.tsx 添加快捷键提示
- [ ] 绘制模式与现有点击添加形状功能不冲突

---

### Part 3: 导出设置弹窗

**功能验收**：
- [ ] 点击 Toolbar "导出"按钮弹出设置对话框
- [ ] 可选择导出格式（PNG/JPEG）
- [ ] 可选择导出质量（1x/2x/3x）
- [ ] PNG 格式可选择透明背景
- [ ] 点击"导出"后文件自动下载
- [ ] 文件名格式为 cover-YYYYMMDD-HHMMSS.{format}
- [ ] 导出的图片质量符合选择的倍率
- [ ] 透明背景导出正确（PNG 格式）

**代码验收**：
- [ ] apps/web/src/components/editor/ExportDialog.tsx 已创建
- [ ] apps/web/src/lib/fabric/canvas.ts 新增 exportCanvasImage、downloadCanvasImage 函数
- [ ] apps/web/src/components/editor/Toolbar/Toolbar.tsx 修改为单个"导出"按钮
- [ ] apps/web/src/app/editor/page.tsx 删除旧的 handleExportPNG/JPEG，新增 handleExport
- [ ] 导出过程有成功/失败提示（Toast）

---

## 🧪 测试建议

### 单元测试

**新增测试文件**：

1. `apps/web/tests/lib/fabric/canvas-view.test.ts` - 测试视图操作函数
```typescript
import { setCanvasZoom, resetCanvasView, panCanvas } from '@/lib/fabric/canvas'

describe('Canvas View Operations', () => {
  it('should set canvas zoom', () => {
    // 测试 setCanvasZoom
  })

  it('should reset canvas view', () => {
    // 测试 resetCanvasView
  })

  it('should pan canvas', () => {
    // 测试 panCanvas
  })

  it('should clamp zoom to 0.1x - 5x', () => {
    // 测试缩放范围限制
  })
})
```

2. `apps/web/tests/lib/fabric/shape-draw.test.ts` - 测试拖拽绘制函数
```typescript
import { startDragDrawShape, updateDragDrawShape, finishDragDrawShape } from '@/lib/fabric/shape'

describe('Shape Drag Drawing', () => {
  it('should start drag draw rectangle', () => {
    // 测试开始绘制矩形
  })

  it('should update drag draw shape', () => {
    // 测试更新绘制中的形状
  })

  it('should finish drag draw and create final shape', () => {
    // 测试完成绘制并创建最终形状
  })
})
```

3. `apps/web/tests/lib/fabric/export.test.ts` - 测试导出函数
```typescript
import { exportCanvasImage, downloadCanvasImage } from '@/lib/fabric/canvas'

describe('Canvas Export', () => {
  it('should export canvas as PNG', () => {
    // 测试导出 PNG
  })

  it('should export canvas with transparent background', () => {
    // 测试透明背景导出
  })

  it('should export canvas with quality multiplier', () => {
    // 测试倍率导出
  })
})
```

---

### 集成测试

**修改现有测试**：`apps/web/tests/integration/editor-workflow.test.tsx`

新增测试场景：

```typescript
describe('Canvas View Operations', () => {
  it('should zoom canvas with mouse wheel', () => {
    // 模拟鼠标滚轮事件
  })

  it('should pan canvas with space key', () => {
    // 模拟空格键 + 拖拽
  })

  it('should reset view with Ctrl+0', () => {
    // 模拟 Ctrl+0 快捷键
  })
})

describe('Shape Drag Drawing', () => {
  it('should draw rectangle with R key and drag', () => {
    // 模拟 R 键 + 拖拽
  })

  it('should exit draw mode with Esc', () => {
    // 模拟 Esc 键
  })
})

describe('Export Dialog', () => {
  it('should open export dialog', () => {
    // 点击导出按钮，验证弹窗打开
  })

  it('should export with selected options', () => {
    // 选择选项并导出
  })
})
```

---

### 手动测试清单

**画布视图操作**：
- [ ] 滚动鼠标滚轮，画布缩放流畅
- [ ] 按住空格键拖拽，画布平移流畅
- [ ] 按 Ctrl+0，画布重置到初始状态
- [ ] 缩放到极限值（0.1x 和 5x）时不再继续缩放

**形状拖拽绘制**：
- [ ] 按 R 键，显示"矩形绘制模式"提示
- [ ] 在画布上拖拽，实时显示半透明矩形
- [ ] 释放鼠标，矩形固定并变为默认样式
- [ ] 同样测试圆形（O键）和直线（L键）
- [ ] 按 Esc 键，退出绘制模式

**导出设置弹窗**：
- [ ] 点击"导出"按钮，弹窗打开
- [ ] 切换格式（PNG/JPEG），UI 正确响应
- [ ] 选择质量（1x/2x/3x），提示文字正确
- [ ] PNG 格式下勾选"透明背景"，导出的图片背景透明
- [ ] JPEG 格式下无"透明背景"选项
- [ ] 点击"导出"，文件自动下载，文件名格式正确
- [ ] 点击"取消"，弹窗关闭

---

## 📊 工时与里程碑

### 开发计划

| 任务 | 预计工时 | 依赖 |
|------|---------|------|
| Part 0: 阶段1余留修复 | 0.5 天 | 无 |
| Part 1: 画布视图操作 | 1.5 天 | Part 0 |
| Part 2: 形状拖拽绘制 | 0.75 天 | Part 0 |
| Part 3: 导出设置弹窗 | 0.75 天 | Part 0 |
| 单元测试编写 | 0.5 天 | Part 1-3 |
| 集成测试更新 | 0.5 天 | Part 1-3 |
| 手动测试与修复 | 0.5 天 | 全部 |
| **总计** | **5 天** | |

---

### 提交建议

**原子提交策略**（每个提交对应一个最小功能点）：

1. `fix: 替换剩余 console.error 为 logger`
2. `test: 添加 canvas mock 修复测试失败`
3. `feat: 添加画布缩放功能（鼠标滚轮）`
4. `feat: 添加画布拖拽功能（空格键）`
5. `feat: 添加画布视图重置快捷键（Ctrl+0）`
6. `feat: 添加形状拖拽绘制基础函数`
7. `feat: 添加形状绘制模式快捷键（R/O/L）`
8. `feat: 添加形状拖拽绘制交互`
9. `feat: 创建导出设置弹窗组件`
10. `feat: 集成导出设置弹窗到编辑器`
11. `test: 添加视图操作单元测试`
12. `test: 添加形状绘制单元测试`
13. `test: 添加导出功能单元测试`
14. `test: 更新集成测试覆盖新功能`

---

## 🎯 下一步（阶段 3 预告）

阶段 2 完成后，将进入**阶段 3：测试与兼容性**，包括：

1. **提高测试覆盖率**（目标 ≥ 60%）
   - 补充边界情况测试
   - 补充错误处理测试
   - 补充用户交互测试

2. **跨浏览器兼容性**
   - Safari 下复制/下载功能降级
   - Firefox 下 Clipboard API 兼容性
   - 移动端触摸事件支持（可选）

3. **性能优化**
   - 懒加载字体资源
   - 代码分割（动态导入）
   - 图片压缩优化

4. **用户体验优化**
   - 加载状态提示
   - 操作引导（首次使用）
   - 键盘快捷键帮助面板

---

## 📝 总结

阶段 2 改进计划已完成，包含：

✅ **4 个核心功能**：
- 阶段1余留问题修复
- 画布视图缩放/拖拽/重置
- 形状拖拽绘制交互
- 导出设置弹窗

✅ **详细修改指令**：
- 逐文件、逐行的修改说明
- 完整的代码示例
- 清晰的验收标准

✅ **测试策略**：
- 单元测试建议
- 集成测试建议
- 手动测试清单

✅ **开发规范**：
- 原子提交策略
- 工时估算
- 依赖关系

**下一步行动**：
1. 将本计划交给 Claude Code 执行
2. 按照原子提交策略逐步推进
3. 每完成一个功能点立即测试验证
4. 完成后进入阶段 3

---

**文档版本**：v1.0
**创建时间**：2025-07-XX
**作者**：GPT-5 (Augment Agent)
**状态**：待执行


