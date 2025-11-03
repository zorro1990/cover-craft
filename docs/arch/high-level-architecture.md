# 1. 高层架构 (High Level Architecture)

技术摘要: 本项目将采用基于 Next.js 的 Jamstack 架构，部署于 Vercel 平台。前端负责所有设计和渲染逻辑，利用 Fabric.js 实现高性能画布。后端功能（如作品分享、模板存储）将通过 Vercel 的 Serverless Functions 和数据库（Vercel Postgres）实现，形成一个高度集成、易于扩展的全栈应用。

仓库结构: 采用 Monorepo 结构，便于管理前端应用和未来可能出现的共享库（如共享类型定义）。
