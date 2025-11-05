# Claude Code 执行指令 - 阶段3B：测试覆盖

你好 Claude Code，请按照以下计划执行"阶段 3B 测试覆盖"开发任务：

## 📄 任务文档
详细的改进计划已写入：`improve-plan/plan3.md`（1377 行）

本次执行范围：**Part 3**（测试覆盖）

## 🎯 本次目标

**工作量**：1.5 天  
**优先级**：⭐⭐ 中（建议做）  
**风险等级**：中（新增测试，可能需要调整）

**核心目标**：
- ✅ 为阶段2新功能添加测试覆盖
- ✅ 新增 30+ 个测试用例
- ✅ 测试总数从 85 提升到 115+
- ✅ 保持 100% 通过率

**前置条件**：
- ✅ Plan3A 已完成
- ✅ 当前测试通过率：85/85 (100%)
- ✅ 生产构建成功

---

## 📋 Part 3: 为阶段2新功能添加测试

### 任务清单

#### 3.1 新建 canvas-view.test.ts
**文件**：`apps/web/tests/lib/fabric/canvas-view.test.ts`（新建）

**测试内容**：
- `setCanvasZoom` 函数（5个测试）
- `resetCanvasView` 函数（2个测试）
- `panCanvas` 函数（2个测试）

**完整代码**（参考 plan3.md L467-551）：

```typescript
import { setCanvasZoom, resetCanvasView, panCanvas } from '@/lib/fabric/canvas'

describe('canvas view operations', () => {
  const mockCanvas = {
    setZoom: jest.fn(),
    setViewportTransform: jest.fn(),
    getZoom: jest.fn().mockReturnValue(1),
    getWidth: jest.fn().mockReturnValue(1080),
    getHeight: jest.fn().mockReturnValue(1440),
    renderAll: jest.fn(),
    viewportTransform: [1, 0, 0, 1, 0, 0],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockCanvas.viewportTransform = [1, 0, 0, 1, 0, 0]
  })

  describe('setCanvasZoom', () => {
    it('should set zoom level', () => {
      setCanvasZoom(mockCanvas as any, 1.5)
      
      expect(mockCanvas.setZoom).toHaveBeenCalledWith(1.5)
      expect(mockCanvas.renderAll).toHaveBeenCalled()
    })

    it('should clamp zoom to min 0.1', () => {
      setCanvasZoom(mockCanvas as any, 0.05)
      
      expect(mockCanvas.setZoom).toHaveBeenCalledWith(0.1)
    })

    it('should clamp zoom to max 5', () => {
      setCanvasZoom(mockCanvas as any, 10)
      
      expect(mockCanvas.setZoom).toHaveBeenCalledWith(5)
    })

    it('should zoom to specific point', () => {
      setCanvasZoom(mockCanvas as any, 2, { x: 100, y: 100 })
      
      expect(mockCanvas.setZoom).toHaveBeenCalled()
      expect(mockCanvas.setViewportTransform).toHaveBeenCalled()
    })

    it('should handle null canvas', () => {
      expect(() => setCanvasZoom(null, 1.5)).not.toThrow()
    })
  })

  describe('resetCanvasView', () => {
    it('should reset zoom to 1 and center viewport', () => {
      resetCanvasView(mockCanvas as any)
      
      expect(mockCanvas.setZoom).toHaveBeenCalledWith(1)
      expect(mockCanvas.setViewportTransform).toHaveBeenCalledWith([1, 0, 0, 1, 0, 0])
      expect(mockCanvas.renderAll).toHaveBeenCalled()
    })

    it('should handle null canvas', () => {
      expect(() => resetCanvasView(null)).not.toThrow()
    })
  })

  describe('panCanvas', () => {
    it('should pan canvas by delta', () => {
      panCanvas(mockCanvas as any, 50, 30)
      
      expect(mockCanvas.setViewportTransform).toHaveBeenCalled()
      expect(mockCanvas.renderAll).toHaveBeenCalled()
      
      const transform = mockCanvas.setViewportTransform.mock.calls[0][0]
      expect(transform[4]).toBe(50) // deltaX
      expect(transform[5]).toBe(30) // deltaY
    })

    it('should handle null canvas', () => {
      expect(() => panCanvas(null, 10, 10)).not.toThrow()
    })
  })
})
```

