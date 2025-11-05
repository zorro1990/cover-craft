'use client'

import { useState, useEffect } from 'react'
import { fabric } from 'fabric'
import { Label } from './Label'
import { Slider } from './Slider'

interface ImagePropertiesProps {
  imageObject: fabric.Image | null
  onChange: (object: fabric.Object) => void
}

export function ImageProperties({ imageObject, onChange }: ImagePropertiesProps) {
  const [opacity, setOpacity] = useState(1)
  const [width, setWidth] = useState(200)
  const [height, setHeight] = useState(200)
  const [angle, setAngle] = useState(0)

  useEffect(() => {
    if (imageObject && imageObject.type === 'image') {
      setOpacity(imageObject.opacity || 1)
      setAngle(imageObject.angle || 0)

      const originalWidth = (imageObject as any).originalWidth || imageObject.width || 1
      const originalHeight = (imageObject as any).originalHeight || imageObject.height || 1
      const scaleX = imageObject.scaleX || 1
      const scaleY = imageObject.scaleY || 1

      setWidth(originalWidth * scaleX)
      setHeight(originalHeight * scaleY)
    }
  }, [imageObject])

  const updateProperty = (key: string, value: any) => {
    if (!imageObject) return

    // @ts-ignore - dynamic property setter
    imageObject.set(key, value)
    imageObject.setCoords()
    onChange(imageObject)

    if (imageObject.canvas) {
      imageObject.canvas.renderAll()
    }
  }

  if (!imageObject || imageObject.type !== 'image') {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-3 rounded">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">尺寸</h3>
        <div className="space-y-3">
          <div>
            <Label>宽度: {Math.round(width)}px</Label>
            <Slider
              value={width}
              onChange={(value) => {
                setWidth(value)
                const originalWidth = imageObject ? ((imageObject as any).originalWidth || imageObject.width || 200) : 200
                const scaleX = value / originalWidth
                updateProperty('scaleX', scaleX)
              }}
              min={10}
              max={800}
              step={1}
            />
          </div>

          <div>
            <Label>高度: {Math.round(height)}px</Label>
            <Slider
              value={height}
              onChange={(value) => {
                setHeight(value)
                const originalHeight = imageObject ? ((imageObject as any).originalHeight || imageObject.height || 200) : 200
                const scaleY = value / originalHeight
                updateProperty('scaleY', scaleY)
              }}
              min={10}
              max={600}
              step={1}
            />
          </div>

          <div>
            <Label>旋转角度: {Math.round(angle)}°</Label>
            <Slider
              value={angle}
              onChange={(value) => {
                setAngle(value)
                updateProperty('angle', value)
              }}
              min={0}
              max={360}
              step={1}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">样式</h3>
        <div className="space-y-3">
          <div>
            <Label>透明度: {Math.round(opacity * 100)}%</Label>
            <Slider
              value={opacity}
              onChange={(value) => {
                setOpacity(value)
                updateProperty('opacity', value)
              }}
              min={0}
              max={1}
              step={0.01}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
