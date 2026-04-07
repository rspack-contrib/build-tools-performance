/**
 * 共享图表工具模块 — 同时被同步 import 和动态 import() 引用
 *
 * 同样触发 E1006 Module Mixed Chunks 规则。
 */
import {
  Button as MuiButton,
  Card as MuiCard,
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
} from '@mui/material';

export function renderChartTable(data) {
  console.log(
    'renderChartTable',
    MuiButton, MuiCard, MuiTable, MuiTableBody,
    MuiTableCell, MuiTableHead, MuiTableRow,
  );
  return {
    component: 'ChartTable',
    data,
    ui: { MuiButton, MuiCard, MuiTable, MuiTableBody, MuiTableCell, MuiTableHead, MuiTableRow },
  };
}

export function formatChartData(raw) {
  return raw.map((item, index) => ({
    key: index,
    label: item.name || `Item ${index}`,
    value: item.value || 0,
    percent: item.total ? ((item.value / item.total) * 100).toFixed(1) + '%' : 'N/A',
  }));
}

export const CHART_HELPERS_VERSION = '1.5.0';
