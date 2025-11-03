'use client'

import { fabric } from 'fabric'
import { useCanvas } from '@/hooks/useCanvas'

export function Toolbar() {
  const { canvas } = useCanvas()

  const handleExport = (format: 'png' | 'jpeg') => {
    if (!canvas) {
      alert('画布未初始化')
      return
    }

    const dataURL = canvas.toDataURL({
      format: format,
      quality: 1,
      multiplier: 2,
    })

    const link = document.createElement('a')
    link.download = `cover-craft-${Date.now()}.${format}`
    link.href = dataURL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopy = async () => {
    if (!canvas) {
      alert('画布未初始化')
      return
    }

    try {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2,
      })

      await navigator.clipboard.writeText(dataURL)
      alert('图片已复制到剪贴板！')
    } catch (error) {
      console.error('Failed to copy:', error)
      alert('复制失败，请重试')
    }
  }

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <h1 className="text-lg font-semibold">Cover Craft</h1>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleExport('png')}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          下载 PNG
        </button>
        <button
          onClick={() => handleExport('jpeg')}
          className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          下载 JPEG
        </button>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          复制图片
        </button>
      </div>
    </div>
  )
}
