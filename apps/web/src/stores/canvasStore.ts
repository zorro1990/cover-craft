import { create } from 'zustand'
import type { CanvasSize } from '@cover-craft/shared-types'
import { CANVAS_SIZES } from '@/lib/fabric/canvas'

interface CanvasState {
  currentSize: CanvasSize
  backgroundColor: string
  setCanvasSize: (size: CanvasSize) => void
  setBackgroundColor: (color: string) => void
}

export const useCanvasStore = create<CanvasState>((set) => ({
  currentSize: CANVAS_SIZES[0], // Default to 3:4
  backgroundColor: '#ffffff',
  setCanvasSize: (size) => set({ currentSize: size }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
}))
