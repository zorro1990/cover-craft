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
  })

  it('should update background color', () => {
    const { result } = renderHook(() => useCanvasStore())
    act(() => {
      result.current.setBackgroundColor('#000000')
    })
    expect(result.current.backgroundColor).toBe('#000000')
  })
})
