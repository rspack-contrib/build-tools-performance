/**
 * 懒加载的图表页面
 *
 * 通过 import() 动态加载 → 进入 async chunk。
 * 同步导入了 shared/chart-helpers.js，而入口文件也同步导入了它
 * → chart-helpers 模块同时出现在 initial chunk + async chunk → E1006
 */
import { renderChartTable, formatChartData, CHART_HELPERS_VERSION } from '../../shared/chart-helpers';

const rawChartData = [
  { name: '华东区', value: 4500, total: 10000 },
  { name: '华南区', value: 3200, total: 10000 },
  { name: '华北区', value: 2800, total: 10000 },
  { name: '西南区', value: 1500, total: 10000 },
];

export function init() {
  const formatted = formatChartData(rawChartData);
  const table = renderChartTable(formatted);
  console.log('[Lazy Charts] version:', CHART_HELPERS_VERSION);
  console.log('[Lazy Charts] table:', table);
  return { formatted, table };
}
