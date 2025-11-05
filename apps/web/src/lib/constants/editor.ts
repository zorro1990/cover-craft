/**
 * 编辑器相关常量定义
 */

/**
 * 默认文本属性
 */
export const DEFAULT_TEXT_PROPS = {
  text: '双击编辑文字',
  fontSize: 24,
  fontFamily: 'Arial',
  fill: '#000000',
}

/**
 * 默认形状属性
 */
export const DEFAULT_SHAPE_PROPS = {
  rectangle: {
    width: 200,
    height: 150,
    fill: '#3b82f6',
    stroke: '#1e40af',
    strokeWidth: 2,
    opacity: 1,
  },
  circle: {
    width: 150,
    radius: 75,
    fill: '#10b981',
    stroke: '#047857',
    strokeWidth: 2,
    opacity: 1,
  },
  line: {
    width: 200,
    stroke: '#6b7280',
    strokeWidth: 3,
    opacity: 1,
  },
}

/**
 * 画布默认尺寸
 */
export const DEFAULT_CANVAS_SIZE = {
  width: 1080,
  height: 1440,
}

/**
 * 默认背景色
 */
export const DEFAULT_BACKGROUND_COLOR = '#ffffff'

/**
 * Toast 默认持续时间（毫秒）
 */
export const TOAST_DURATION = {
  success: 3000,
  error: 5000,
  info: 3000,
  warning: 4000,
}
