import { renderHook, act } from '@testing-library/react'
import { useCanvasStore } from '@/stores/canvasStore'
import { CANVAS_SIZES } from '@/lib/fabric/canvas'

describe('Canvas Store', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCanvasStore())
    expect(result.current.currentSize).toEqual(CANVAS_SIZES[0])
    expect(result.current.backgroundColor).toBe('#ffffff')
  })

  it('should update canvas size', () => {
    const { result } = renderHook(() => useCanvasStore())
    act(() => {
      result.current.setCanvasSize(CANVAS_SIZES[1])
    })
    expect(result.current.currentSize).toEqual(CANVAS_SIZES[1])
    expect(result.current.currentSize.ratio).toBe('1:1')
  })

  it('should update background color', () => {
    const { result } = renderHook(() => useCanvasStore())
    act(() => {
      result.current.setBackgroundColor('#000000')
    })
    expect(result.current.backgroundColor).toBe('#000000')
  })

  it('should handle all canvas sizes', () => {
    const { result } = renderHook(() => useCanvasStore())
    CANVAS_SIZES.forEach((size, index) => {
      act(() => {
        result.current.setCanvasSize(size)
      })
      expect(result.current.currentSize).toEqual(size)
      expect(result.current.currentSize.ratio).toBe(size.ratio)
      expect(result.current.currentSize.width).toBe(size.width)
      expect(result.current.currentSize.height).toBe(size.height)
    })
  })

  it('should handle different background colors', () => {
    const { result } = renderHook(() => useCanvasStore())
    const colors = ['#ffffff', '#000000', '#f0f0f0', '#e0e0e0']

    colors.forEach((color) => {
      act(() => {
        result.current.setBackgroundColor(color)
      })
      expect(result.current.backgroundColor).toBe(color)
    })
  })
})
