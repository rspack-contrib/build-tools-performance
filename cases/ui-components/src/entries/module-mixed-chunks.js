/**
 * [E1006] Module Mixed Chunks — 模块同时出现在 initial 与 async chunks
 *
 * 触发方式：
 *   1. 入口同步 import shared/analytics.js 等模块 → 进入 initial chunk
 *   2. 入口动态 import() lazy-pages/lazy-analytics.js 等页面 → 产生 async chunk
 *      而 lazy-analytics.js 内部也同步 import 了 shared/analytics.js
 *   3. splitChunks: false → async chunk 会把 shared/analytics.js 再打包一份
 *   → shared/analytics.js 同时出现在 initial chunk 和 async chunk → E1006
 *
 * 同样的模式也出现在 shared/chart-helpers.js 和 shared/user-info.js 上。
 *
 * 参考：https://rsdoctor.rs/zh/guide/rules/rules#e1006-module-mixed-chunks
 */

// ============================================================
// 同步导入共享模块 — 进入 initial chunk
// ============================================================
import { renderAnalyticsDashboard, calculateMetrics } from '../shared/analytics';
import { renderChartTable, formatChartData } from '../shared/chart-helpers';
import { renderUserProfile, formatUserRole } from '../shared/user-info';

// 在 initial chunk 中直接使用这些共享模块
const metrics = calculateMetrics([
  { value: 100 },
  { value: 200 },
  { value: 150 },
  { value: 300 },
]);
console.log('[E1006] Module Mixed Chunks Demo');
console.log('Initial chunk - analytics:', renderAnalyticsDashboard(metrics));
console.log('Initial chunk - charts:', renderChartTable([
  { name: 'React', value: 45, total: 100 },
  { name: 'Vue', value: 30, total: 100 },
]));
console.log('Initial chunk - chart data:', formatChartData([
  { name: 'Q1', value: 1200, total: 5000 },
]));
console.log('Initial chunk - user:', renderUserProfile({ name: 'Admin', role: 'admin' }));
console.log('Initial chunk - role:', formatUserRole('admin'));

// ============================================================
// 动态导入 lazy 页面 — 产生 async chunk
// 这些 lazy 页面各自又同步 import 了相同的 shared 模块，
// 导致 shared 模块被复制一份到 async chunk 中 → Module Mixed Chunks
// ============================================================

async function loadAnalyticsPanel() {
  // lazy-analytics.js 内部 import 了 shared/analytics.js
  // → shared/analytics.js 同时在 initial chunk + 此 async chunk
  const { init } = await import('./lazy-pages/lazy-analytics');
  return init();
}

async function loadChartPanel() {
  // lazy-charts.js 内部 import 了 shared/chart-helpers.js
  // → shared/chart-helpers.js 同时在 initial chunk + 此 async chunk
  const { init } = await import('./lazy-pages/lazy-charts');
  return init();
}

async function loadUserProfile() {
  // lazy-user.js 内部 import 了 shared/user-info.js
  // → shared/user-info.js 同时在 initial chunk + 此 async chunk
  const { init } = await import('./lazy-pages/lazy-user');
  return init();
}

// UI
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (!root) return;

  root.innerHTML = `
    <h2>[E1006] Module Mixed Chunks Demo</h2>
    <p>以下共享模块同时存在于 initial chunk（入口同步 import）和 async chunk（lazy 页面的依赖）：</p>
    <ul>
      <li><code>shared/analytics.js</code> — 入口直接用 + lazy-analytics.js 也用</li>
      <li><code>shared/chart-helpers.js</code> — 入口直接用 + lazy-charts.js 也用</li>
      <li><code>shared/user-info.js</code> — 入口直接用 + lazy-user.js 也用</li>
    </ul>
    <button id="btn-analytics">加载分析面板 (async)</button>
    <button id="btn-charts">加载图表 (async)</button>
    <button id="btn-user">查看个人资料 (async)</button>
    <pre id="output"></pre>
  `;

  const output = document.getElementById('output');
  const log = (msg) => { output.textContent += msg + '\n'; };

  document.getElementById('btn-analytics').addEventListener('click', async () => {
    log('Loading lazy-analytics...');
    const result = await loadAnalyticsPanel();
    log(JSON.stringify(result, null, 2));
  });

  document.getElementById('btn-charts').addEventListener('click', async () => {
    log('Loading lazy-charts...');
    const result = await loadChartPanel();
    log(JSON.stringify(result, null, 2));
  });

  document.getElementById('btn-user').addEventListener('click', async () => {
    log('Loading lazy-user...');
    const result = await loadUserProfile();
    log(JSON.stringify(result, null, 2));
  });
});
