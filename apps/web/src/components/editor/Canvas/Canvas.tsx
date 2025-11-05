'use client'

import { useEffect, useRef } from 'react'
import { fabric } from 'fabric'
import { logger } from '@/lib/utils/logger'
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

      return () => {
        canvas.dispose()
      }
    } catch (error) {
      logger.error('Failed to initialize canvas')
    }
  }, [onCanvasReady])

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
