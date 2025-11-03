import { renderHook, act } from '@testing-library/react'
import { useCanvas } from '@/hooks/useCanvas'
import { createTextObject } from '@/lib/fabric/objects'

// Mock fabric.js
jest.mock('fabric', () => ({
  Canvas: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    renderAll: jest.fn(),
    getWidth: () => 1080,
    getHeight: () => 1440,
    setActiveObject: jest.fn(),
    discardActiveObject: jest.fn(),
    getActiveObject: jest.fn(),
  })),
  Text: jest.fn().mockImplementation(function (text: string, props: any) {
    return {
      type: 'text',
      text,
      left: props.left || 0,
      top: props.top || 0,
      fontSize: props.fontSize || 24,
      fontFamily: props.fontFamily || 'Arial',
      fill: props.fill || '#000000',
      set: jest.fn(),
      setCoords: jest.fn(),
      get: (key: string) => {
        const defaults: Record<string, any> = {
          text: text,
          left: props.left || 0,
          top: props.top || 0,
          fontSize: props.fontSize || 24,
          fontFamily: props.fontFamily || 'Arial',
          fill: props.fill || '#000000',
        }
        return defaults[key]
      },
    }
  }),
}))

describe('useCanvas', () => {
  it('should initialize canvas reference', () => {
    const { result } = renderHook(() => useCanvas())
    expect(result.current.canvas).toBeNull()
  })

  it('should set canvas reference', () => {
    const { result } = renderHook(() => useCanvas())

    act(() => {
      result.current.setCanvas({} as any)
    })

    expect(result.current.canvas).toBeTruthy()
  })

  it('should add text object', () => {
    const { result } = renderHook(() => useCanvas())

    act(() => {
      result.current.setCanvas({
        add: jest.fn(),
        setActiveObject: jest.fn(),
        renderAll: jest.fn(),
        getWidth: () => 1080,
        getHeight: () => 1440,
      } as any)
    })

    act(() => {
      result.current.addText({
        text: 'Test Text',
        fontSize: 24,
        fontFamily: 'Arial',
        fill: '#000000',
      })
    })

    expect(result.current.canvas).toBeTruthy()
  })

  it('should handle addText with default values', () => {
    const { result } = renderHook(() => useCanvas())

    act(() => {
      result.current.setCanvas({
        add: jest.fn(),
        setActiveObject: jest.fn(),
        renderAll: jest.fn(),
        getWidth: () => 1080,
        getHeight: () => 1440,
      } as any)
    })

    act(() => {
      result.current.addText()
    })

    expect(result.current.canvas).toBeTruthy()
  })
})
