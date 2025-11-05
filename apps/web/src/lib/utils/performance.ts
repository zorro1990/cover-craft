/**
 * 性能优化工具
 *
 * 提供防抖、节流、延迟加载等功能来优化应用性能
 */

/**
 * 防抖函数
 * 在指定时间后执行，如果期间再次调用则重新计时
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }

    const callNow = immediate && !timeout

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)

    if (callNow) func(...args)
  }
}

/**
 * 节流函数
 * 在指定时间间隔内最多执行一次
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 延迟加载图片
 */
export function lazyLoadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * 预加载图片
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return lazyLoadImage(src)
}

/**
 * 优化 Canvas 渲染
 */
export class CanvasRenderOptimizer {
  private renderQueue: Set<() => void> = new Set()
  private scheduled = false

  scheduleRender(renderFn: () => void) {
    this.renderQueue.add(renderFn)

    if (!this.scheduled) {
      this.scheduled = true
      requestAnimationFrame(() => {
        this.flush()
      })
    }
  }

  private flush() {
    this.renderQueue.forEach((fn) => fn())
    this.renderQueue.clear()
    this.scheduled = false
  }
}

/**
 * 内存监控
 */
export class MemoryMonitor {
  private observers: Set<() => void> = new Set()

  addObserver(observer: () => void) {
    this.observers.add(observer)
  }

  removeObserver(observer: () => void) {
    this.observers.delete(observer)
  }

  getMemoryUsage(): any {
    if ('memory' in performance) {
      return (performance as any).memory
    }
    return null
  }

  checkMemoryUsage() {
    const memory = this.getMemoryUsage()
    if (memory) {
      const usedMB = memory.usedJSHeapSize / 1024 / 1024
      const limitMB = memory.jsHeapSizeLimit / 1024 / 1024

      console.log(`内存使用: ${usedMB.toFixed(2)}MB / ${limitMB.toFixed(2)}MB`)

      // 如果内存使用超过80%，触发清理
      if (usedMB / limitMB > 0.8) {
        this.observers.forEach((observer) => observer())
      }
    }
  }
}

/**
 * 对象池
 * 用于重用对象，减少GC压力
 */
export class ObjectPool<T> {
  private pool: T[] = []
  private createFn: () => T
  private resetFn: (obj: T) => void

  constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize = 10) {
    this.createFn = createFn
    this.resetFn = resetFn

    // 预填充池
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn())
    }
  }

  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!
    }
    return this.createFn()
  }

  release(obj: T) {
    this.resetFn(obj)
    this.pool.push(obj)
  }

  clear() {
    this.pool = []
  }

  size(): number {
    return this.pool.length
  }
}

/**
 * 批量操作优化
 */
export function batchOperations<T>(
  operations: T[],
  batchSize: number,
  processBatch: (batch: T[]) => void | Promise<void>
): Promise<void> {
  return new Promise((resolve, reject) => {
    let index = 0

    const processNextBatch = async () => {
      try {
        const batch = operations.slice(index, index + batchSize)
        if (batch.length === 0) {
          resolve()
          return
        }

        await processBatch(batch)
        index += batchSize

        // 使用 setTimeout 让出主线程
        setTimeout(processNextBatch, 0)
      } catch (error) {
        reject(error)
      }
    }

    processNextBatch()
  })
}

/**
 * 延迟执行
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 测量函数执行时间
 */
export function measureTime<T>(fn: () => T, label?: string): T {
  const start = performance.now()
  const result = fn()
  const end = performance.now()

  if (label) {
    console.log(`${label} 执行时间: ${(end - start).toFixed(2)}ms`)
  }

  return result
}

/**
 * 异步测量函数执行时间
 */
export async function measureAsyncTime<T>(
  fn: () => Promise<T>,
  label?: string
): Promise<T> {
  const start = performance.now()
  const result = await fn()
  const end = performance.now()

  if (label) {
    console.log(`${label} 执行时间: ${(end - start).toFixed(2)}ms`)
  }

  return result
}
