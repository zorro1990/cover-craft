import { fabric } from 'fabric'
import { logger } from '@/lib/utils/logger'
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
  if (!canvas) {
    logger.warn('Canvas is not initialized')
    return
  }

  if (
    !size ||
    typeof size.width !== 'number' ||
    typeof size.height !== 'number'
  ) {
    logger.warn('Invalid canvas size provided to resizeCanvas')
    return
  }

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
  if (!canvas) {
    logger.warn('Canvas is not initialized')
    return
  }

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
  if (!canvas) {
    logger.warn('Canvas is not initialized')
    return ''
  }

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
  if (!canvas) {
    logger.warn('Canvas is not initialized')
    return
  }

  const dataUrl = exportCanvas(canvas, { format })
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 设置画布缩放级别
 * @param canvas Fabric.js Canvas 实例
 * @param zoom 缩放级别（1 = 100%）
 * @param point 缩放中心点（可选，默认为画布中心）
 */
export function setCanvasZoom(
  canvas: fabric.Canvas | null,
  zoom: number,
  point?: { x: number; y: number }
) {
  if (!canvas) {
    logger.warn('Canvas is not initialized')
    return
  }

  // 限制缩放范围 0.1x - 5x
  const clampedZoom = Math.max(0.1, Math.min(5, zoom))

  if (point) {
    canvas.zoomToPoint(new fabric.Point(point.x, point.y), clampedZoom)
  } else {
    canvas.setZoom(clampedZoom)
  }

  canvas.requestRenderAll()
}

/**
 * 重置画布视图（100% 缩放，居中）
 * @param canvas Fabric.js Canvas 实例
 */
export function resetCanvasView(canvas: fabric.Canvas | null) {
  if (!canvas) {
    logger.warn('Canvas is not initialized')
    return
  }

  canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
  canvas.requestRenderAll()
}

/**
 * 平移画布视图
 * @param canvas Fabric.js Canvas 实例
 * @param deltaX X 轴偏移量
 * @param deltaY Y 轴偏移量
 */
export function panCanvas(
  canvas: fabric.Canvas | null,
  deltaX: number,
  deltaY: number
) {
  if (!canvas) {
    logger.warn('Canvas is not initialized')
    return
  }

  const vpt = canvas.viewportTransform
  if (vpt) {
    vpt[4] += deltaX
    vpt[5] += deltaY
    canvas.requestRenderAll()
  }
}

/**
 * 导出画布为图片（支持倍率和透明背景）
 * @param canvas Fabric.js Canvas 实例
 * @param options 导出选项
 * @returns DataURL 字符串
 */
export function exportCanvasImage(
  canvas: fabric.Canvas | null,
  options: {
    format?: 'png' | 'jpeg'
    quality?: number // 1x, 2x, 3x
    transparent?: boolean
  } = {}
): string | null {
  if (!canvas) {
    logger.warn('Canvas is not initialized')
    return null
  }

  const { format = 'png', quality = 1, transparent = false } = options

  // 保存原始背景色
  const originalBgColor = canvas.backgroundColor

  // 如果需要透明背景，临时移除背景色
  if (transparent && format === 'png') {
    canvas.backgroundColor = ''
  }

  // 导出图片
  const dataURL = canvas.toDataURL({
    format: format === 'jpeg' ? 'jpeg' : 'png',
    quality: 1, // Fabric.js 的 quality 参数（0-1）
    multiplier: quality, // 倍率
  })

  // 恢复原始背景色
  if (transparent && format === 'png') {
    canvas.backgroundColor = originalBgColor
    canvas.requestRenderAll()
  }

  return dataURL
}

/**
 * 下载画布为图片文件
 * @param canvas Fabric.js Canvas 实例
 * @param options 导出选项
 */
export function downloadCanvasImage(
  canvas: fabric.Canvas | null,
  options: {
    format?: 'png' | 'jpeg'
    quality?: number
    transparent?: boolean
    filename?: string
  } = {}
) {
  const dataURL = exportCanvasImage(canvas, options)
  if (!dataURL) return

  const { format = 'png', filename } = options

  // 生成文件名：cover-YYYYMMDD-HHMMSS.png
  const now = new Date()
  const timestamp = now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '-')
    .slice(0, 15)
  const defaultFilename = `cover-${timestamp}.${format}`

  // 创建下载链接
  const link = document.createElement('a')
  link.download = filename || defaultFilename
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
