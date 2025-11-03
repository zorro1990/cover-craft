import {
  getShapeDimensions,
  resetShapeSize,
  flipShapeHorizontal,
  flipShapeVertical,
  getShapeTypeName,
} from '@/lib/fabric/shape'

describe('shape utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getShapeDimensions', () => {
    it('should calculate dimensions with scale', () => {
      const mockObject = {
        width: 1000,
        height: 800,
        scaleX: 0.5,
        scaleY: 0.5,
      }

      const dimensions = getShapeDimensions(mockObject as any)

      expect(dimensions.originalWidth).toBe(1000)
      expect(dimensions.originalHeight).toBe(800)
      expect(dimensions.currentWidth).toBe(500)
      expect(dimensions.currentHeight).toBe(400)
      expect(dimensions.scaleX).toBe(0.5)
      expect(dimensions.scaleY).toBe(0.5)
    })

    it('should handle missing original dimensions', () => {
      const mockObject = {
        width: 1000,
        height: 800,
        scaleX: 1,
        scaleY: 1,
      }

      const dimensions = getShapeDimensions(mockObject as any)

      expect(dimensions.originalWidth).toBe(1000)
      expect(dimensions.originalHeight).toBe(800)
    })

    it('should handle missing scale', () => {
      const mockObject = {
        width: 1000,
        height: 800,
        originalWidth: 2000,
        originalHeight: 1600,
        scaleX: undefined,
        scaleY: undefined,
      }

      const dimensions = getShapeDimensions(mockObject as any)

      expect(dimensions.scaleX).toBe(1)
      expect(dimensions.scaleY).toBe(1)
    })
  })

  describe('resetShapeSize', () => {
    it('should reset shape to original size', () => {
      const mockObject = {
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

      const result = resetShapeSize(mockObject as any)

      expect(mockObject.set).toHaveBeenCalledWith({
        scaleX: 1,
        scaleY: 1,
      })
      expect(mockObject.setCoords).toHaveBeenCalled()
      expect(mockObject.canvas.renderAll).toHaveBeenCalled()
      expect(result.originalWidth).toBe(2000)
      expect(result.originalHeight).toBe(1600)
      expect(result.currentWidth).toBe(2000)
      expect(result.currentHeight).toBe(1600)
    })

    it('should handle missing original dimensions', () => {
      const mockObject = {
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

      const result = resetShapeSize(mockObject as any)

      expect(result.originalWidth).toBe(1000)
      expect(result.originalHeight).toBe(800)
    })
  })

  describe('flipShapeHorizontal', () => {
    it('should flip shape horizontally', () => {
      const mockObject = {
        flipX: false,
        set: jest.fn(),
        setCoords: jest.fn(),
        canvas: {
          renderAll: jest.fn(),
        },
      }

      flipShapeHorizontal(mockObject as any)

      expect(mockObject.set).toHaveBeenCalledWith('flipX', true)
      expect(mockObject.setCoords).toHaveBeenCalled()
      expect(mockObject.canvas.renderAll).toHaveBeenCalled()
    })
  })

  describe('flipShapeVertical', () => {
    it('should flip shape vertically', () => {
      const mockObject = {
        flipY: false,
        set: jest.fn(),
        setCoords: jest.fn(),
        canvas: {
          renderAll: jest.fn(),
        },
      }

      flipShapeVertical(mockObject as any)

      expect(mockObject.set).toHaveBeenCalledWith('flipY', true)
      expect(mockObject.setCoords).toHaveBeenCalled()
      expect(mockObject.canvas.renderAll).toHaveBeenCalled()
    })
  })

  describe('getShapeTypeName', () => {
    it('should return correct type names', () => {
      expect(getShapeTypeName('rect')).toBe('矩形')
      expect(getShapeTypeName('circle')).toBe('圆形')
      expect(getShapeTypeName('line')).toBe('直线')
    })

    it('should return unknown for unsupported types', () => {
      expect(getShapeTypeName('triangle')).toBe('triangle')
      expect(getShapeTypeName('polygon')).toBe('polygon')
    })
  })
})
