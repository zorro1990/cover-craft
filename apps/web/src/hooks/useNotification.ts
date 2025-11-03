'use client'

import { useState, useCallback } from 'react'
import type { NotificationType } from '@/components/ui/notification'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message?: string,
      duration?: number
    ) => {
      const id = Math.random().toString(36).substr(2, 9)
      const notification: Notification = {
        id,
        type,
        title,
        message,
        duration,
      }

      setNotifications((prev) => [...prev, notification])

      // 自动移除通知
      if (duration !== 0) {
        setTimeout(() => {
          removeNotification(id)
        }, duration || 5000)
      }

      return id
    },
    []
  )

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const showSuccess = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addNotification('success', title, message, duration)
    },
    [addNotification]
  )

  const showError = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addNotification('error', title, message, duration)
    },
    [addNotification]
  )

  const showWarning = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addNotification('warning', title, message, duration)
    },
    [addNotification]
  )

  const showInfo = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addNotification('info', title, message, duration)
    },
    [addNotification]
  )

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
