'use client'

import { Button } from '@/components/ui/button'
import { useCanvasStore } from '@/stores/canvasStore'
import { Palette } from 'lucide-react'

interface BackgroundSelectorProps {
  colors: string[]
  currentColor: string
}

export function BackgroundSelector({ colors, currentColor }: BackgroundSelectorProps) {
  const { setBackgroundColor } = useCanvasStore()

  return (
    <div className="relative group">
      <Button variant="outline" className="gap-2">
        <div
          className="w-5 h-5 rounded border border-gray-300"
          style={{ backgroundColor: currentColor }}
        />
        <Palette className="w-4 h-4" />
      </Button>

      <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="p-3">
          <div className="text-sm font-medium text-gray-700 mb-3 px-1">
            背景色
          </div>
          <div className="grid grid-cols-6 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setBackgroundColor(color)}
                className={`w-10 h-10 rounded border-2 transition-all ${
                  currentColor === color
                    ? 'border-blue-600 scale-110'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
