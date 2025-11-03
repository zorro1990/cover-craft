import { AnyFabricObject } from './canvas'

export interface Design {
  id?: string
  content: {
    canvas: {
      width: number
      height: number
      backgroundColor: string
    }
    objects: AnyFabricObject[]
  }
  isPublicTemplate?: boolean
  createdAt?: Date
  previewUrl?: string
  name?: string
}

export interface Template {
  id: string
  name: string
  description?: string
  category: string
  design: Design
  author?: string
  usageCount: number
  isPublic: boolean
  createdAt: Date
}

export interface SharedMaterial {
  id: string
  imageUrl: string
  type: 'meme' | 'transparent_ai' | 'other'
  tags: string[]
  author?: string
  usageCount: number
  isPublic: boolean
  createdAt: Date
}
