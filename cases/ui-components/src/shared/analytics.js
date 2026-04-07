/**
 * 共享分析模块 — 同时被同步 import 和动态 import() 引用
 *
 * 在 module-mixed-chunks.js 中：
 *   - 同步 import → 进入 initial chunk
 *   - 动态 import() → 进入 async chunk
 *
 * 导致此模块同时出现在 initial chunk 和 async chunk 中，
 * 触发 E1006 Module Mixed Chunks 规则。
 */
import { Card, Statistic, Row, Col, Progress, Typography } from 'antd';

export function renderAnalyticsDashboard(data) {
  console.log('renderAnalyticsDashboard', Card, Statistic, Row, Col, Progress, Typography);
  return {
    component: 'AnalyticsDashboard',
    metrics: data,
    ui: { Card, Statistic, Row, Col, Progress, Typography },
  };
}

export function calculateMetrics(records) {
  const total = records.reduce((sum, r) => sum + r.value, 0);
  const avg = records.length ? total / records.length : 0;
  const max = Math.max(...records.map((r) => r.value));
  const min = Math.min(...records.map((r) => r.value));
  return { total, avg, max, min, count: records.length };
}

export const ANALYTICS_VERSION = '2.0.0';
