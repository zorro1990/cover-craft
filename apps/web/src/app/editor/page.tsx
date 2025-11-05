'use client'

import { useState, useEffect } from 'react'
import { fabric } from 'fabric'
import { Canvas } from '@/components/editor/Canvas/Canvas'
import { Toolbar } from '@/components/editor/Toolbar/Toolbar'
import { TextTab } from '@/components/editor/AssetPanel/TextTab'
import { ImageTab } from '@/components/editor/AssetPanel/ImageTab'
import { ShapeTab } from '@/components/editor/AssetPanel/ShapeTab'
import { PropertyPanel } from '@/components/editor/PropertyPanel/PropertyPanel'
import { useCanvas } from '@/hooks/useCanvas'
import { useCanvasStore } from '@/stores/canvasStore'
import { useToast } from '@/components/ui/Toast'
import { ExportDialog, ExportOptions } from '@/components/editor/ExportDialog'
import { CANVAS_SIZES, exportCanvas, copyToClipboard, downloadCanvas, resizeCanvas, setCanvasBackground, resetCanvasView, downloadCanvasImage } from '@/lib/fabric/canvas'
import { DEFAULT_TEXT_PROPS } from '@/lib/constants/editor'
import { createImageObject } from '@/lib/fabric/image'
import { validateImageFile } from '@/lib/utils/fileValidation'
import { createRectangle, createCircle, createLine, startDragDrawShape, updateDragDrawShape, finishDragDrawShape } from '@/lib/fabric/shape'

