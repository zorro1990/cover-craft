export interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

export interface ErrorResponse {
  error: string
  message: string
  status: number
}

export interface ShareRequest {
  design: any
  name?: string
}

export interface ShareResponse {
  id: string
  url: string
  createdAt: Date
}

export interface TemplateRequest {
  name: string
  description?: string
  category: string
  design: any
}

export interface TemplateResponse {
  id: string
  name: string
  url: string
  createdAt: Date
}

export interface MaterialRequest {
  imageUrl: string
  type: 'meme' | 'transparent_ai' | 'other'
  tags: string[]
  name: string
}

export interface MaterialResponse {
  id: string
  url: string
  createdAt: Date
}
