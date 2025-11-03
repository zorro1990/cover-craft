'use client'

interface ShapeTabProps {
  onShapeCreate: (shapeType: 'rectangle' | 'circle' | 'line') => void
}

export function ShapeTab({ onShapeCreate }: ShapeTabProps) {
  return (
    <div className="p-4 space-y-2">
      <button
        onClick={() => onShapeCreate('rectangle')}
        className="w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        矩形
      </button>
      <button
        onClick={() => onShapeCreate('circle')}
        className="w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        圆形
      </button>
      <button
        onClick={() => onShapeCreate('line')}
        className="w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        直线
      </button>
    </div>
  )
}
