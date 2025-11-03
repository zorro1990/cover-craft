import { fabric } from 'fabric'
import type { TextObject } from '@cover-craft/shared-types'

export function createTextObject(
  canvas: fabric.Canvas,
  options: {
    text?: string
    left?: number
    top?: number
    fontSize?: number
    fontFamily?: string
    fill?: string
  } = {}
): fabric.Text {
  const {
    text = '双击编辑文字',
    left = canvas.getWidth() / 2,
    top = canvas.getHeight() / 2,
    fontSize = 24,
    fontFamily = 'Arial',
    fill = '#000000',
  } = options

  const textObject = new fabric.Text(text, {
    left,
    top,
    fontSize,
    fontFamily,
    fill,
    originX: 'center',
    originY: 'center',
  })

  canvas.add(textObject)
  canvas.setActiveObject(textObject)
  canvas.renderAll()

  return textObject
}

export function updateTextObject(
  textObject: fabric.Text,
  updates: {
    text?: string
    fontSize?: number
    fontFamily?: string
    fontWeight?: string | number
    fontStyle?: string
    fill?: string
    backgroundColor?: string
  }
) {
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      // @ts-ignore - dynamic property
      textObject.set(key, value)
    }
  })
  textObject.setCoords()
  textObject.canvas?.renderAll()
}

export function deleteSelectedObject(canvas: fabric.Canvas) {
  const activeObject = canvas.getActiveObject()
  if (activeObject) {
    canvas.remove(activeObject)
    canvas.discardActiveObject()
    canvas.renderAll()
  }
}

export function getTextObjects(canvas: fabric.Canvas): fabric.Text[] {
  return canvas.getObjects().filter((obj) => obj.type === 'text') as fabric.Text[]
}

export function cloneObject(canvas: fabric.Canvas, object: fabric.Object): fabric.Object {
  object.clone((cloned: fabric.Object) => {
    cloned.set({
      left: (object.left || 0) + 20,
      top: (object.top || 0) + 20,
    })
    canvas.add(cloned)
    canvas.setActiveObject(cloned)
    canvas.renderAll()
  })
  return object
}

export function bringToFront(canvas: fabric.Canvas, object: fabric.Object) {
  object.bringToFront()
  canvas.renderAll()
}

export function sendToBack(canvas: fabric.Canvas, object: fabric.Object) {
  object.sendToBack()
  canvas.renderAll()
}

export function duplicateObject(canvas: fabric.Canvas, object: fabric.Object) {
  object.clone((cloned: fabric.Object) => {
    cloned.set({
      left: (object.left || 0) + 20,
      top: (object.top || 0) + 20,
    })
    canvas.add(cloned)
    canvas.setActiveObject(cloned)
    canvas.renderAll()
  })
}
