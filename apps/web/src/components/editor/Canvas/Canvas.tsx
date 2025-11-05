'use client'

import { useEffect, useRef } from 'react'
import { fabric } from 'fabric'
import { logger } from '@/lib/utils/logger'
import { setCanvasZoom, panCanvas } from '@/lib/fabric/canvas'
import type { CanvasSize } from '@cover-craft/shared-types'

interface CanvasProps {
  width?: number
  height?: number
  backgroundColor?: string
  onCanvasReady?: (canvas: fabric.Canvas) => void
}

export function Canvas({
  width = 1080,
  height = 1440,
  backgroundColor = '#ffffff',
  onCanvasReady,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null)

  // Ensure we have valid dimensions
  const safeWidth = width || 1080
  const safeHeight = height || 1440
  const safeBackgroundColor = backgroundColor || '#ffffff'

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return

    try {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: safeWidth,
        height: safeHeight,
        backgroundColor: safeBackgroundColor,
        selection: true,
      })

      canvasInstanceRef.current = canvas

      if (onCanvasReady) {
        onCanvasReady(canvas)
      }

      // ========== 新增：缩放与拖拽事件监听 ==========

      // 鼠标滚轮缩放
      canvas.on('mouse:wheel', (opt) => {
        const delta = opt.e.deltaY
        let zoom = canvas.getZoom()
        zoom *= 0.999 ** delta
        setCanvasZoom(canvas, zoom, { x: opt.e.offsetX, y: opt.e.offsetY })
        opt.e.preventDefault()
        opt.e.stopPropagation()
      })

      // 按住空格键拖拽画布
      let isPanning = false
      let lastPosX = 0
      let lastPosY = 0

      canvas.on('mouse:down', (opt) => {
        const evt = opt.e as MouseEvent
        if (evt.spaceKey || evt.button === 1) { // 空格键或中键
          isPanning = true
          canvas.selection = false
          lastPosX = evt.clientX
          lastPosY = evt.clientY
        }
      })

      canvas.on('mouse:move', (opt) => {
        if (isPanning) {
          const evt = opt.e as MouseEvent
          const deltaX = evt.clientX - lastPosX
          const deltaY = evt.clientY - lastPosY
          panCanvas(canvas, deltaX, deltaY)
          lastPosX = evt.clientX
          lastPosY = evt.clientY
        }
      })

      canvas.on('mouse:up', () => {
        if (isPanning) {
          isPanning = false
          canvas.selection = true
        }
      })

      // ========== 新增结束 ==========

      return () => {
        canvas.dispose()
      }
    } catch (error) {
      logger.error('Failed to initialize canvas')
    }
  }, [onCanvasReady])

  // ========== 新增：空格键监听 ==========
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        ;(e as any).spaceKey = true
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        ;(e as any).spaceKey = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-100">
      <canvas
        ref={canvasRef}
        width={safeWidth}
        height={safeHeight}
        style={{ border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
      />
    </div>
  )
}
