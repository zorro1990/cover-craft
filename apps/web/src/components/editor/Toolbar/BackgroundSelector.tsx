'use client'

interface BackgroundSelectorProps {
  colors: string[]
  currentColor: string
  onBackgroundChange: (color: string) => void
}

export function BackgroundSelector({ colors, currentColor, onBackgroundChange }: BackgroundSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">背景:</span>
      <div className="flex gap-1">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onBackgroundChange(color)}
            className={`w-8 h-8 rounded border-2 transition-all ${
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
  )
}
