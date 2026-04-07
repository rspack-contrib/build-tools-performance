/**
 * 数据校验工具模块
 * 页面中完全不会使用这些函数，但经 barrel file 仍会被打包。
 */

export function isEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

export function isPhone(str) {
  return /^1[3-9]\d{9}$/.test(str);
}

export function isURL(str) {
  try { new URL(str); return true; } catch { return false; }
}

export function isIDCard(str) {
  return /^\d{17}[\dXx]$/.test(str);
}

export function isStrongPassword(str) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(str);
}

export function isIPv4(str) {
  return /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(str);
}

export function isHexColor(str) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(str);
}

export function isJSON(str) {
  try { JSON.parse(str); return true; } catch { return false; }
}

// 模块级副作用
globalThis.__VALIDATOR_UTILS_LOADED__ = true;
