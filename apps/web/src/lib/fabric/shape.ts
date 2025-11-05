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

/**
 * 开始拖拽绘制形状
 * @param canvas Fabric.js Canvas 实例
 * @param type 形状类型
 * @param startPoint 起始点
 * @returns 临时形状对象
 */
export function startDragDrawShape(
  canvas: fabric.Canvas,
  type: 'rectangle' | 'circle' | 'line',
  startPoint: { x: number; y: number }
): fabric.Object | null {
  let shape: fabric.Object | null = null

  switch (type) {
    case 'rectangle':
      shape = new fabric.Rect({
        left: startPoint.x,
        top: startPoint.y,
        width: 0,
        height: 0,
        fill: 'rgba(59, 130, 246, 0.3)',
        stroke: '#3b82f6',
        strokeWidth: 2,
        selectable: false,
      })
      break

    case 'circle':
      shape = new fabric.Circle({
        left: startPoint.x,
        top: startPoint.y,
        radius: 0,
        fill: 'rgba(59, 130, 246, 0.3)',
        stroke: '#3b82f6',
        strokeWidth: 2,
        selectable: false,
      })
      break

    case 'line':
      shape = new fabric.Line([startPoint.x, startPoint.y, startPoint.x, startPoint.y], {
        stroke: '#3b82f6',
        strokeWidth: 2,
        selectable: false,
      })
      break
  }

  if (shape) {
    canvas.add(shape)
    canvas.requestRenderAll()
  }

  return shape
}

/**
 * 更新拖拽绘制中的形状
 * @param shape 形状对象
 * @param type 形状类型
 * @param startPoint 起始点
 * @param currentPoint 当前点
 */
export function updateDragDrawShape(
  shape: fabric.Object,
  type: 'rectangle' | 'circle' | 'line',
  startPoint: { x: number; y: number },
  currentPoint: { x: number; y: number }
) {
  switch (type) {
    case 'rectangle': {
      const rect = shape as fabric.Rect
      const width = currentPoint.x - startPoint.x
      const height = currentPoint.y - startPoint.y
      rect.set({
        width: Math.abs(width),
        height: Math.abs(height),
        left: width > 0 ? startPoint.x : currentPoint.x,
        top: height > 0 ? startPoint.y : currentPoint.y,
      })
      break
    }

    case 'circle': {
      const circle = shape as fabric.Circle
      const radius = Math.sqrt(
        Math.pow(currentPoint.x - startPoint.x, 2) +
        Math.pow(currentPoint.y - startPoint.y, 2)
      )
      circle.set({ radius })
      break
    }

    case 'line': {
      const line = shape as fabric.Line
      line.set({
        x2: currentPoint.x,
        y2: currentPoint.y,
      })
      break
    }
  }

  shape.canvas?.requestRenderAll()
}

/**
 * 完成拖拽绘制，固定形状
 * @param canvas Fabric.js Canvas 实例
 * @param shape 临时形状对象
 * @param type 形状类型
 */
export function finishDragDrawShape(
  canvas: fabric.Canvas,
  shape: fabric.Object,
  type: 'rectangle' | 'circle' | 'line'
) {
  // 移除临时形状
  canvas.remove(shape)

  // 创建最终形状（使用默认样式）
  const finalShape = createShapeByType(canvas, type, {
    left: shape.left,
    top: shape.top,
    ...(type === 'rectangle' && { width: (shape as fabric.Rect).width, height: (shape as fabric.Rect).height }),
    ...(type === 'circle' && { radius: (shape as fabric.Circle).radius }),
    ...(type === 'line' && {
      x1: (shape as fabric.Line).x1,
      y1: (shape as fabric.Line).y1,
      x2: (shape as fabric.Line).x2,
      y2: (shape as fabric.Line).y2,
    }),
  })

  canvas.setActiveObject(finalShape)
  canvas.requestRenderAll()
}

/**
 * 根据类型创建形状（内部辅助函数）
 */
function createShapeByType(
  canvas: fabric.Canvas,
  type: 'rectangle' | 'circle' | 'line',
  options: any
): fabric.Object {
  switch (type) {
    case 'rectangle':
      return createRectangle(canvas, options)
    case 'circle':
      return createCircle(canvas, options)
    case 'line':
      return createLine(canvas, options)
  }
}
