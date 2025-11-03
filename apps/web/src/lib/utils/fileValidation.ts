export interface FileValidationResult {
  valid: boolean
  error?: string
}

export interface FileValidationOptions {
  maxSize?: number // in bytes, default 10MB
  allowedTypes?: string[]
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024 // 10MB
const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function validateImageFile(
  file: File,
  options: FileValidationOptions = {}
): FileValidationResult {
  const { maxSize = DEFAULT_MAX_SIZE, allowedTypes = DEFAULT_ALLOWED_TYPES } = options

  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: '未选择文件',
    }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `不支持的文件格式。支持的格式：${allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}`,
    }
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024))
    return {
      valid: false,
      error: `文件过大。最大允许 ${maxSizeMB}MB`,
    }
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      valid: false,
      error: '文件为空',
    }
  }

  return {
    valid: true,
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
