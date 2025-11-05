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

      {/* 新增：快捷键提示 */}
      <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-600">
        <p className="font-semibold mb-2">快捷键绘制：</p>
        <ul className="space-y-1">
          <li><kbd className="px-2 py-1 bg-white rounded border">R</kbd> 矩形</li>
          <li><kbd className="px-2 py-1 bg-white rounded border">O</kbd> 圆形</li>
          <li><kbd className="px-2 py-1 bg-white rounded border">L</kbd> 直线</li>
          <li><kbd className="px-2 py-1 bg-white rounded border">Esc</kbd> 退出绘制</li>
        </ul>
      </div>
    </div>
  )
}
