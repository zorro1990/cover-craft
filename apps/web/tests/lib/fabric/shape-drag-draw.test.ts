import {
  startDragDrawShape,
  updateDragDrawShape,
  finishDragDrawShape,
} from '@/lib/fabric/shape'

describe('shape drag-to-draw', () => {
  const mockCanvas = {
    add: jest.fn(),
    remove: jest.fn(),
    setActiveObject: jest.fn(),
    renderAll: jest.fn(),
    requestRenderAll: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('startDragDrawShape', () => {
    it('should create temporary rectangle', () => {
      const shape = startDragDrawShape(
        mockCanvas as any,
        'rectangle',
        { x: 100, y: 100 }
      )

      expect(mockCanvas.add).toHaveBeenCalled()
      expect(mockCanvas.requestRenderAll).toHaveBeenCalled()
      expect(shape).toBeTruthy()
      expect(shape?.type).toBe('rect')
    })

    it('should create temporary circle', () => {
      const shape = startDragDrawShape(
        mockCanvas as any,
        'circle',
        { x: 100, y: 100 }
      )

      expect(shape?.type).toBe('circle')
    })

    it('should create temporary line', () => {
      const shape = startDragDrawShape(
        mockCanvas as any,
        'line',
        { x: 100, y: 100 }
      )

      expect(shape?.type).toBe('line')
    })
  })

  describe('updateDragDrawShape', () => {
    it('should update rectangle dimensions', () => {
      const mockRect = {
        type: 'rect',
        set: jest.fn(),
        canvas: mockCanvas,
      }

      updateDragDrawShape(
        mockRect as any,
        'rectangle',
        { x: 100, y: 100 },
        { x: 200, y: 200 }
      )

      expect(mockRect.set).toHaveBeenCalled()
      expect(mockCanvas.requestRenderAll).toHaveBeenCalled()
    })
  })

  describe('finishDragDrawShape', () => {
    it('should finalize shape and make it selectable', () => {
      const mockShape = {
        left: 100,
        top: 100,
      }

      finishDragDrawShape(mockCanvas as any, mockShape as any, 'rectangle')

      expect(mockCanvas.remove).toHaveBeenCalledWith(mockShape)
      expect(mockCanvas.setActiveObject).toHaveBeenCalled()
      expect(mockCanvas.requestRenderAll).toHaveBeenCalled()
    })
  })
})
