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
      const mockText = {
        set: jest.fn(),
        setCoords: jest.fn(),
      }

      const fabric = require('fabric')
      fabric.Text = jest.fn().mockImplementation((text, options) => ({
        text,
        ...options,
        selectable: true,
        ...mockText,
      }))

      const text = createText(mockCanvas as any)

      expect(fabric.Text).toHaveBeenCalledWith('双击编辑文字', {
        left: 100,
        top: 100,
        fontSize: 24,
        fontFamily: 'Arial',
        fill: '#000000',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'left',
        selectable: true,
      })
      expect(mockCanvas.add).toHaveBeenCalled()
      expect(mockCanvas.renderAll).toHaveBeenCalled()
    })

    it('should create a text object with custom options', () => {
      const mockText = {
        set: jest.fn(),
        setCoords: jest.fn(),
      }

      const fabric = require('fabric')
      fabric.Text = jest.fn().mockImplementation((text, options) => ({
        text,
        ...options,
        selectable: true,
        ...mockText,
      }))

      const text = createText(mockCanvas as any, {
        text: 'Custom text',
        left: 50,
        top: 50,
        fontSize: 32,
        fontFamily: 'Helvetica',
        fill: '#ff0000',
        fontWeight: 'bold',
      })

      expect(fabric.Text).toHaveBeenCalledWith('Custom text', {
        left: 50,
        top: 50,
        fontSize: 32,
        fontFamily: 'Helvetica',
        fill: '#ff0000',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textAlign: 'left',
        selectable: true,
      })
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

      expect(textObject.set).toHaveBeenCalledWith('shadow', shadow)
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

      expect(textObject.set).toHaveBeenCalledWith('shadow', null)
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

      expect(textObject.set).toHaveBeenCalledWith('shadow', shadow)
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

      expect(textObject.set).toHaveBeenCalledWith('shadow', null)
      expect(textObject.setCoords).toHaveBeenCalled()
    })
  })
})
