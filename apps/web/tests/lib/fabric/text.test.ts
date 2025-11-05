import {
  createText,
  applyTextFormatting,
  removeTextFormatting,
  getTextFormatting,
  toggleUnderline,
  toggleLinethrough,
  setTextShadow,
  removeTextShadow,
} from '@/lib/fabric/text'

describe('text utilities', () => {
  const mockCanvas = {
    add: jest.fn(),
    setActiveObject: jest.fn(),
    renderAll: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createText', () => {
    it('should create a text object with default options', () => {
      const text = createText(mockCanvas as any)

      // 只测试行为，不测试 fabric.Text 的调用细节
      expect(mockCanvas.add).toHaveBeenCalled()
      expect(mockCanvas.renderAll).toHaveBeenCalled()
      expect(mockCanvas.setActiveObject).toHaveBeenCalled()

      // 验证返回的对象有正确的属性
      const addedObject = mockCanvas.add.mock.calls[0][0]
      expect(addedObject.type).toBe('text')
      expect(addedObject.text).toBe('双击编辑文字')
    })

    it('should create a text object with custom options', () => {
      const text = createText(mockCanvas as any, {
        text: 'Custom text',
        left: 50,
        top: 50,
        fontSize: 32,
        fontFamily: 'Helvetica',
        fill: '#ff0000',
        fontWeight: 'bold',
      })

      expect(mockCanvas.add).toHaveBeenCalled()
      expect(mockCanvas.renderAll).toHaveBeenCalled()
      expect(mockCanvas.setActiveObject).toHaveBeenCalled()

      const addedObject = mockCanvas.add.mock.calls[0][0]
      expect(addedObject.type).toBe('text')
      expect(addedObject.text).toBe('Custom text')
    })
  })

  describe('applyTextFormatting', () => {
    it('should apply underline formatting', () => {
      const textObject = {
        set: jest.fn(),
        setCoords: jest.fn(),
        underline: false,
      }

      applyTextFormatting(textObject as any, { underline: true })

      expect(textObject.set).toHaveBeenCalledWith('underline', true)
      expect(textObject.setCoords).toHaveBeenCalled()
    })

    it('should apply linethrough formatting', () => {
      const textObject = {
        set: jest.fn(),
        setCoords: jest.fn(),
        linethrough: false,
      }

      applyTextFormatting(textObject as any, { linethrough: true })

      expect(textObject.set).toHaveBeenCalledWith('linethrough', true)
      expect(textObject.setCoords).toHaveBeenCalled()
    })

    it('should apply text shadow', () => {
      const textObject = {
        set: jest.fn(),
        setCoords: jest.fn(),
      }

      const shadow = {
        color: '#000000',
        blur: 5,
        offsetX: 2,
        offsetY: 2,
      }

      applyTextFormatting(textObject as any, { shadow })

      expect(textObject.set).toHaveBeenCalled()
      expect(textObject.setCoords).toHaveBeenCalled()
    })
  })

  describe('removeTextFormatting', () => {
    it('should remove underline formatting', () => {
      const textObject = {
        set: jest.fn(),
        setCoords: jest.fn(),
      }

      removeTextFormatting(textObject as any, { underline: true })

      expect(textObject.set).toHaveBeenCalledWith('underline', false)
      expect(textObject.setCoords).toHaveBeenCalled()
    })

    it('should remove linethrough formatting', () => {
      const textObject = {
        set: jest.fn(),
        setCoords: jest.fn(),
      }

      removeTextFormatting(textObject as any, { linethrough: true })

      expect(textObject.set).toHaveBeenCalledWith('linethrough', false)
      expect(textObject.setCoords).toHaveBeenCalled()
    })

    it('should remove text shadow', () => {
      const textObject = {
        set: jest.fn(),
        setCoords: jest.fn(),
      }

      removeTextFormatting(textObject as any, { shadow: {} })

      expect(textObject.set).toHaveBeenCalledWith('shadow', undefined)
      expect(textObject.setCoords).toHaveBeenCalled()
    })
  })

  describe('getTextFormatting', () => {
    it('should return current formatting', () => {
      const textObject = {
        underline: true,
        linethrough: false,
        shadow: {
          color: '#000000',
          blur: 5,
          offsetX: 2,
          offsetY: 2,
        },
      }

      const formatting = getTextFormatting(textObject as any)

      expect(formatting).toEqual({
        underline: true,
        linethrough: false,
        shadow: {
          color: '#000000',
          blur: 5,
          offsetX: 2,
          offsetY: 2,
        },
      })
    })

    it('should handle missing properties', () => {
      const textObject = {}

      const formatting = getTextFormatting(textObject as any)

      expect(formatting.underline).toBe(false)
      expect(formatting.linethrough).toBe(false)
      expect(formatting.shadow).toBeUndefined()
    })
  })

  describe('toggleUnderline', () => {
    it('should toggle underline on', () => {
      const textObject = {
        underline: false,
        set: jest.fn(),
        setCoords: jest.fn(),
      }

      const result = toggleUnderline(textObject as any)

      expect(textObject.set).toHaveBeenCalledWith('underline', true)
      expect(textObject.setCoords).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should toggle underline off', () => {
      const textObject = {
        underline: true,
        set: jest.fn(),
        setCoords: jest.fn(),
      }

      const result = toggleUnderline(textObject as any)

      expect(textObject.set).toHaveBeenCalledWith('underline', false)
      expect(textObject.setCoords).toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('toggleLinethrough', () => {
    it('should toggle linethrough on', () => {
      const textObject = {
        linethrough: false,
        set: jest.fn(),
        setCoords: jest.fn(),
      }

      const result = toggleLinethrough(textObject as any)

      expect(textObject.set).toHaveBeenCalledWith('linethrough', true)
      expect(textObject.setCoords).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should toggle linethrough off', () => {
      const textObject = {
        linethrough: true,
        set: jest.fn(),
        setCoords: jest.fn(),
      }

      const result = toggleLinethrough(textObject as any)

      expect(textObject.set).toHaveBeenCalledWith('linethrough', false)
      expect(textObject.setCoords).toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('setTextShadow', () => {
    it('should set text shadow', () => {
      const textObject = {
        set: jest.fn(),
        setCoords: jest.fn(),
      }

      const shadow = {
        color: '#000000',
        blur: 5,
        offsetX: 2,
        offsetY: 2,
      }

      setTextShadow(textObject as any, shadow)

      expect(textObject.set).toHaveBeenCalled()
      expect(textObject.setCoords).toHaveBeenCalled()
    })
  })

  describe('removeTextShadow', () => {
    it('should remove text shadow', () => {
      const textObject = {
        set: jest.fn(),
        setCoords: jest.fn(),
      }

      removeTextShadow(textObject as any)

      expect(textObject.set).toHaveBeenCalledWith('shadow', undefined)
      expect(textObject.setCoords).toHaveBeenCalled()
    })
  })
})
