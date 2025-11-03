export interface User {
  id: string
  name: string
  email?: string
  avatar?: string
  createdAt: Date
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  defaultCanvasSize: string
  defaultExportFormat: 'png' | 'jpg'
  defaultExportQuality: number
}

export interface ApiKeys {
  seedream?: string
  unsplash?: string
  removebg?: string
}
