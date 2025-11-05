import { createTextObject, updateTextObject, deleteSelectedObject } from '@/lib/fabric/objects'

// Mock fabric.js
const mockCanvas = {
  add: jest.fn(),
  remove: jest.fn(),
  renderAll: jest.fn(),
  setActiveObject: jest.fn(),
  discardActiveObject: jest.fn(),
  getActiveObject: jest.fn(),
  getWidth: () => 1080,
  getHeight: () => 1440,
}

jest.mock('fabric', () => ({
  fabric: {
    Canvas: jest.fn().mockImplementation(() => mockCanvas),
    Text: jest.fn().mockImplementation(function (this: any, text: string, props: any) {
      Object.assign(this, {
        type: 'text',
        text,
        left: props.left || 0,
        top: props.top || 0,
        fontSize: props.fontSize || 24,
        fontFamily: props.fontFamily || 'Arial',
        fill: props.fill || '#000000',
        originX: props.originX || 'left',
        originY: props.originY || 'top',
        set: jest.fn(),
        setCoords: jest.fn(),
      })
      return this
    }),
  },
}))

describe('fabric objects', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createTextObject', () => {
    it('should create text object with default values', () => {
      createTextObject(mockCanvas as any, {})
      expect(mockCanvas.add).toHaveBeenCalled()
      expect(mockCanvas.setActiveObject).toHaveBeenCalled()
      expect(mockCanvas.renderAll).toHaveBeenCalled()
    })

    it('should create text object with custom values', () => {
      createTextObject(mockCanvas as any, {
        text: 'Custom Text',
        fontSize: 32,
        fontFamily: 'Arial',
        fill: '#ffffff',
      })
      expect(mockCanvas.add).toHaveBeenCalled()
    })

    it('should position text at canvas center', () => {
      createTextObject(mockCanvas as any, {})
      expect(mockCanvas.add).toHaveBeenCalledWith(
        expect.objectContaining({
          left: 540,
          top: 720,
        })
      )
    })
  })

  describe('updateTextObject', () => {
    it('should update text properties', () => {
      const textObject = {
        set: jest.fn(),
        setCoords: jest.fn(),
        canvas: mockCanvas,
      } as any

      updateTextObject(textObject, {
        text: 'Updated Text',
        fontSize: 48,
        fill: '#ff0000',
      })

      expect(textObject.set).toHaveBeenCalledWith('text', 'Updated Text')
      expect(textObject.set).toHaveBeenCalledWith('fontSize', 48)
      expect(textObject.set).toHaveBeenCalledWith('fill', '#ff0000')
      expect(textObject.setCoords).toHaveBeenCalled()
    })

    it('should only update provided properties', () => {
      const textObject = {
        set: jest.fn(),
        setCoords: jest.fn(),
        canvas: mockCanvas,
      } as any

      updateTextObject(textObject, {
        text: 'Updated',
      })

      expect(textObject.set).toHaveBeenCalledTimes(1)
      expect(textObject.set).toHaveBeenCalledWith('text', 'Updated')
    })
  })

  describe('deleteSelectedObject', () => {
    it('should delete active object', () => {
      const mockActiveObject = { id: 'test' }
      ;(mockCanvas.getActiveObject as jest.Mock) = jest.fn().mockReturnValue(mockActiveObject)

      deleteSelectedObject(mockCanvas as any)

      expect(mockCanvas.remove).toHaveBeenCalledWith(mockActiveObject)
      expect(mockCanvas.discardActiveObject).toHaveBeenCalled()
      expect(mockCanvas.renderAll).toHaveBeenCalled()
    })

    it('should do nothing when no active object', () => {
      ;(mockCanvas.getActiveObject as jest.Mock) = jest.fn().mockReturnValue(null)

      deleteSelectedObject(mockCanvas as any)

      expect(mockCanvas.remove).not.toHaveBeenCalled()
    })
  })
})
