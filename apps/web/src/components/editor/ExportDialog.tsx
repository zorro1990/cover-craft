'use client'

import { useState } from 'react'

export interface ExportOptions {
  format: 'png' | 'jpeg'
  quality: 1 | 2 | 3
  transparent: boolean
}

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  onExport: (options: ExportOptions) => void
}

export function ExportDialog({ isOpen, onClose, onExport }: ExportDialogProps) {
  const [format, setFormat] = useState<'png' | 'jpeg'>('png')
  const [quality, setQuality] = useState<1 | 2 | 3>(1)
  const [transparent, setTransparent] = useState(false)

  if (!isOpen) return null

  const handleExport = () => {
    onExport({ format, quality, transparent })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h2 className="text-xl font-bold mb-4">导出设置</h2>

        {/* 格式选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">导出格式</label>
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('png')}
              className={`flex-1 px-4 py-2 rounded ${
                format === 'png'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              PNG
            </button>
            <button
              onClick={() => setFormat('jpeg')}
              className={`flex-1 px-4 py-2 rounded ${
                format === 'jpeg'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              JPEG
            </button>
          </div>
        </div>

        {/* 质量选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">导出质量</label>
          <div className="flex gap-2">
            {[1, 2, 3].map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q as 1 | 2 | 3)}
                className={`flex-1 px-4 py-2 rounded ${
                  quality === q
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {q}x
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {quality === 1 && '标准质量（适合网页）'}
            {quality === 2 && '高质量（适合打印）'}
            {quality === 3 && '超高质量（适合专业用途）'}
          </p>
        </div>

        {/* 透明背景选项（仅 PNG） */}
        {format === 'png' && (
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={transparent}
                onChange={(e) => setTransparent(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium">透明背景</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              导出时移除画布背景色
            </p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            取消
          </button>
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            导出
          </button>
        </div>
      </div>
    </div>
  )
}
