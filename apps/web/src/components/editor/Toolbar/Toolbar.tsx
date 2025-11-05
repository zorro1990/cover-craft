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
  onOpenExportDialog: () => void
  onCopy: () => void
}

export function Toolbar({
  sizes,
  currentSize,
  currentBackground,
  onSizeChange,
  onBackgroundChange,
  onOpenExportDialog,
  onCopy,
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
          onClick={onOpenExportDialog}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          导出
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
