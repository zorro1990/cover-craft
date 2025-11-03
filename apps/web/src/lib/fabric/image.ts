import { fabric } from 'fabric'

export function createImageObject(
  canvas: fabric.Canvas,
  file: File,
  options: {
    left?: number
    top?: number
    maxSize?: number
  } = {}
): Promise<fabric.Image> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const imgUrl = e.target?.result as string
      fabric.Image.fromURL(
        imgUrl,
        (img) => {
          if (!img) {
            reject(new Error('Failed to create image object'))
            return
          }

          // Get original dimensions
          const originalWidth = img.width || 0
          const originalHeight = img.height || 0

          // Calculate scaled dimensions
          const maxSize = options.maxSize || 800
          let scale = 1

          if (originalWidth > maxSize || originalHeight > maxSize) {
            scale = Math.min(maxSize / originalWidth, maxSize / originalHeight)
          }

          // Set properties
          img.set({
            left: options.left || canvas.getWidth() / 2,
            top: options.top || canvas.getHeight() / 2,
            originX: 'center',
            originY: 'center',
            scaleX: scale,
            scaleY: scale,
            selectable: true,
          })

          // Add to canvas
          canvas.add(img)
          canvas.setActiveObject(img)
          canvas.renderAll()

          // Store original dimensions
          ;(img as any).originalWidth = originalWidth
          ;(img as any).originalHeight = originalHeight
          ;(img as any).scale = scale

          resolve(img)
        },
        {
          crossOrigin: 'anonymous',
        }
      )
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

export function updateImageObject(
  imageObject: fabric.Image,
  updates: {
    opacity?: number
    angle?: number
    scaleX?: number
    scaleY?: number
    flipX?: boolean
    flipY?: boolean
  }
) {
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      // @ts-ignore - dynamic property
      imageObject.set(key, value)
    }
  })
  imageObject.setCoords()
  imageObject.canvas?.renderAll()
}

export function getImageDimensions(imageObject: fabric.Image) {
  const scale = imageObject.scaleX || 1
  const originalWidth = (imageObject as any).originalWidth || imageObject.width || 0
  const originalHeight = (imageObject as any).originalHeight || imageObject.height || 0

  return {
    originalWidth,
    originalHeight,
    currentWidth: originalWidth * scale,
    currentHeight: originalHeight * scale,
    scale,
  }
}

export function resetImageSize(imageObject: fabric.Image) {
  const originalWidth = (imageObject as any).originalWidth || imageObject.width || 0
  const originalHeight = (imageObject as any).originalHeight || imageObject.height || 0

  imageObject.set({
    scaleX: 1,
    scaleY: 1,
  })

  imageObject.setCoords()
  imageObject.canvas?.renderAll()

  return {
    originalWidth,
    originalHeight,
    currentWidth: originalWidth,
    currentHeight: originalHeight,
  }
}

export function compressImage(
  file: File,
  maxSize: number = 800,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height
          height = maxSize
        }
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'))
            return
          }

          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          })

          resolve(compressedFile)
        },
        file.type,
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = URL.createObjectURL(file)
  })
}
