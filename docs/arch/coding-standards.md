# 编码规范 (Coding Standards)

## 1. 代码风格

### 1.1 通用规范

**文件编码**: UTF-8
**行尾符**: LF
**缩进**: 2 个空格
**最大行长度**: 100 字符

### 1.2 命名规范

**文件名**: 使用 kebab-case
```typescript
// 正确
user-profile.tsx
canvas-editor.ts
api-client.ts

// 错误
userProfile.tsx
CanvasEditor.ts
APIClient.ts
```

**组件名**: 使用 PascalCase
```typescript
// 正确
export const CanvasEditor = () => { }

// 错误
export const canvasEditor = () => { }
```

**函数名**: 使用 camelCase
```typescript
// 正确
const getUserProfile = () => { }
const handleCanvasChange = () => { }

// 错误
const GetUserProfile = () => { }
const HandleCanvasChange = () => { }
```

**变量名**: 使用 camelCase
```typescript
// 正确
const userName = 'John'
const isLoading = true
const canvasObjects = []

// 错误
const UserName = 'John'
const IS_LOADING = true
const canvas_objects = []
```

**常量**: 使用 UPPER_SNAKE_CASE
```typescript
// 正确
const API_BASE_URL = 'https://api.example.com'
const MAX_CANVAS_SIZE = 1000

// 错误
const apiBaseUrl = 'https://api.example.com'
const maxCanvasSize = 1000
```

---

## 2. TypeScript 规范

### 2.1 类型定义

**接口**: 使用 PascalCase，以 I 开头（可选）
```typescript
// 方式 1: 使用 I 前缀
interface IUser {
  id: string
  name: string
  email: string
}

// 方式 2: 不使用前缀
interface User {
  id: string
  name: string
  email: string
}

// 统一选择一种方式，建议方式 2
```

**类型别名**: 使用 PascalCase
```type
type CanvasSize = {
  width: number
  height: number
}

type UserID = string
```

### 2.2 导入导出

**导入顺序**:
1. 外部库导入
2. 内部模块导入
3. 相对路径导入

```typescript
// 正确
import React from 'react'
import { fabric } from 'fabric'

import { useCanvasStore } from '@/stores/canvas'
import { User } from '@/types/user'

import { Button } from './Button'
import { Canvas } from './Canvas'
```

**导出**:
```typescript
// 命名导出（推荐）
export const Component = () => { }
export type { User }
export { helperFunction }

// 默认导出（谨慎使用）
export default Component
```

### 2.3 泛型

```typescript
// 正确
interface ApiResponse<T> {
  data: T
  status: number
}

const useApi = <T>(url: string) => {
  // 实现
}

// 错误
interface ApiResponse<TData> {
  data: TData
  status: number
}
```

---

## 3. React 规范

### 3.1 组件结构

**函数组件**:
```typescript
import React from 'react'

interface Props {
  title: string
  onSubmit: () => void
}

export const Form: React.FC<Props> = ({ title, onSubmit }) => {
  const handleSubmit = () => {
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>{title}</h1>
    </form>
  )
}
```

### 3.2 Hooks 使用

**自定义 Hooks**:
```typescript
// 以 use 开头
export const useCanvas = () => {
  const [objects, setObjects] = useState([])
  const addObject = (obj: any) => {
    setObjects(prev => [...prev, obj])
  }

  return {
    objects,
    addObject
  }
}
```

**useState**:
```typescript
// 正确
const [count, setCount] = useState<number>(0)
const [user, setUser] = useState<User | null>(null)

// 错误
const [count, setCount] = useState(0) // 缺少类型标注
const [user, setUser] = useState(null) // 类型不明确
```

**useEffect**:
```typescript
// 正确
useEffect(() => {
  const fetchData = async () => {
    // 获取数据
  }
  fetchData()
}, []) // 空依赖数组表示仅在组件挂载时执行

// 错误
useEffect(() => {
  // 副作用逻辑
}) // 缺少依赖数组

useEffect(() => {
  // 副作用逻辑
}, [dependency]) // 需要在依赖变化时重新执行
```

### 3.3 JSX 规范

**自闭合标签**:
```typescript
// 正确
<input type="text" />
<img src="image.jpg" alt="Description" />

// 错误
<input type="text"></input>
<img src="image.jpg" alt="Description"></img>
```

**className vs class**:
```typescript
// 正确
<div className="container">

// 错误
<div class="container">
```

---

## 4. Tailwind CSS 规范