export default function EditorPage() {
  const [activeTool, setActiveTool] = useState('text')
  const [canvasInstance, setCanvasInstance] = useState<fabric.Canvas | null>(null)
  const [drawMode, setDrawMode] = useState<'none' | 'rectangle' | 'circle' | 'line'>('none')
  const [isDrawing, setIsDrawing] = useState(false)
  const [tempShape, setTempShape] = useState<fabric.Object | null>(null)
  const [drawStartPoint, setDrawStartPoint] = useState<{ x: number; y: number } | null>(null)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const { setCanvas, addText } = useCanvas()
  const toast = useToast()

  // Get state from store
  const { currentSize, backgroundColor, setCanvasSize, setBackgroundColor } = useCanvasStore()

  // Ensure we always have safe values for downstream consumers
  const canvasSize = currentSize ?? CANVAS_SIZES[0]
  const canvasBackground = backgroundColor ?? '#ffffff'

  const handleCanvasReady = (canvas: fabric.Canvas) => {
    setCanvas(canvas)
    setCanvasInstance(canvas)

    // Sync canvas with store
    resizeCanvas(canvas, canvasSize, false)
    setCanvasBackground(canvas, canvasBackground)
  }

  // Watch for store changes and update canvas
  useEffect(() => {
    if (!canvasInstance || !canvasSize) return

    resizeCanvas(canvasInstance, canvasSize, true)
  }, [canvasInstance, canvasSize])

  useEffect(() => {
    if (!canvasInstance || !canvasBackground) return

    setCanvasBackground(canvasInstance, canvasBackground)
  }, [canvasInstance, canvasBackground])

  const handleToolChange = (tool: string) => {
    setActiveTool(tool)
  }

  const handleAddText = () => {
    addText(DEFAULT_TEXT_PROPS)
  }

  const handleImageUpload = async (file: File) => {
    if (!canvasInstance) {
      toast.error('画布未初始化')
      return
    }

    const validation = validateImageFile(file, {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    })

    if (!validation.valid) {
      toast.error(validation.error || '文件校验失败')
      return
    }

    try {
      const imageObject = await createImageObject(canvasInstance, file, {
        maxSize: 800,
      })

      // Store file size for display
      ;(imageObject as any).fileSize = file.size

      toast.success('图片上传成功！')
    } catch (error) {
      toast.error('图片上传失败，请重试')
    }
  }

  const handleShapeCreate = (shapeType: 'rectangle' | 'circle' | 'line') => {
    if (!canvasInstance) {
      toast.error('画布未初始化')
      return
    }

    try {
      switch (shapeType) {
        case 'rectangle':
          createRectangle(canvasInstance)
          break
        case 'circle':
          createCircle(canvasInstance)
          break
        case 'line':
          createLine(canvasInstance)
          break
      }
    } catch (error) {
      toast.error('形状创建失败，请重试')
    }
  }

  const handleCopy = async () => {
    if (!canvasInstance) {
      toast.error('画布未初始化')
      return
    }

    try {
      const dataUrl = exportCanvas(canvasInstance, { format: 'png' })
      await copyToClipboard(dataUrl)
      toast.success('图片已复制到剪贴板！')
    } catch (error) {
      toast.error('复制失败，请重试')
    }
  }

  const handleExport = (options: ExportOptions) => {
    if (!canvasInstance) {
      toast.error('画布未初始化')
      return
    }

    try {
      downloadCanvasImage(canvasInstance, {
        format: options.format,
        quality: options.quality,
        transparent: options.transparent,
      })
      toast.success('导出成功')
    } catch (error) {
      toast.error('导出失败，请重试')
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger shortcuts when not typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as any)?.contentEditable === 'true'
      ) {
        return
      }

      const key = e.key.toLowerCase()
      if (key === 'r') {
        e.preventDefault()
        handleShapeCreate('rectangle')
      } else if (key === 'o') {
        e.preventDefault()
        handleShapeCreate('circle')
      } else if (key === 'l') {
        e.preventDefault()
        handleShapeCreate('line')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [canvasInstance])

  // 重置视图快捷键 (Ctrl+0)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault()
        resetCanvasView(canvasInstance)
        toast.success('视图已重置')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canvasInstance, toast])

  // 形状绘制快捷键 (R/O/L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果正在编辑文本，不触发快捷键
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return
      }

      switch (e.key.toLowerCase()) {
        case 'r':
          setDrawMode('rectangle')
          toast.info('矩形绘制模式：在画布上拖拽绘制')
          break
        case 'o':
          setDrawMode('circle')
          toast.info('圆形绘制模式：在画布上拖拽绘制')
          break
        case 'l':
          setDrawMode('line')
          toast.info('直线绘制模式：在画布上拖拽绘制')
          break
        case 'escape':
          if (drawMode !== 'none') {
            setDrawMode('none')
            toast.info('已退出绘制模式')
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [drawMode, toast])

  // 画布绘制事件监听
  useEffect(() => {
    if (!canvasInstance || drawMode === 'none') return

    const handleMouseDown = (opt: fabric.IEvent) => {
      const pointer = canvasInstance.getPointer(opt.e)
      setIsDrawing(true)
      setDrawStartPoint(pointer)
      const shape = startDragDrawShape(canvasInstance, drawMode, pointer)
      setTempShape(shape)
    }

    const handleMouseMove = (opt: fabric.IEvent) => {
      if (!isDrawing || !tempShape || !drawStartPoint) return
      const pointer = canvasInstance.getPointer(opt.e)
      updateDragDrawShape(tempShape, drawMode, drawStartPoint, pointer)
    }

    const handleMouseUp = () => {
      if (!isDrawing || !tempShape) return
      finishDragDrawShape(canvasInstance, tempShape, drawMode)
      setIsDrawing(false)
      setTempShape(null)
      setDrawStartPoint(null)
      setDrawMode('none')
      toast.success('形状已创建')
    }

    canvasInstance.on('mouse:down', handleMouseDown)
    canvasInstance.on('mouse:move', handleMouseMove)
    canvasInstance.on('mouse:up', handleMouseUp)

    return () => {
      canvasInstance.off('mouse:down', handleMouseDown)
      canvasInstance.off('mouse:move', handleMouseMove)
      canvasInstance.off('mouse:up', handleMouseUp)
    }
  }, [canvasInstance, drawMode, isDrawing, tempShape, drawStartPoint, toast])

  return (
    <div className="h-screen flex flex-col">
      <Toolbar
        sizes={CANVAS_SIZES}
        currentSize={canvasSize}
        currentBackground={canvasBackground}
        onSizeChange={setCanvasSize}
        onBackgroundChange={setBackgroundColor}
        onOpenExportDialog={() => setIsExportDialogOpen(true)}
        onCopy={handleCopy}
      />
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">素材工具</h2>
          </div>

          <div className="p-4 space-y-2 border-b border-gray-200">
            <button
              onClick={() => handleToolChange('text')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                activeTool === 'text'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.832.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>文字</span>
            </button>
            <button
              onClick={() => handleToolChange('image')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                activeTool === 'image'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>图片</span>
            </button>
            <button
              onClick={() => handleToolChange('shape')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                activeTool === 'shape'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2H7zM21 9h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2v-6a2 2 0 00-2-2z" />
              </svg>
              <span>形状</span>
            </button>
          </div>

          {/* Tool-specific content */}
          {activeTool === 'text' && <TextTab onAddText={handleAddText} />}

          {activeTool === 'image' && <ImageTab onImageUpload={handleImageUpload} />}

          {activeTool === 'shape' && <ShapeTab onShapeCreate={handleShapeCreate} />}
        </div>

        {/* Canvas */}
        <div className="flex-1">
          <Canvas
            width={canvasSize.width}
            height={canvasSize.height}
            backgroundColor={canvasBackground}
            onCanvasReady={handleCanvasReady}
          />
        </div>

        {/* Right Sidebar */}
        <PropertyPanel canvas={canvasInstance} />
      </div>

      {/* 导出设置弹窗 */}
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExport}
      />
    </div>
  )
}
