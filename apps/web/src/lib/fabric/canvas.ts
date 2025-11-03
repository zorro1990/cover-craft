import { fabric } from 'fabric'
import type { CanvasConfig, CanvasSize } from '@cover-craft/shared-types'

export const CANVAS_SIZES: CanvasSize[] = [
  { width: 1080, height: 1440, label: '3:4', ratio: '3:4' },
  { width: 1080, height: 1080, label: '1:1', ratio: '1:1' },
  { width: 1080, height: 810, label: '4:3', ratio: '4:3' },
  { width: 1080, height: 462, label: '21:9', ratio: '21:9' },
]

export const DEFAULT_BACKGROUNDS = [
  '#ffffff',
  '#000000',
  '#f0f0f0',
  '#e0e0e0',
  '#d0d0d0',
  '#c0c0c0',
]

export function createCanvas(
  canvasElement: HTMLCanvasElement,
  config: CanvasConfig
): fabric.Canvas {
  const canvas = new fabric.Canvas(canvasElement, {
    width: config.size.width,
    height: config.size.height,
    backgroundColor: config.backgroundColor,
  })

  // Enable object caching for better performance
  // @ts-ignore - objectCaching property
  canvas.objectCaching = true

  // Set default controls
  fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: '#3b82f6',
    cornerStyle: 'circle',
    borderColor: '#3b82f6',
    borderScaleFactor: 2,
  })

  return canvas
}

export function resizeCanvas(
  canvas: fabric.Canvas,
  size: CanvasSize,
  preserveContent: boolean = true
) {
  const oldWidth = canvas.getWidth()
  const oldHeight = canvas.getHeight()

  canvas.setDimensions({
    width: size.width,
    height: size.height,
  })

  if (preserveContent) {
    const scaleX = size.width / oldWidth
    const scaleY = size.height / oldHeight
    const objects = canvas.getObjects()
    objects.forEach((obj) => {
      obj.scaleX = (obj.scaleX || 1) * scaleX
      obj.scaleY = (obj.scaleY || 1) * scaleY
      obj.left = (obj.left || 0) * scaleX
      obj.top = (obj.top || 0) * scaleY
      obj.setCoords()
    })
  }

  canvas.renderAll()
}

export function setCanvasBackground(
  canvas: fabric.Canvas,
  color: string
) {
  canvas.setBackgroundColor(color, () => {
    canvas.renderAll()
  })
}

export function exportCanvas(
  canvas: fabric.Canvas,
  options: {
    format?: 'png' | 'jpg'
    quality?: number
    multiplier?: number
    enableRetinaScaling?: boolean
  } = {}
): string {
  const {
    format = 'png',
    quality = 1,
    multiplier = 1,
    enableRetinaScaling = true,
  } = options

  return canvas.toDataURL({
    format: `image/${format}`,
    quality,
    multiplier,
    enableRetinaScaling,
  })
}

export function copyToClipboard(dataUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard && typeof window.fetch === 'function') {
      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const item = new ClipboardItem({ [blob.type]: blob })
          navigator.clipboard.write([item])
          resolve()
        })
        .catch(reject)
    } else {
      reject(new Error('Clipboard API not supported'))
    }
  })
}

export function downloadCanvas(
  canvas: fabric.Canvas,
  filename: string = `cover-${Date.now()}.png`,
  format: 'png' | 'jpg' = 'png'
) {
  const dataUrl = exportCanvas(canvas, { format })
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
