'use client'

import { useState, useEffect } from 'react'
import { fabric } from 'fabric'
import { Label } from './Label'
import { Input } from './Input'
import { Slider } from './Slider'
import { ColorPicker } from './ColorPicker'

interface TextPropertiesProps {
  textObject: fabric.Text | null
  onChange: (object: fabric.Object) => void
}

export function TextProperties({ textObject, onChange }: TextPropertiesProps) {
  const [text, setText] = useState('')
  const [fontSize, setFontSize] = useState(24)
  const [fontFamily, setFontFamily] = useState('Arial')
  const [fontWeight, setFontWeight] = useState('normal')
  const [fontStyle, setFontStyle] = useState('normal')
  const [textAlign, setTextAlign] = useState('left')
  const [fill, setFill] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('')
  const [underline, setUnderline] = useState(false)
  const [linethrough, setLinethrough] = useState(false)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (textObject && textObject.type === 'text') {
      setText(textObject.text || '')
      setFontSize(textObject.fontSize || 24)
      setFontFamily(textObject.fontFamily || 'Arial')
      setFontWeight(textObject.fontWeight?.toString() || 'normal')
      setFontStyle(textObject.fontStyle || 'normal')
      setTextAlign(textObject.textAlign || 'left')
      setFill(typeof textObject.fill === 'string' ? textObject.fill : '#000000')
      setBackgroundColor((textObject as any).backgroundColor || '')
      setUnderline(textObject.underline || false)
      setLinethrough(textObject.linethrough || false)
      setOpacity(textObject.opacity || 1)
    }
  }, [textObject])

  const updateProperty = (key: string, value: any) => {
    if (!textObject) return

    // @ts-ignore - dynamic property setter
    textObject.set(key, value)
    textObject.setCoords()
    onChange(textObject)

    if (textObject.canvas) {
      textObject.canvas.renderAll()
    }
  }

  if (!textObject || textObject.type !== 'text') {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-3 rounded">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">文本内容</h3>
        <div className="space-y-3">
          <div>
            <Label>文字</Label>
            <Input
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                updateProperty('text', e.target.value)
              }}
              placeholder="输入文字"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">字体</h3>
        <div className="space-y-3">
          <div>
            <Label>字体大小: {fontSize}px</Label>
            <Slider
              value={fontSize}
              onChange={(value) => {
                setFontSize(value)
                updateProperty('fontSize', value)
              }}
              min={8}
              max={200}
              step={1}
            />
          </div>

          <div>
            <Label>字体</Label>
            <select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value)
                updateProperty('fontFamily', e.target.value)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
              <option value="Georgia">Georgia</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Impact">Impact</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                const newWeight = fontWeight === 'bold' ? 'normal' : 'bold'
                setFontWeight(newWeight)
                updateProperty('fontWeight', newWeight)
              }}
              className={`px-3 py-2 rounded border ${
                fontWeight === 'bold'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="font-bold">B</span>
            </button>
            <button
              onClick={() => {
                const newStyle = fontStyle === 'italic' ? 'normal' : 'italic'
                setFontStyle(newStyle)
                updateProperty('fontStyle', newStyle)
              }}
              className={`px-3 py-2 rounded border ${
                fontStyle === 'italic'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="italic">I</span>
            </button>
          </div>

          <div>
            <Label>对齐方式</Label>
            <div className="grid grid-cols-4 gap-2">
              {['left', 'center', 'right', 'justify'].map((align) => (
                <button
                  key={align}
                  onClick={() => {
                    setTextAlign(align)
                    updateProperty('textAlign', align)
                  }}
                  className={`px-3 py-2 rounded border ${
                    textAlign === align
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {align === 'left' && '左'}
                  {align === 'center' && '中'}
                  {align === 'right' && '右'}
                  {align === 'justify' && '两'}
                </button>
              ))}
            </div>
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
              placeholder="#000000"
            />
          </div>

          <div>
            <Label>背景颜色</Label>
            <ColorPicker
              value={backgroundColor}
              onChange={(color) => {
                setBackgroundColor(color)
                updateProperty('backgroundColor', color)
              }}
              placeholder="透明"
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

          <div className="flex gap-2">
            <button
              onClick={() => {
                const newUnderline = !underline
                setUnderline(newUnderline)
                updateProperty('underline', newUnderline)
              }}
              className={`flex-1 px-3 py-2 rounded border ${
                underline
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              下划线
            </button>
            <button
              onClick={() => {
                const newLinethrough = !linethrough
                setLinethrough(newLinethrough)
                updateProperty('linethrough', newLinethrough)
              }}
              className={`flex-1 px-3 py-2 rounded border ${
                linethrough
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              删除线
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
