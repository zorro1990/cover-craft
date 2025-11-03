'use client'

import { Button } from '@/components/ui/button'
import type { CanvasSize } from '@cover-craft/shared-types'
import { useCanvasStore } from '@/stores/canvasStore'
import { ChevronDown } from 'lucide-react'

interface SizeSelectorProps {
  sizes: CanvasSize[]
  currentSize: CanvasSize
}

export function SizeSelector({ sizes, currentSize }: SizeSelectorProps) {
  const { setCanvasSize } = useCanvasStore()

  return (
    <div className="relative group">
      <Button variant="outline" className="gap-2">
        {currentSize.ratio}
        <ChevronDown className="w-4 h-4" />
      </Button>

      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="p-2">
          <div className="text-sm font-medium text-gray-700 mb-2 px-2">
            画布尺寸
          </div>
          {sizes.map((size) => (
            <button
              key={size.ratio}
              onClick={() => setCanvasSize(size)}
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors ${
                currentSize.ratio === size.ratio
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700'
              }`}
            >
              <div className="font-medium">{size.ratio}</div>
              <div className="text-xs text-gray-500">
                {size.width} × {size.height}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
