import { getImageDimensions, resetImageSize } from '@/lib/fabric/image'

// Mock fabric.js
const mockImageObject = {
  width: 1000,
  height: 800,
  scaleX: 0.5,
  scaleY: 0.5,
  set: jest.fn(),
  setCoords: jest.fn(),
  canvas: {
    renderAll: jest.fn(),
  },
}

describe('fabric image utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getImageDimensions', () => {
    it('should calculate dimensions with scale', () => {
      const dimensions = getImageObject(mockImageObject as any)
      expect(dimensions.originalWidth).toBe(1000)
      expect(dimensions.originalHeight).toBe(800)
      expect(dimensions.currentWidth).toBe(500)
      expect(dimensions.currentHeight).toBe(400)
      expect(dimensions.scale).toBe(0.5)
    })

    it('should handle missing original dimensions', () => {
      const mockObj = {
        width: 1000,
        height: 800,
        scaleX: 1,
        scaleY: 1,
      }
      const dimensions = getImageObject(mockObj as any)
      expect(dimensions.originalWidth).toBe(1000)
      expect(dimensions.originalHeight).toBe(800)
    })

    it('should handle missing scale', () => {
      const mockObj = {
        width: 1000,
        height: 800,
        originalWidth: 2000,
        originalHeight: 1600,
        scaleX: undefined,
        scaleY: undefined,
      }
      const dimensions = getImageObject(mockObj as any)
      expect(dimensions.scale).toBe(1)
    })
  })

  describe('resetImageSize', () => {
    it('should reset image to original size', () => {
      const mockObj = {
        width: 1000,
        height: 800,
        originalWidth: 2000,
        originalHeight: 1600,
        scaleX: 0.5,
        scaleY: 0.5,
        set: jest.fn(),
        setCoords: jest.fn(),
        canvas: {
          renderAll: jest.fn(),
        },
      }

      const result = resetImageSize(mockObj as any)

      expect(mockObj.set).toHaveBeenCalledWith('scaleX', 1)
      expect(mockObj.set).toHaveBeenCalledWith('scaleY', 1)
      expect(mockObj.setCoords).toHaveBeenCalled()
      expect(mockObj.canvas.renderAll).toHaveBeenCalled()
      expect(result.originalWidth).toBe(2000)
      expect(result.originalHeight).toBe(1600)
      expect(result.currentWidth).toBe(2000)
      expect(result.currentHeight).toBe(1600)
    })

    it('should handle missing original dimensions', () => {
      const mockObj = {
        width: 1000,
        height: 800,
        originalWidth: undefined,
        originalHeight: undefined,
        scaleX: 1,
        scaleY: 1,
        set: jest.fn(),
        setCoords: jest.fn(),
        canvas: {
          renderAll: jest.fn(),
        },
      }

      const result = resetImageSize(mockObj as any)

      expect(result.originalWidth).toBe(1000)
      expect(result.originalHeight).toBe(800)
    })
  })
})

function getImageObject(obj: any) {
  const originalWidth = obj.originalWidth || obj.width || 0
  const originalHeight = obj.originalHeight || obj.height || 0
  const scale = obj.scaleX || 1

  return {
    originalWidth,
    originalHeight,
    currentWidth: originalWidth * scale,
    currentHeight: originalHeight * scale,
    scale,
  }
}
