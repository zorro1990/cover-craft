/**
 * 轻量级 Logger 工具
 * 开发环境输出，生产环境可静默或接入监控
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerConfig {
  level: LogLevel
  enableInProduction: boolean
}

const config: LoggerConfig = {
  level: (process.env.NODE_ENV === 'production' ? 'warn' : 'debug') as LogLevel,
  enableInProduction: false, // 生产环境默认静默，可通过环境变量开启
}

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

function shouldLog(level: LogLevel): boolean {
  if (process.env.NODE_ENV === 'development') {
    return levels[level] >= levels[config.level]
  }
  return config.enableInProduction
}

function formatMessage(level: LogLevel, message: string, ...args: any[]): any[] {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`
  return [prefix, message, ...args]
}

export const logger = {
  debug(message: string, ...args: any[]) {
    if (shouldLog('debug')) {
      console.debug(...formatMessage('debug', message, ...args))
    }
  },

  info(message: string, ...args: any[]) {
    if (shouldLog('info')) {
      console.info(...formatMessage('info', message, ...args))
    }
  },

  warn(message: string, ...args: any[]) {
    if (shouldLog('warn')) {
      console.warn(...formatMessage('warn', message, ...args))
    }
  },

  error(message: string, ...args: any[]) {
    if (shouldLog('error')) {
      console.error(...formatMessage('error', message, ...args))
    }
  },

  /**
   * 配置 Logger
   */
  configure(newConfig: Partial<LoggerConfig>) {
    Object.assign(config, newConfig)
  },
}
