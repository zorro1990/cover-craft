import { CANVAS_SIZES, exportCanvas } from '@/lib/fabric/canvas'

describe('Canvas Utils', () => {
  describe('CANVAS_SIZES', () => {
    it('should have correct number of sizes', () => {
      expect(CANVAS_SIZES).toHaveLength(4)
    })

    it('should have correct size properties', () => {
      const size = CANVAS_SIZES[0]
      expect(size).toHaveProperty('width')
      expect(size).toHaveProperty('height')
      expect(size).toHaveProperty('label')
      expect(size).toHaveProperty('ratio')
    })

    it('should have correct default size', () => {
      const defaultSize = CANVAS_SIZES[0]
      expect(defaultSize.ratio).toBe('3:4')
      expect(defaultSize.width).toBe(1080)
      expect(defaultSize.height).toBe(1440)
    })
  })

  // Note: exportCanvas test would require a real Canvas instance
  // which is complex to mock, so we'll skip it for now
})
