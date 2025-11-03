UI/UX 规范: Cover Craft AI

1. 总体 UX 目标与原则

易用性目标:

零学习成本: 用户无需教程即可完成核心设计流程。

效率至上: 提供快捷键和直观操作，让高频操作（如添加文字、图片）极为迅速。

设计原则:

清晰优于炫酷: 界面元素保持简洁，功能一目了然。

即时反馈: 用户的每一次操作都应有明确的视觉反馈。

模式一致: 遵循 Figma 和 Canva 等成熟设计工具的最佳实践，降低用户认知负担。

2. 信息架构 (IA)
(已更新以包含所有阶段的功能)

graph TD
    A[编辑器主页] --> B[画布区域];
    A --> C[顶部工具栏];
    A --> D[左侧素材/功能面板];
    A --> E[右侧属性检查器];

    C --> C1[尺寸调整];
    C --> C2[复制/下载];
    C --> C3[分享(P4)];
    C --> C4[另存为模板(P4)];

    D --> D1[模板(P4)];
    D --> D2[文字(P1+P2)];
    D --> D3[图片(P1)];
    D --> D4[图库(P3)];
    D --> D5[AI生图(P3)];
    D --> D6[图标/形状(P2)];
    D --> D7[背景(P1+P2)];
    D --> D8[共享素材(P4)];
    
    D4 --> D4_1[Unsplash];
    D4 --> D4_2[个人图库];

    E --> E1[元素属性调整];
    E --> E2[高级编辑(P2)];
    E --> E3[AI改图(P3)];



3. 核心用户流程

流程 1 (MVP): 创建一张封面

sequenceDiagram
    participant User as 用户
    participant App as 应用
    User->>App: 打开 cover.qiaomu.ai
    App->>User: 显示默认画布和工具界面
    User->>App: (可选) 在顶部工具栏选择画布尺寸
    User->>App: 从左侧面板选择“文字”工具
    App->>User: 在画布上添加一个文本框
    User->>App: 选中并编辑文字内容
    User->>App: 在右侧属性面板调整字体和颜色
    User->>App: 从左侧面板选择“图片”，上传本地图片
    App->>User: 图片显示在画布上
    User->>App: 拖拽调整图片和文字位置
    User->>App: 点击顶部“复制”按钮
    App->>User: 提示“已复制到剪贴板”


流程 2 (Phase 3): 使用 AI 生图并去背景

sequenceDiagram
    participant User as 用户
    participant App as 应用
    participant Seedream as Seedream API
    participant RemoveBg as Remove.bg API

    User->>App: 点击左侧面板 "AI生图"
    App->>User: 显示 AI 提示词输入框
    User->>App: 输入 "一只可爱的猫" 并点击生成
    App->>Seedream: 请求生成图片
    Seedream-->>App: 返回图片数据
    App->>User: 在面板中显示生成的图片
    User->>App: 点击图片，将其添加到画布
    User->>App: 选中图片，在右侧面板点击 "AI去背景"
    App->>RemoveBg: 发送图片数据
    RemoveBg-->>App: 返回透明背景的图片
    App->>User: 画布上的图片背景被移除


流程 3 (Phase 4): 分享设计稿为模板

sequenceDiagram
    participant User as 用户
    participant App as 应用
    participant DB as Vercel DB

    User->>App: 设计完成后，点击顶部 "另存为模板"
    App->>User: 弹出窗口，要求输入模板名称
    User->>App: 输入名称并确认 "共享"
    App->>DB: 保存画布内容 (JSON) 和元数据 (isPublicTemplate=true)
    DB-->>App: 返回成功状态
    App->>User: 提示 "模板共享成功"
    
    participant OtherUser as 其他用户
    OtherUser->>App: 点击左侧面板 "模板"
    App->>DB: 查询所有 isPublicTemplate=true 的设计
    DB-->>App: 返回模板列表
    App->>OtherUser: 在面板中显示模板库
    OtherUser->>App: 点击一个模板
    App->>User: 将该模板内容加载到画布


4. 组件库 / 设计系统 (已扩展)

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