### 4.1 基础类名

**响应式设计**:
```typescript
// 移动端优先
<div className="text-sm md:text-base lg:text-lg">

// 正确
<div className="w-full md:w-1/2 lg:w-1/3">
```

### 4.2 组合类名顺序

建议顺序：
1. 布局 (layout)
2. 定位 (positioning)
3. 盒子模型 (box model)
4. 排版 (typography)
5. 颜色 (colors)
6. 其他

```typescript
// 正确
<div className="relative w-full p-4 text-center text-white bg-blue-500">

// 错误
<div className="bg-blue-500 p-4 white text-center relative w-full text-white">
```

### 4.3 自定义样式

**使用 Tailwind 的 @apply 指令**:
```css
/* 在组件样式文件中 */
.btn-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600;
}
```

---

## 5. Fabric.js 集成规范

### 5.1 Canvas 初始化

```typescript
// 正确
import { fabric } from 'fabric'

export const useFabricCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvas = useRef<fabric.Canvas | null>(null)

  useEffect(() => {
    if (canvasRef.current && !canvas.current) {
      canvas.current = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff'
      })
    }

    return () => {
      canvas.current?.dispose()
    }
  }, [])

  return { canvas: canvas.current, canvasRef }
}
```

### 5.2 对象操作

```typescript
// 添加对象
const addText = (canvas: fabric.Canvas) => {
  const text = new fabric.Text('Hello', {
    left: 100,
    top: 100,
    fontSize: 20,
    fill: '#000000'
  })
  canvas.add(text)
  canvas.renderAll()
}

// 删除对象
const deleteSelected = (canvas: fabric.Canvas) => {
  const activeObject = canvas.getActiveObject()
  if (activeObject) {
    canvas.remove(activeObject)
    canvas.renderAll()
  }
}
```

---

## 6. API 调用规范

### 6.1 错误处理

```typescript
// 正确
const fetchData = async (): Promise<User> => {
  try {
    const response = await fetch('/api/users')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw error
  }
}

// 使用
try {
  const user = await fetchData()
  // 处理成功情况
} catch (error) {
  // 处理错误情况
  showErrorMessage('Failed to load user')
}
```

### 6.2 类型安全

```typescript
// 正确
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

const useApiCall = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const call = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(url)
      const result: ApiResponse<T> = await response.json()
      setData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [url])

  return { data, loading, error, call }
}
```

---

## 7. 状态管理规范

### 7.1 Zustand Store

```typescript
// 正确
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface CanvasState {
  objects: fabric.Object[]
  selectedObject: fabric.Object | null
  addObject: (obj: fabric.Object) => void
  removeObject: (id: string) => void
  setSelectedObject: (obj: fabric.Object | null) => void
}

export const useCanvasStore = create<CanvasState>()(
  devtools(
    (set) => ({
      objects: [],
      selectedObject: null,
      addObject: (obj) =>
        set((state) => ({
          objects: [...state.objects, obj]
        })),
      removeObject: (id) =>
        set((state) => ({
          objects: state.objects.filter((obj) => obj.id !== id)
        })),
      setSelectedObject: (obj) => set({ selectedObject: obj })
    }),
    {
      name: 'canvas-store'
    }
  )
)
```

---

## 8. 注释规范

### 8.1 函数注释

```typescript
/**
 * 添加文本对象到画布
 * @param canvas - Fabric.js 画布实例
 * @param text - 文本内容
 * @param position - 文本位置坐标
 * @returns 创建的文本对象
 */
export const addTextToCanvas = (
  canvas: fabric.Canvas,
  text: string,
  position: { x: number; y: number }
): fabric.Text => {
  const textObject = new fabric.Text(text, {
    left: position.x,
    top: position.y,
    fontSize: 20
  })
  canvas.add(textObject)
  return textObject
}
```

### 8.2 复杂逻辑注释

```typescript
// 计算文本边界框，考虑旋转角度
// 旋转时，边界框会改变，需要使用旋转矩阵计算实际尺寸
const getRotatedBounds = (object: fabric.Object) => {
  const angle = (object.angle * Math.PI) / 180
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const width = object.width || 0
  const height = object.height || 0

  // 应用旋转矩阵
  const rotatedWidth = Math.abs(width * cos) + Math.abs(height * sin)
  const rotatedHeight = Math.abs(width * sin) + Math.abs(height * cos)

  return { width: rotatedWidth, height: rotatedHeight }
}
```

---

## 9. 测试规范

