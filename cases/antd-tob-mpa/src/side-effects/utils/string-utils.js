/**
 * 字符串处理工具模块
 * 大部分函数不会被使用，但由于 barrel file 会全部打包。
 */

export function truncate(str, maxLen = 20) {
  if (str.length <= maxLen) return str;
  return `${str.slice(0, maxLen)}…`;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function camelToKebab(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function maskPhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

export function maskEmail(email) {
  const [local, domain] = email.split('@');
  return `${local.slice(0, 2)}***@${domain}`;
}

export function padStart(str, len, fill = '0') {
  return String(str).padStart(len, fill);
}

export function template(tpl, data) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? '');
}

// 模块级副作用
globalThis.__STRING_UTILS_LOADED__ = true;