**说明**：
- 测试画布缩放功能（包括边界值 0.1 和 5）
- 测试画布重置功能
- 测试画布拖拽功能
- 测试空值处理

---

#### 3.2 新建 shape-drag-draw.test.ts
**文件**：`apps/web/tests/lib/fabric/shape-drag-draw.test.ts`（新建）

**测试内容**：
- `startDragDrawShape` 函数（3个测试）
- `updateDragDrawShape` 函数（1个测试）
- `finishDragDrawShape` 函数（1个测试）

**完整代码**（参考 plan3.md L559-651）：

```typescript
import {
  startDragDrawShape,
  updateDragDrawShape,
  finishDragDrawShape,
} from '@/lib/fabric/shape'

describe('shape drag-to-draw', () => {
  const mockCanvas = {
    add: jest.fn(),
    remove: jest.fn(),
    setActiveObject: jest.fn(),
    renderAll: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('startDragDrawShape', () => {
    it('should create temporary rectangle', () => {
      const shape = startDragDrawShape(
        mockCanvas as any,
        'rectangle',
        { x: 100, y: 100 }
      )
      
      expect(mockCanvas.add).toHaveBeenCalled()
      expect(mockCanvas.renderAll).toHaveBeenCalled()
      expect(shape).toBeTruthy()
      expect(shape?.type).toBe('rect')
    })

    it('should create temporary circle', () => {
      const shape = startDragDrawShape(
        mockCanvas as any,
        'circle',
        { x: 100, y: 100 }
      )
      
      expect(shape?.type).toBe('circle')
    })

    it('should create temporary line', () => {
      const shape = startDragDrawShape(
        mockCanvas as any,
        'line',
        { x: 100, y: 100 }
      )
      
      expect(shape?.type).toBe('line')
    })
  })

  describe('updateDragDrawShape', () => {
    it('should update rectangle dimensions', () => {
      const mockRect = {
        type: 'rect',
        set: jest.fn(),
        setCoords: jest.fn(),
        canvas: mockCanvas,
      }

      updateDragDrawShape(
        mockRect as any,
        'rectangle',
        { x: 100, y: 100 },
        { x: 200, y: 200 }
      )

      expect(mockRect.set).toHaveBeenCalled()
      expect(mockRect.setCoords).toHaveBeenCalled()
      expect(mockCanvas.renderAll).toHaveBeenCalled()
    })
  })

  describe('finishDragDrawShape', () => {
    it('should finalize shape and make it selectable', () => {
      const mockShape = {
        set: jest.fn(),
        setCoords: jest.fn(),
        canvas: mockCanvas,
      }

      finishDragDrawShape(mockCanvas as any, mockShape as any, 'rectangle')

      expect(mockShape.set).toHaveBeenCalledWith({
        opacity: 1,
        selectable: true,
      })
      expect(mockCanvas.setActiveObject).toHaveBeenCalledWith(mockShape)
      expect(mockCanvas.renderAll).toHaveBeenCalled()
    })
  })
})
```

**说明**：
- 测试拖拽绘制矩形、圆形、直线
- 测试拖拽过程中的实时更新
- 测试完成绘制后的状态变化

---

#### 3.3 新建 ExportDialog.test.tsx
**文件**：`apps/web/tests/components/ExportDialog.test.tsx`（新建）

**测试内容**：
- 组件渲染（2个测试）
- 格式选择（1个测试）
- 质量选择（1个测试）
- 透明背景（1个测试）
- 导出按钮（2个测试）

**完整代码**（参考 plan3.md L659-780）：

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ExportDialog, ExportOptions } from '@/components/editor/ExportDialog'

