'use client'

import { Type, Image, Square, Circle, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AssetPanelProps {
  activeTool: string
  onToolChange: (tool: string) => void
}

export function AssetPanel({ activeTool, onToolChange }: AssetPanelProps) {
  const tools = [
    { id: 'text', icon: Type, label: '文字', enabled: true },
    { id: 'image', icon: Image, label: '图片', enabled: false },
    { id: 'rect', icon: Square, label: '矩形', enabled: false },
    { id: 'circle', icon: Circle, label: '圆形', enabled: false },
    { id: 'background', icon: Palette, label: '背景', enabled: true },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">素材工具</h2>
      </div>

      <div className="p-4 space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? 'default' : 'ghost'}
              disabled={!tool.enabled}
              onClick={() => onToolChange(tool.id)}
              className="w-full justify-start gap-3"
            >
              <Icon className="w-5 h-5" />
              <span>{tool.label}</span>
              {!tool.enabled && (
                <span className="ml-auto text-xs text-gray-400">(即将推出)</span>
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
