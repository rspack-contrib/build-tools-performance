/**
 * 懒加载的分析面板页面
 *
 * 此文件通过 import() 动态加载 → 进入 async chunk。
 * 它也同步导入了 shared/analytics.js，因此 analytics 模块的代码
 * 会被复制到这个 async chunk 中。
 *
 * 同时 module-mixed-chunks.js 入口也同步导入了 shared/analytics.js
 * → analytics 模块也在 initial chunk 中。
 *
 * 结果：shared/analytics.js 同时出现在 initial chunk + async chunk → E1006
 */
import { renderAnalyticsDashboard, calculateMetrics, ANALYTICS_VERSION } from '../../shared/analytics';

const lazyData = [
  { value: 500 },
  { value: 800 },
  { value: 350 },
  { value: 1200 },
  { value: 670 },
];

export function init() {
  const metrics = calculateMetrics(lazyData);
  const dashboard = renderAnalyticsDashboard(metrics);
  console.log('[Lazy Analytics] version:', ANALYTICS_VERSION);
  console.log('[Lazy Analytics] dashboard:', dashboard);
  return { metrics, dashboard };
}