### 9.1 单元测试

```typescript
// 正确
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    screen.getByText('Click me').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 9.2 集成测试

```typescript
// 正确
import { render, fireEvent, waitFor } from '@testing-library/react'
import { CanvasEditor } from './CanvasEditor'

describe('CanvasEditor Integration', () => {
  it('adds text when user clicks add text button', async () => {
    render(<CanvasEditor />)
    const addButton = screen.getByText('Add Text')
    fireEvent.click(addButton)
    await waitFor(() => {
      expect(screen.getByText('Text Object')).toBeInTheDocument()
    })
  })
})
```

---

## 10. Git 提交规范

### 10.1 提交信息格式

```
type(scope): subject

body

footer
```

**类型 (type)**:
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

**作用域 (scope)**:
- `canvas`: 画布相关
- `ui`: 用户界面
- `api`: API 相关
- `store`: 状态管理

**示例**:
```
feat(canvas): add text object selection support

Implement multi-select functionality for text objects
with keyboard modifier support

Closes #123
```

---

## 11. 性能优化规范

### 11.1 React 优化

```typescript
// 使用 useMemo 缓存计算结果
const ExpensiveComponent = ({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveOperation(item))
  }, [data])

  return <div>{processedData}</div>
}

// 使用 useCallback 缓存函数
const ParentComponent = () => {
  const handleClick = useCallback((id: string) => {
    console.log('Clicked item', id)
  }, [])

  return <ChildComponent onClick={handleClick} />
}
```

### 11.2 Fabric.js 优化

```typescript
// 批量渲染
const bulkAddObjects = (canvas: fabric.Canvas, objects: fabric.Object[]) => {
  canvas.discardActiveObject()
  canvas.add(...objects)
  canvas.renderAll() // 只调用一次 renderAll
}

// 避免频繁调用 renderAll
const addObjectOptimized = (canvas: fabric.Object) => {
  canvas.add(object)
  // 不要在这里调用 renderAll()
}

// 在所有操作完成后统一调用
const performMultipleOperations = (canvas: fabric.Canvas) => {
  canvas.add(object1)
  canvas.add(object2)
  canvas.remove(object3)
  canvas.renderAll() // 只在最后调用一次
}
```

---

## 12. 错误处理规范

### 12.1 全局错误边界

```typescript
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
    // 发送到错误监控服务
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>
    }

    return this.props.children
  }
}
```

### 12.2 Try-Catch 最佳实践

```typescript
// 正确
const saveDesign = async (design: Design) => {
  try {
    const result = await api.saveDesign(design)
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to save design:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
```

---

## 13. 代码审查清单

### 13.1 提交前检查

- [ ] 代码符合命名规范
- [ ] 添加了必要的类型标注
- [ ] 没有遗留的 console.log
- [ ] 错误处理完善
- [ ] 性能优化到位
- [ ] 添加了测试用例
- [ ] 更新了相关文档

### 13.2 代码审查要点

- [ ] 代码可读性
- [ ] 功能完整性
- [ ] 错误处理
- [ ] 性能影响
- [ ] 安全考虑
- [ ] 测试覆盖

---

## 14. 工具推荐

### 14.1 开发工具

- **IDE**: VS Code
- **插件**:
  - ESLint
  - Prettier
  - TypeScript Importer
  - Tailwind CSS IntelliSense

### 14.2 代码格式化

**ESLint 配置**:
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

**Prettier 配置**:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

---

## 15. 最佳实践

### 15.1 通用建议

1. **保持简单**: 优先选择简单清晰的解决方案
2. **DRY 原则**: 不要重复代码，提取公共逻辑
3. **单一职责**: 每个函数/组件只负责一件事
4. **防御性编程**: 验证输入，处理边界情况
5. **文档优先**: 代码应该自解释，但复杂逻辑需要注释

### 15.2 特定场景

**Canvas 操作**:
- 始终检查对象是否存在再操作
- 使用事务式操作，避免中间状态
- 注意内存管理，及时清理对象

**API 调用**:
- 始终处理错误情况
- 使用 Loading 状态提升用户体验
- 实现重试机制（网络错误时）

**状态管理**:
- 最小化全局状态
- 使用选择器避免不必要重渲染
- 定期清理副作用

---

## 总结

遵循这些编码规范可以确保：
- 代码质量和可维护性
- 团队协作效率
- 项目的长期可持续发展
- 新团队成员快速上手

记住：**好的代码不仅要能工作，还要易于理解和维护。**
