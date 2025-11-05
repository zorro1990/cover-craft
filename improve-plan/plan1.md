开始执行“阶段 1”的详细改动清单（不直接修改代码，仅提供逐文件、逐行、可复制执行的指令）。目标：去除 console/alert、解耦 Canvas 初始化与更新、配置集中化、规范化错误处理。以下每一步都给出精准位置与最小改动方案。

总体说明
不引入第三方依赖，避免包管理动作（若后续需要，我会先征求你许可）
新增的最小基础设施：轻量 Logger、轻量 Toast 通知
移除所有 alert/console.log/console.error 的直接使用，统一到 Logger+Toast
将 Toolbar 硬编码色板改为复用 DEFAULT_BACKGROUNDS
将 Canvas 组件改为“仅初始化”，具体尺寸与背景更新交由上层 EditorPage 调度
A. 新增：轻量 Logger（apps/web/src/lib/utils/logger.ts）
用于在开发环境打印、生产环境静默或接入监控（预留），替代 console.* 直用。

新增文件 apps/web/src/lib/utils/logger.ts，建议内容（示例片段）：

使用方式：import { logger } from '@/lib/utils/logger'

B. 新增：轻量 Toast（apps/web/src/components/ui/Toast.tsx）
提供 useToast() 钩子：toast.success(msg) / toast.error(msg) / toast.info(msg)。不依赖外部库，简单绝对定位显示。

新增文件 apps/web/src/components/ui/Toast.tsx，建议内容（示例片段）：

在根布局中包裹 Provider（下一步 C），之后即可在任意组件：const toast = useToast(); toast.success('…')

C. 修改：全局注入 ToastProvider（apps/web/src/app/layout.tsx）
在 <body> 内包裹 <ToastProvider>，以便全局使用
修改 apps/web/src/app/layout.tsx：

顶部新增：import { ToastProvider } from '@/components/ui/Toast'
包裹 children
示例片段（将 children 包在 Provider 内）：

D. 替换所有 alert 为 Toast（apps/web/src/app/editor/page.tsx）
顶部新增：import { useToast } from '@/components/ui/Toast'
组件内初始化：const toast = useToast()
将下列 alert(...) 替换为 toast.error(...) 或 toast.success(...)
逐行替换列表：

L67: alert('画布未初始化') → toast.error('画布未初始化')
L77: alert(validation.error) → toast.error(validation.error || '文件校验失败')
L89: alert('图片上传成功！') → toast.success('图片上传成功！')
L92: alert('图片上传失败，请重试') → toast.error('图片上传失败，请重试')
L98: alert('画布未初始化') → toast.error('画布未初始化')
L116: alert('形状创建失败，请重试') → toast.error('形状创建失败，请重试')
L122: alert('画布未初始化') → toast.error('画布未初始化')
L133: alert('导出失败，请重试') → toast.error('导出失败，请重试')
L139: alert('画布未初始化') → toast.error('画布未初始化')
L146: alert('图片已复制到剪贴板！') → toast.success('图片已复制到剪贴板！')
L149: alert('复制失败，请重试') → toast.error('复制失败，请重试')
示例增量片段：

E. 去除 console.* 并统一 Logger
apps/web/src/components/editor/Canvas/Canvas.tsx
顶部新增：import { logger } from '@/lib/utils/logger'
L42 删除 console.log(...)
L52 改为 logger.error('Failed to initialize canvas')
L75 改为 logger.error('Failed to update canvas')
示例增量片段：

apps/web/src/lib/fabric/canvas.ts
顶部新增：import { logger } from '@/lib/utils/logger'
替换 console.error：
L52 → logger.warn('Canvas is not initialized'); return
L61 → logger.warn('Invalid canvas size provided to resizeCanvas')
L94 → logger.warn('Canvas is not initialized'); return
L113 → logger.warn('Canvas is not initialized'); return ''
L155 → logger.warn('Canvas is not initialized'); return
示例增量片段：

说明：此处不抛异常，避免破坏当前调用点；阶段 2 可评估改为抛错 + 上层统一捕获。

F. 解耦 Canvas 初始化与更新（apps/web/src/components/editor/Canvas/Canvas.tsx）
现状：初始化 effect 依赖 safeWidth/Height/Background，更新 effect 再次 setDimensions/setBackground，且上层 EditorPage 已独立驱动 resize/background，存在重复与抖动风险。

改动：

初始化 effect 仅在挂载时执行（或仅依赖 onCanvasReady），移除对 safeWidth/Height/Color 的依赖
L54: }, [onCanvasReady, safeWidth, safeHeight, safeBackgroundColor]) → }, [onCanvasReady])（如 onCanvasReady 不稳定，可进一步使用 ref 包装为稳定回调）
删除整个“更新 canvas” effect（L56–L77），以 EditorPage 的 resizeCanvas/setCanvasBackground 为唯一来源
示例增量片段：


Canvas.tsx
apps/web/src/components/editor/Canvas
G. 配置集中化：复用 DEFAULT_BACKGROUNDS（apps/web/src/components/editor/Toolbar/Toolbar.tsx）
顶部新增：import { DEFAULT_BACKGROUNDS } from '@/lib/fabric/canvas'
L38 替换硬编码色板为常量
示例增量片段：


Toolbar.tsx
apps/web/src/components/editor/Toolbar
H. 可选：默认文本/形状参数常量化（建议，便于统一）
新增文件 apps/web/src/lib/constants/editor.ts：
导出 DEFAULT_TEXT_PROPS
修改 editor/page.tsx 的 handleAddText 使用常量
新增文件示例片段：


editor.ts
apps/web/src/lib/constants
替换使用（editor/page.tsx）：


page.tsx
apps/web/src/app/editor
说明：形状默认参数已集中在 lib/fabric/shape.ts 内部，此处无需额外改动。

I. 依赖统一建议（不执行，仅建议）
发现 fabric 版本冲突（root: ^6.7.1 vs apps/web: 5.3.0）。建议短期统一在 5.3.0 以降低风险，后续再升级。

命令（需你授权后执行）：
在根移除：npm uninstall fabric
在 web 保留：npm install fabric@5.3.0 -w apps/web
校验 @types/fabric 兼容性（apps/web 当前为 ^5.3.5，匹配 OK）
验收清单（阶段 1）
规范
代码库无 console.log/console.error 直用（已替换为 logger）
所有 alert 已替换为 Toast
Toolbar 使用 DEFAULT_BACKGROUNDS，无魔法数字色板
稳定性
Canvas 初始化仅在挂载执行；尺寸/背景更新仅由 EditorPage 驱动
切换尺寸/背景不重建 Canvas；对象位置与缩放无异常
可维护性
Logger/Toast 在 layout 注入全局可用
需要你确认的事项
是否按上述指令让 Claude Code 执行“阶段 1”改动？---是
Toast/Logger 的命名与存放路径是否接受当前建议？---是
是否授权我在后续执行“fabric 版本统一”的包管理操作（我将按你的选择准备命令并执行）---是