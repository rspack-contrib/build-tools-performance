/**
 * ⚠️ Barrel file — 经典的 tree-shaking 失效模式
 *
 * 这个文件先 import 再 export 所有子模块的内容。
 * 由于每个子模块都包含模块级副作用（globalThis.__xxx__ = true），
 * 打包器无法安全地 tree-shake 掉未使用的导出，
 * 即使消费方只用了其中 1-2 个函数，整个 barrel 的所有模块都会被打包。
 *
 * 正确做法：直接从具体子模块导入，如 import { formatDate } from './date-utils'
 */

// ---- date-utils ----
export {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  parseISODate,
  getWeekday,
} from './date-utils';

// ---- number-utils ----
export {
  formatCurrency,
  formatPercent,
  formatCompact,
  clamp,
  randomInt,
  sum,
  average,
} from './number-utils';

// ---- string-utils ----
export {
  truncate,
  capitalize,
  camelToKebab,
  kebabToCamel,
  slugify,
  maskPhone,
  maskEmail,
  padStart,
  template,
} from './string-utils';

// ---- validator-utils ----
export {
  isEmail,
  isPhone,
  isURL,
  isIDCard,
  isStrongPassword,
  isIPv4,
  isHexColor,
  isJSON,
} from './validator-utils';

// ---- color-utils ----
export {
  hexToRgb,
  rgbToHex,
  lighten,
  darken,
  randomColor,
  getContrastColor,
} from './color-utils';
