'use client'

import { useState, useEffect } from 'react'
import { fabric } from 'fabric'
import { TextProperties } from './TextProperties'
import { ImageProperties } from './ImageProperties'
import { ShapeProperties } from './ShapeProperties'

interface PropertyPanelProps {
  canvas: fabric.Canvas | null
}

export function PropertyPanel({ canvas }: PropertyPanelProps) {
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null)

  useEffect(() => {
    if (!canvas) {
      setSelectedObject(null)
      return
    }

    const handleSelection = (e: any) => {
      const activeObject = canvas.getActiveObject()
      setSelectedObject(activeObject || null)
    }

    const handleDeselection = () => {
      setSelectedObject(null)
    }

    canvas.on('selection:created', handleSelection)
    canvas.on('selection:updated', handleSelection)
    canvas.on('selection:cleared', handleDeselection)

    return () => {
      canvas.off('selection:created', handleSelection)
      canvas.off('selection:updated', handleSelection)
      canvas.off('selection:cleared', handleDeselection)
    }
  }, [canvas])

  if (!canvas) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">属性</h2>
        <p className="text-gray-500">画布未初始化</p>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">属性</h2>

      {!selectedObject ? (
        <p className="text-gray-500">选择一个对象查看属性</p>
      ) : (
        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">对象信息</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">类型:</span>
                <span className="font-medium">{selectedObject.type}</span>
              </div>
              {selectedObject.left !== undefined && selectedObject.top !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">位置:</span>
                  <span className="font-medium">
                    ({Math.round(selectedObject.left)}, {Math.round(selectedObject.top)})
                  </span>
                </div>
              )}
              {selectedObject.width !== undefined && selectedObject.height !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">尺寸:</span>
                  <span className="font-medium">
                    {Math.round(selectedObject.width)} × {Math.round(selectedObject.height)}
                  </span>
                </div>
              )}
              {selectedObject.angle !== undefined && selectedObject.angle !== 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">角度:</span>
                  <span className="font-medium">{Math.round(selectedObject.angle)}°</span>
                </div>
              )}
              {selectedObject.opacity !== undefined && selectedObject.opacity !== 1 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">透明度:</span>
                  <span className="font-medium">{Math.round(selectedObject.opacity * 100)}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic property editor based on selected object type */}
          {selectedObject.type === 'text' && (
            <TextProperties
              textObject={selectedObject as fabric.Text}
              onChange={() => canvas.renderAll()}
            />
          )}

          {selectedObject.type === 'image' && (
            <ImageProperties
              imageObject={selectedObject as fabric.Image}
              onChange={() => canvas.renderAll()}
            />
          )}

          {['rect', 'circle', 'line'].includes(selectedObject.type || '') && (
            <ShapeProperties
              shapeObject={selectedObject}
              onChange={() => canvas.renderAll()}
            />
          )}
        </div>
      )}
    </div>
  )
}