describe('ExportDialog', () => {
  const mockOnClose = jest.fn()
  const mockOnExport = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not render when closed', () => {
    render(
      <ExportDialog
        isOpen={false}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    )

    expect(screen.queryByText('导出设置')).not.toBeInTheDocument()
  })

  it('should render when open', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    )

    expect(screen.getByText('导出设置')).toBeInTheDocument()
    expect(screen.getByText('PNG')).toBeInTheDocument()
    expect(screen.getByText('JPEG')).toBeInTheDocument()
  })

  it('should select format', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    )

    const jpegButton = screen.getByText('JPEG')
    fireEvent.click(jpegButton)

    expect(jpegButton).toHaveClass('bg-blue-500')
  })

  it('should select quality', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    )

    const quality2x = screen.getByText('2x')
    fireEvent.click(quality2x)

    expect(quality2x).toHaveClass('bg-blue-500')
  })

  it('should toggle transparent background', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(checkbox).toBeChecked()
  })

  it('should call onExport with correct options', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    )

    // 选择 JPEG, 2x, 不透明
    fireEvent.click(screen.getByText('JPEG'))
    fireEvent.click(screen.getByText('2x'))

    const exportButton = screen.getByText('下载')
    fireEvent.click(exportButton)

    expect(mockOnExport).toHaveBeenCalledWith({
      format: 'jpeg',
      quality: 2,
      transparent: false,
    })
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should call onClose when cancel clicked', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    )

    const cancelButton = screen.getByText('取消')
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
    expect(mockOnExport).not.toHaveBeenCalled()
  })
})
```

**说明**：
- 测试弹窗的打开/关闭状态
- 测试格式选择交互（PNG/JPEG）
- 测试质量选择交互（1x/2x/3x）
- 测试透明背景选项
- 测试导出和取消按钮

---

### 验收标准
- [ ] 新增 3 个测试文件
- [ ] canvas-view.test.ts：9 个测试
- [ ] shape-drag-draw.test.ts：5 个测试
- [ ] ExportDialog.test.tsx：7 个测试
- [ ] 总测试数：115+ (85 + 30)
- [ ] 通过率：100%
- [ ] 所有新测试都通过
- [ ] 旧测试仍然通过

### Git 提交
```
test: 为阶段2新功能添加测试覆盖

- 新增 canvas-view.test.ts（画布缩放/拖拽/重置）
- 新增 shape-drag-draw.test.ts（形状拖拽绘制）
- 新增 ExportDialog.test.tsx（导出设置弹窗）
- 新增 30+ 个测试用例
- 测试覆盖率提升至 100%
```

---

## ✅ 完成后必须执行

### 1. 运行测试
```bash
npm test
```
- 确保所有测试通过（115/115）
- 新测试和旧测试都应该通过

### 2. 检查测试覆盖率
```bash
npm test -- --coverage
```
- 查看覆盖率报告

### 3. 运行 Lint
```bash
npm run lint
```
- 确保无 ESLint 错误

### 4. Git 提交
- 一次性提交 3 个新测试文件
- 使用上面的提交信息

---

## ⚠️ 重要注意事项

1. **确保 Plan3A 已完成**：当前测试应该是 85/85 通过
2. **新建文件，不修改现有代码**：本次只新增测试，不修改源代码
3. **测试应该独立运行**：每个测试文件都应该能独立通过
4. **遇到问题立即反馈**：
   - 如果测试失败，检查是否是源代码问题
   - 如果是源代码问题，先修复源代码再继续
5. **详细阅读 plan3.md**：所有代码示例都在文档中，可直接复制使用
6. **本次只执行 Part 3**：不要继续执行 Part 4-5，等待下一批指令

---

## 📊 预期结果

完成后应达到：
- ✅ 新增 3 个测试文件
- ✅ 测试总数：115+ (85 + 30)
- ✅ 测试通过率：100%
- ✅ 覆盖阶段2所有新功能
- ✅ 1 个原子提交

---

## 🚀 开始执行

请按以下顺序执行：

**执行步骤**：
1. 创建 `canvas-view.test.ts`
2. 运行测试，确保通过
3. 创建 `shape-drag-draw.test.ts`
4. 运行测试，确保通过
5. 创建 `ExportDialog.test.tsx`
6. 运行测试，确保通过
7. 运行完整测试套件（应该 115/115）
8. 提交所有新测试文件
9. 向我汇报完成情况

**完成后请汇报**：
- 测试总数（应该是 115+）
- 测试通过率（应该是 100%）
- 每个新测试文件的测试数量
- 遇到的问题（如有）

如有任何疑问，随时询问。加油！💪
