'use client'

import type { CanvasSize } from '@cover-craft/shared-types'

interface SizeSelectorProps {
  sizes: CanvasSize[]
  currentSize: CanvasSize
  onSizeChange: (size: CanvasSize) => void
}

export function SizeSelector({ sizes, currentSize, onSizeChange }: SizeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">尺寸:</span>
      <div className="flex gap-1">
        {sizes.map((size) => (
          <button
            key={size.ratio}
            onClick={() => onSizeChange(size)}
            className={`px-3 py-1.5 text-xs rounded border transition-colors ${
              currentSize.ratio === size.ratio
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            title={`${size.label} (${size.width}x${size.height})`}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  )
}
