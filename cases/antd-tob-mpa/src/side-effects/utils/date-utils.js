/**
 * 日期格式化工具模块
 * 只有 formatDate 会在页面中被使用，其余应该被 tree-shake 掉，
 * 但经过 barrel file 后，所有导出都会被保留。
 */

export function formatDate(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatDateTime(date) {
  const d = new Date(date);
  return `${formatDate(d)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

export function formatRelativeTime(date) {
  const diff = Date.now() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds} 秒前`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  return `${days} 天前`;
}

export function parseISODate(str) {
  return new Date(str);
}

export function getWeekday(date) {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `星期${weekdays[new Date(date).getDay()]}`;
}

// 模块级副作用：注册到全局
globalThis.__DATE_UTILS_LOADED__ = true;
