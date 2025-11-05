'use client'

import { SizeSelector } from './SizeSelector'
import { BackgroundSelector } from './BackgroundSelector'
import { DEFAULT_BACKGROUNDS } from '@/lib/fabric/canvas'
import type { CanvasSize } from '@cover-craft/shared-types'

interface ToolbarProps {
  sizes: CanvasSize[]
  currentSize: CanvasSize
  currentBackground: string
  onSizeChange: (size: CanvasSize) => void
  onBackgroundChange: (color: string) => void
  onCopy: () => void
  onExport: (format: 'png' | 'jpeg') => void
}

export function Toolbar({
  sizes,
  currentSize,
  currentBackground,
  onSizeChange,
  onBackgroundChange,
  onCopy,
  onExport,
}: ToolbarProps) {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-semibold">Cover Craft</h1>

        <div className="flex items-center gap-4">
          <SizeSelector
            sizes={sizes}
            currentSize={currentSize}
            onSizeChange={onSizeChange}
          />
          <BackgroundSelector
            colors={DEFAULT_BACKGROUNDS}
            currentColor={currentBackground}
            onBackgroundChange={onBackgroundChange}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onExport('png')}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          下载 PNG
        </button>
        <button
          onClick={() => onExport('jpeg')}
          className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          下载 JPEG
        </button>
        <button
          onClick={onCopy}
          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          复制图片
        </button>
      </div>
    </div>
  )
}
