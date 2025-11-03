'use client'

import { useCallback } from 'react'
import { useNotification } from './useNotification'

interface ErrorInfo {
  message: string
  code?: string | number
  details?: any
  stack?: string
}

export function useErrorHandler() {
  const { showError, showWarning } = useNotification()

  const handleError = useCallback(
    (
      error: Error | string,
      options?: {
        title?: string
        showNotification?: boolean
        report?: boolean
      }
    ) => {
      const errorInfo: ErrorInfo =
        typeof error === 'string'
          ? { message: error }
          : {
              message: error.message,
              code: (error as any).code,
              details: (error as any).details,
              stack: error.stack,
            }

      // 记录错误
      console.error('[Error]', errorInfo)

      // 显示通知
      if (options?.showNotification !== false) {
        showError(
          options?.title || '操作失败',
          errorInfo.message,
          5000
        )
      }

      // 报告错误（可以集成到监控服务）
      if (options?.report && process.env.NODE_ENV === 'production') {
        reportError(errorInfo)
      }

      return errorInfo
    },
    [showError]
  )

  const handleWarning = useCallback(
    (message: string, title?: string) => {
      console.warn('[Warning]', message)
      showWarning(title || '注意', message)
    },
    [showWarning]
  )

  const handleAsyncError = useCallback(
    async <T>(
      promise: Promise<T>,
      options?: {
        onSuccess?: (data: T) => void
        onError?: (error: ErrorInfo) => void
        successMessage?: string
        errorTitle?: string
        showSuccessNotification?: boolean
        showErrorNotification?: boolean
      }
    ): Promise<T | null> => {
      try {
        const data = await promise

        if (options?.onSuccess) {
          options.onSuccess(data)
        }

        if (options?.successMessage) {
          // 这里可以添加成功通知
        }

        return data
      } catch (error) {
        const errorInfo = handleError(error as Error, {
          title: options?.errorTitle,
          showNotification: options?.showErrorNotification !== false,
        })

        if (options?.onError) {
          options.onError(errorInfo)
        }

        return null
      }
    },
    [handleError]
  )

  return {
    handleError,
    handleWarning,
    handleAsyncError,
  }
}

/**
 * 报告错误到监控服务
 */
function reportError(errorInfo: ErrorInfo) {
  // 这里可以集成 Sentry、LogRocket 等错误监控服务
  // 示例：
  // Sentry.captureException(error)
  console.log('[Error Report]', errorInfo)
}

/**
 * 创建可重试的错误处理函数
 */
export function createRetryableHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  maxRetries = 3
) {
  return async (...args: T): Promise<R | null> => {
    let lastError: Error

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn(...args)
      } catch (error) {
        lastError = error as Error

        if (i === maxRetries - 1) {
          throw lastError
        }

        // 等待后重试（指数退避）
        await delay(Math.pow(2, i) * 1000)
      }
    }

    return null
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
