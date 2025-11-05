import { fabric } from 'fabric'

export interface TextShadow {
  color: string
  blur: number
  offsetX: number
  offsetY: number
}

export interface GradientFill {
  type: 'linear' | 'radial'
  colorStops: Array<{
    offset: number
    color: string
  }>
  coords?: {
    x1?: number
    y1?: number
    x2?: number
    y2?: number
  }
}

export interface TextOutline {
  color: string
  width: number
}

export interface TextFormattingOptions {
  underline?: boolean
  linethrough?: boolean
  shadow?: TextShadow | string | fabric.Shadow | undefined
  gradient?: GradientFill | null
  outline?: TextOutline | null
}

/**
 * Create a text object
 */
export function createText(
  canvas: fabric.Canvas,
  options: {
    text?: string
    left?: number
    top?: number
    fontSize?: number
    fontFamily?: string
    fill?: string
    fontWeight?: string | number
    fontStyle?: 'normal' | 'italic' | 'oblique'
    textAlign?: string
  } = {}
): fabric.Text {
  const text = new fabric.Text(options.text || '双击编辑文字', {
    left: options.left ?? 100,
    top: options.top ?? 100,
    fontSize: options.fontSize ?? 24,
    fontFamily: options.fontFamily ?? 'Arial',
    fill: options.fill ?? '#000000',
    fontWeight: options.fontWeight ?? 'normal',
    fontStyle: options.fontStyle ?? 'normal',
    textAlign: options.textAlign ?? 'left',
    selectable: true,
  })

  canvas.add(text)
  canvas.setActiveObject(text)
  canvas.renderAll()

  return text
}

/**
 * Apply formatting to text object
 */
export function applyTextFormatting(
  textObject: fabric.Text,
  formatting: TextFormattingOptions
) {
  if (formatting.underline !== undefined) {
    textObject.set('underline', formatting.underline)
  }

  if (formatting.linethrough !== undefined) {
    textObject.set('linethrough', formatting.linethrough)
  }

  if (formatting.shadow !== undefined) {
    setTextShadow(textObject, formatting.shadow)
  }

  textObject.setCoords()
}

/**
 * Remove formatting from text object
 */
export function removeTextFormatting(
  textObject: fabric.Text,
  formatting: Partial<TextFormattingOptions>
) {
  if (formatting.underline !== undefined) {
    textObject.set('underline', false)
  }

  if (formatting.linethrough !== undefined) {
    textObject.set('linethrough', false)
  }

  if (formatting.shadow !== undefined) {
    removeTextShadow(textObject)
  }

  textObject.setCoords()
}

/**
 * Get text formatting from object
 */
export function getTextFormatting(textObject: fabric.Text): TextFormattingOptions {
  return {
    underline: textObject.underline || false,
    linethrough: textObject.linethrough || false,
    shadow: textObject.shadow || undefined,
  }
}

/**
 * Toggle underline
 */
export function toggleUnderline(textObject: fabric.Text) {
  const current = textObject.underline || false
  textObject.set('underline', !current)
  textObject.setCoords()
  return !current
}

/**
 * Toggle strikethrough
 */
export function toggleLinethrough(textObject: fabric.Text) {
  const current = textObject.linethrough || false
  textObject.set('linethrough', !current)
  textObject.setCoords()
  return !current
}

/**
 * Set text shadow
 */
export function setTextShadow(
  textObject: fabric.Text,
  shadow: TextShadow | string | fabric.Shadow | null | undefined
) {
  if (!shadow) {
    textObject.set('shadow', undefined)
  } else if (typeof shadow === 'string') {
    // Handle string shadow
    textObject.set('shadow', shadow)
  } else if ('color' in shadow && 'blur' in shadow && 'offsetX' in shadow && 'offsetY' in shadow) {
    // Handle TextShadow object
    // @ts-ignore - fabric.Shadow constructor
    const fabricShadow = new fabric.Shadow({
      color: shadow.color,
      blur: shadow.blur,
      offsetX: shadow.offsetX,
      offsetY: shadow.offsetY,
    })
    textObject.set('shadow', fabricShadow)
  } else {
    // Handle fabric.Shadow object
    textObject.set('shadow', shadow)
  }
  textObject.setCoords()
}

/**
 * Remove text shadow
 */
export function removeTextShadow(textObject: fabric.Text) {
  textObject.set('shadow', undefined)
  textObject.setCoords()
}

/**
 * Set text gradient
 */
export function setTextGradient(
  textObject: fabric.Text,
  gradient: GradientFill | null
) {
  if (!gradient) {
    textObject.set('fill', textObject.fill || '#000000')
    textObject.setCoords()
    return
  }

  const gradientObject = new fabric.Gradient({
    type: gradient.type,
    coords: gradient.coords || { x1: 0, y1: 0, x2: textObject.width || 0, y2: 0 },
    colorStops: gradient.colorStops,
  })

  textObject.set('fill', gradientObject)
  textObject.setCoords()
}

/**
 * Remove text gradient
 */
export function removeTextGradient(textObject: fabric.Text) {
  textObject.set('fill', '#000000')
  textObject.setCoords()
}

/**
 * Set text outline
 */
export function setTextOutline(
  textObject: fabric.Text,
  outline: TextOutline | null
) {
  if (!outline) {
    textObject.set('stroke', undefined)
    textObject.set('strokeWidth', 0)
    textObject.setCoords()
    return
  }

  textObject.set('stroke', outline.color)
  textObject.set('strokeWidth', outline.width)
  textObject.setCoords()
}

/**
 * Remove text outline
 */
export function removeTextOutline(textObject: fabric.Text) {
  textObject.set('stroke', undefined)
  textObject.set('strokeWidth', 0)
  textObject.setCoords()
}

/**
 * Toggle gradient
 */
export function toggleGradient(textObject: fabric.Text) {
  if (textObject.fill && typeof textObject.fill === 'object') {
    removeTextGradient(textObject)
    return false
  } else {
    const gradient: GradientFill = {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#ff0000' },
        { offset: 1, color: '#0000ff' },
      ],
      coords: { x1: 0, y1: 0, x2: textObject.width || 0, y2: 0 },
    }
    setTextGradient(textObject, gradient)
    return true
  }
}

/**
 * Toggle outline
 */
export function toggleOutline(textObject: fabric.Text) {
  if (textObject.stroke) {
    removeTextOutline(textObject)
    return false
  } else {
    const outline: TextOutline = {
      color: '#000000',
      width: 2,
    }
    setTextOutline(textObject, outline)
    return true
  }
}
