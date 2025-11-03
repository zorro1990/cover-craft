import { fabric } from 'fabric'

export interface ShapeOptions {
  left?: number
  top?: number
  width?: number
  height?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  opacity?: number
}

/**
 * Create a rectangle shape
 */
export function createRectangle(
  canvas: fabric.Canvas,
  options: ShapeOptions = {}
): fabric.Rect {
  const rect = new fabric.Rect({
    left: options.left ?? 100,
    top: options.top ?? 100,
    width: options.width ?? 200,
    height: options.height ?? 150,
    fill: options.fill ?? '#3b82f6',
    stroke: options.stroke ?? '#1e40af',
    strokeWidth: options.strokeWidth ?? 2,
    opacity: options.opacity ?? 1,
    selectable: true,
  })

  canvas.add(rect)
  canvas.setActiveObject(rect)
  canvas.renderAll()

  return rect
}

/**
 * Create a circle shape
 */
export function createCircle(
  canvas: fabric.Canvas,
  options: ShapeOptions = {}
): fabric.Circle {
  const circle = new fabric.Circle({
    left: options.left ?? 100,
    top: options.top ?? 100,
    radius: options.width ? options.width / 2 : 75,
    fill: options.fill ?? '#10b981',
    stroke: options.stroke ?? '#047857',
    strokeWidth: options.strokeWidth ?? 2,
    opacity: options.opacity ?? 1,
    selectable: true,
  })

  canvas.add(circle)
  canvas.setActiveObject(circle)
  canvas.renderAll()

  return circle
}

/**
 * Create a line shape
 */
export function createLine(
  canvas: fabric.Canvas,
  options: ShapeOptions = {}
): fabric.Line {
  const line = new fabric.Line(
    [
      options.left ?? 100,
      options.top ?? 100,
      (options.left ?? 100) + (options.width ?? 200),
      (options.top ?? 100) + (options.height ?? 0),
    ],
    {
      stroke: options.stroke ?? '#6b7280',
      strokeWidth: options.strokeWidth ?? 3,
      opacity: options.opacity ?? 1,
      selectable: true,
    }
  )

  canvas.add(line)
  canvas.setActiveObject(line)
  canvas.renderAll()

  return line
}

/**
 * Get shape dimensions and properties
 */
export function getShapeDimensions(object: fabric.Object) {
  const originalWidth = (object as any).originalWidth || object.width || 0
  const originalHeight = (object as any).originalHeight || object.height || 0
  const scaleX = object.scaleX || 1
  const scaleY = object.scaleY || 1

  return {
    originalWidth,
    originalHeight,
    currentWidth: originalWidth * scaleX,
    currentHeight: originalHeight * scaleY,
    scaleX,
    scaleY,
  }
}

/**
 * Reset shape to original size
 */
export function resetShapeSize(
  object: fabric.Object
): {
  originalWidth: number
  originalHeight: number
  currentWidth: number
  currentHeight: number
} {
  const dimensions = getShapeDimensions(object)

  object.set({
    scaleX: 1,
    scaleY: 1,
  })
  object.setCoords()

  if (object.canvas) {
    object.canvas.renderAll()
  }

  return {
    originalWidth: dimensions.originalWidth,
    originalHeight: dimensions.originalHeight,
    currentWidth: dimensions.originalWidth,
    currentHeight: dimensions.originalHeight,
  }
}

/**
 * Flip shape horizontally
 */
export function flipShapeHorizontal(object: fabric.Object) {
  object.set('flipX', !object.flipX)
  object.setCoords()

  if (object.canvas) {
    object.canvas.renderAll()
  }
}

/**
 * Flip shape vertically
 */
export function flipShapeVertical(object: fabric.Object) {
  object.set('flipY', !object.flipY)
  object.setCoords()

  if (object.canvas) {
    object.canvas.renderAll()
  }
}

/**
 * Get shape type name for display
 */
export function getShapeTypeName(type: string): string {
  const typeMap: Record<string, string> = {
    rect: '矩形',
    circle: '圆形',
    line: '直线',
  }

  return typeMap[type] || type
}
