# 5. 部署架构 (Deployment Architecture)

CI/CD: 直接利用 Vercel 与 GitHub 的集成。每次 main 分支的 push 都会触发自动构建和部署。

环境变量: 需要在 Vercel 项目中配置以下 Secrets：

SEEDREAM_API_KEY

UNSPLASH_ACCESS_KEY

REMOVE_BG_API_KEY

POSTGRES_URL (由 Vercel 自动注入)

环境:

开发 (Development): 本地 next dev 命令。

预览 (Preview): 每个 Pull Request 自动生成一个预览链接。

生产 (Production): 合并到 main 分支后自动部署到主域名。
