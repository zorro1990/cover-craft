'use client'

interface TextTabProps {
  onAddText: () => void
}

export function TextTab({ onAddText }: TextTabProps) {
  return (
    <div className="p-4">
      <button
        onClick={onAddText}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        添加文字
      </button>
    </div>
  )
}
