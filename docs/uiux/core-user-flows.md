# 3. 核心用户流程

流程 1 (MVP): 创建一张封面

sequenceDiagram
    participant User as 用户
    participant App as 应用
    User->>App: 打开 cover.qiaomu.ai
    App->>User: 显示默认画布和工具界面
    User->>App: (可选) 在顶部工具栏选择画布尺寸
    User->>App: 从左侧面板选择"文字"工具
    App->>User: 在画布上添加一个文本框
    User->>App: 选中并编辑文字内容
    User->>App: 在右侧属性面板调整字体和颜色
    User->>App: 从左侧面板选择"图片"，上传本地图片
    App->>User: 图片显示在画布上
    User->>App: 拖拽调整图片和文字位置
    User->>App: 点击顶部"复制"按钮
    App->>User: 提示"已复制到剪贴板"


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
