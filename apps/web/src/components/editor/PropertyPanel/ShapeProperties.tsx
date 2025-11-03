'use client'

import { useState, useEffect } from 'react'
import { fabric } from 'fabric'
import { Label } from './Label'
import { Input } from './Input'
import { Slider } from './Slider'
import { ColorPicker } from './ColorPicker'
import { getShapeDimensions } from '@/lib/fabric/shape'

interface ShapePropertiesProps {
  shapeObject: fabric.Object | null
  onChange: (object: fabric.Object) => void
}

export function ShapeProperties({ shapeObject, onChange }: ShapePropertiesProps) {
  const [fill, setFill] = useState('#3b82f6')
  const [stroke, setStroke] = useState('#1e40af')
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [opacity, setOpacity] = useState(1)
  const [width, setWidth] = useState(200)
  const [height, setHeight] = useState(150)
  const [angle, setAngle] = useState(0)

  useEffect(() => {
    if (shapeObject) {
      setFill(typeof shapeObject.fill === 'string' ? shapeObject.fill : '#3b82f6')
      setStroke(typeof shapeObject.stroke === 'string' ? shapeObject.stroke : '#1e40af')
      setStrokeWidth(shapeObject.strokeWidth || 0)
      setOpacity(shapeObject.opacity || 1)
      setAngle(shapeObject.angle || 0)

      const dimensions = getShapeDimensions(shapeObject)
      setWidth(dimensions.currentWidth)
      setHeight(dimensions.currentHeight)
    }
  }, [shapeObject])

  const updateProperty = (key: string, value: any) => {
    if (!shapeObject) return

    // @ts-ignore - dynamic property setter
    shapeObject.set(key, value)
    shapeObject.setCoords()
    onChange(shapeObject)

    if (shapeObject.canvas) {
      shapeObject.canvas.renderAll()
    }
  }

  if (!shapeObject || !['rect', 'circle', 'line'].includes(shapeObject.type || '')) {
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
                const scaleX = value / (shapeObject.width || 1)
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
                const scaleY = value / (shapeObject.height || 1)
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
            <Label>填充颜色</Label>
            <ColorPicker
              value={fill}
              onChange={(color) => {
                setFill(color)
                updateProperty('fill', color)
              }}
              placeholder="#3b82f6"
            />
          </div>

          <div>
            <Label>边框颜色</Label>
            <ColorPicker
              value={stroke}
              onChange={(color) => {
                setStroke(color)
                updateProperty('stroke', color)
              }}
              placeholder="#1e40af"
            />
          </div>

          <div>
            <Label>边框宽度: {strokeWidth}px</Label>
            <Slider
              value={strokeWidth}
              onChange={(value) => {
                setStrokeWidth(value)
                updateProperty('strokeWidth', value)
              }}
              min={0}
              max={20}
              step={1}
            />
          </div>

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
