# 4. 组件库 / 设计系统 (已扩展)

核心组件:

画布 (Canvas): 核心交互区域。

工具栏 (Toolbar): 顶部，包含尺寸选择、撤销/重做、导出、分享(P4)、存为模板(P4)等全局操作。

素材面板 (Asset Panel): 左侧，用于切换不同素材来源的视图（模板、文字、图库、AI等）。

属性检查器 (Property Inspector): 右侧，根据当前选中元素动态显示可调整的属性（如圆角、阴影(P2)、AI改图(P3)）。

新增功能组件:

FontPicker (P2): 集成18+种字体的自定义选择器。

GradientPicker (P2): 渐变色选择器。

IconBrowser (P2): Lucide 图标和 Emoji 的搜索和选择界面。

ImageEditor (P2): 包含滤镜、裁剪、亮度/对比度调整的控件。

AIPromptModal (P3): 用于 AI 生图和 AI 改图的提示词输入模态框。

UnsplashSearch (P3): 集成 Unsplash API 的图片搜索和结果展示组件。

TemplateBrowser (P4): 用于浏览和使用共享模板的界面。

ShareModal (P4): 用于生成和复制公开分享链接的模态框。
