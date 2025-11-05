'use client'

import { useState } from 'react'
import { fabric } from 'fabric'
import { logger } from '@/lib/utils/logger'
import { createTextObject } from '@/lib/fabric/objects'

export function useCanvas() {
  const [canvas, setCanvasState] = useState<fabric.Canvas | null>(null)

  const addText = (options: any = {}) => {
    if (!canvas) {
      logger.warn('Canvas not initialized')
      return
    }

    try {
      createTextObject(canvas, options)
    } catch (error) {
      logger.error('Failed to add text')
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
