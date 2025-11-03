export interface CanvasSize {
  width: number
  height: number
  label: string
  ratio: string
}

export interface CanvasConfig {
  size: CanvasSize
  backgroundColor: string
}

export interface FabricObject {
  id: string
  type: 'text' | 'image' | 'rect' | 'circle' | 'line'
  left: number
  top: number
  width: number
  height: number
  angle: number
  scaleX: number
  scaleY: number
  opacity: number
}

export interface TextObject extends FabricObject {
  type: 'text'
  text: string
  fontSize: number
  fontFamily: string
  fontWeight?: string | number
  fontStyle?: string
  fill: string
  backgroundColor?: string
}

export interface ImageObject extends FabricObject {
  type: 'image'
  src: string
  originalWidth?: number
  originalHeight?: number
}

export interface ShapeObject extends FabricObject {
  type: 'rect' | 'circle' | 'line'
  fill?: string
  stroke?: string
  strokeWidth?: number
  rx?: number
  ry?: number
}

export type AnyFabricObject = TextObject | ImageObject | ShapeObject
