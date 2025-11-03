import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8 p-12 bg-white rounded-2xl shadow-xl">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Cover Craft AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            使用 AI 和丰富的设计素材，快速创建专业的社交媒体封面
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/editor"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            开始设计
          </Link>
          <Link
            href="/templates"
            className="px-8 py-4 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            浏览模板
          </Link>
        </div>

        <div className="pt-8 text-sm text-gray-500">
          <p>由 BMAD 工作流驱动开发</p>
        </div>
      </div>
    </main>
  )
}
