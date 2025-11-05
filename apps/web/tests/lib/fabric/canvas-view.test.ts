import { setCanvasZoom, resetCanvasView, panCanvas } from '@/lib/fabric/canvas'

describe('canvas view operations', () => {
  const viewportTransform: number[] = [1, 0, 0, 1, 0, 0]

  const mockCanvas = {
    setZoom: jest.fn(),
    setViewportTransform: jest.fn(),
    getZoom: jest.fn().mockReturnValue(1),
    getWidth: jest.fn().mockReturnValue(1080),
    getHeight: jest.fn().mockReturnValue(1440),
    renderAll: jest.fn(),
    requestRenderAll: jest.fn(),
    viewportTransform,
    zoomToPoint: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset viewport transform
    viewportTransform[0] = 1
    viewportTransform[1] = 0
    viewportTransform[2] = 0
    viewportTransform[3] = 1
    viewportTransform[4] = 0
    viewportTransform[5] = 0
  })

  describe('setCanvasZoom', () => {
    it('should set zoom level', () => {
      setCanvasZoom(mockCanvas as any, 1.5)

      expect(mockCanvas.setZoom).toHaveBeenCalledWith(1.5)
      expect(mockCanvas.requestRenderAll).toHaveBeenCalled()
    })

    it('should clamp zoom to min 0.1', () => {
      setCanvasZoom(mockCanvas as any, 0.05)

      expect(mockCanvas.setZoom).toHaveBeenCalledWith(0.1)
    })

    it('should clamp zoom to max 5', () => {
      setCanvasZoom(mockCanvas as any, 10)

      expect(mockCanvas.setZoom).toHaveBeenCalledWith(5)
    })

    it('should zoom to specific point', () => {
      setCanvasZoom(mockCanvas as any, 2, { x: 100, y: 100 })

      expect(mockCanvas.zoomToPoint).toHaveBeenCalled()
      expect(mockCanvas.requestRenderAll).toHaveBeenCalled()
    })

    it('should handle null canvas', () => {
      expect(() => setCanvasZoom(null, 1.5)).not.toThrow()
    })
  })

  describe('resetCanvasView', () => {
    it('should reset zoom to 1 and center viewport', () => {
      resetCanvasView(mockCanvas as any)

      expect(mockCanvas.setViewportTransform).toHaveBeenCalledWith([1, 0, 0, 1, 0, 0])
      expect(mockCanvas.requestRenderAll).toHaveBeenCalled()
    })

    it('should handle null canvas', () => {
      expect(() => resetCanvasView(null)).not.toThrow()
    })
  })

  describe('panCanvas', () => {
    it('should pan canvas by delta', () => {
      panCanvas(mockCanvas as any, 50, 30)

      expect(viewportTransform[4]).toBe(50) // deltaX
      expect(viewportTransform[5]).toBe(30) // deltaY
      expect(mockCanvas.requestRenderAll).toHaveBeenCalled()
    })

    it('should handle null canvas', () => {
      expect(() => panCanvas(null, 10, 10)).not.toThrow()
    })
  })
})
