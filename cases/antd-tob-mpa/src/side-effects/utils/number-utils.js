/**
 * 数字/货币格式化工具模块
 * 只有 formatCurrency 会在页面中被使用，其余应该被 tree-shake 掉。
 */

export function formatCurrency(value, currency = '¥') {
  return `${currency}${Number(value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercent(value, decimals = 1) {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatCompact(value) {
  if (value >= 1e8) return `${(value / 1e8).toFixed(2)} 亿`;
  if (value >= 1e4) return `${(value / 1e4).toFixed(2)} 万`;
  return String(value);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

export function average(arr) {
  return arr.length ? sum(arr) / arr.length : 0;
}

// 模块级副作用
globalThis.__NUMBER_UTILS_LOADED__ = true;
