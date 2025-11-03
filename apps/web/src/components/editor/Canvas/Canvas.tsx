'use client'

import { useEffect, useRef } from 'react'
import { fabric } from 'fabric'

interface CanvasProps {
  onCanvasReady?: (canvas: fabric.Canvas) => void
}

export function Canvas({ onCanvasReady }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      selection: true,
    })

    canvasInstanceRef.current = canvas

    console.log('Canvas initialized:', canvas)

    if (onCanvasReady) {
      onCanvasReady(canvas)
    }

    return () => {
      canvas.dispose()
    }
  }, [onCanvasReady])

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-100">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
      />
    </div>
  )
}
