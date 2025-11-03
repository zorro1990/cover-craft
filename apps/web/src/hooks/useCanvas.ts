'use client'

import { useState } from 'react'
import { fabric } from 'fabric'
import { createTextObject } from '@/lib/fabric/objects'

export function useCanvas() {
  const [canvas, setCanvasState] = useState<fabric.Canvas | null>(null)

  const addText = (options: any = {}) => {
    if (!canvas) {
      console.error('Canvas not initialized')
      return
    }

    try {
      createTextObject(canvas, options)
    } catch (error) {
      console.error('Failed to add text:', error)
    }
  }

  const setCanvas = (canvas: fabric.Canvas) => {
    setCanvasState(canvas)
  }

  return {
    canvas,
    setCanvas,
    addText,
  }
}
