import { validateImageFile, formatFileSize } from '@/lib/utils/fileValidation'

describe('fileValidation', () => {
  describe('validateImageFile', () => {
    it('should validate valid file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })

    it('should reject invalid file type', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('不支持的文件格式')
    })

    it('should reject oversized file', () => {
      const largeContent = new Array(11 * 1024 * 1024).fill('a').join('')
      const file = new File([largeContent], 'test.jpg', { type: 'image/jpeg' })
      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('文件过大')
    })

    it('should reject empty file', () => {
      const file = new File([], 'test.jpg', { type: 'image/jpeg' })
      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('文件为空')
    })

    it('should accept PNG files', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' })
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })

    it('should accept WebP files', () => {
      const file = new File(['test'], 'test.webp', { type: 'image/webp' })
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })

    it('should use custom max size', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const result = validateImageFile(file, { maxSize: 100 })
      expect(result.valid).toBe(true) // File is smaller than 100 bytes
    })

    it('should use custom allowed types', () => {
      const file = new File(['test'], 'test.gif', { type: 'image/gif' })
      const result = validateImageFile(file, {
        allowedTypes: ['image/gif'],
      })
      expect(result.valid).toBe(true)
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
    })

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB')
    })

    it('should format megabytes', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
    })

    it('should format large files', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })

    it('should handle fractional values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB')
    })

    it('should handle decimal values', () => {
      expect(formatFileSize(512.5)).toBe('512.5 Bytes')
    })
  })
})
