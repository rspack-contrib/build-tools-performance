/**
 * [E1002] Cross Chunks Package — 跨 Chunks 重复包演示 (Entry B)
 *
 * 此入口与 cross-chunks-a.js 共同使用 antd、@mui/material 等包。
 * 两个入口各自打包一份相同的依赖 → 同一模块出现在两个 chunks 中。
 *
 * 这会被 Rsdoctor E1002 规则检测到。
 *
 * 参考：https://rsdoctor.rs/zh/guide/rules/rules#e1002-cross-chunks-package
 */

// ---- antd 组件（与 entry A 重叠） ----
import {
  Button as AntdButton,
  Input as AntdInput,
  Select as AntdSelect,
  Table as AntdTable,
  Form as AntdForm,
  Card as AntdCard,
  DatePicker as AntdDatePicker,
  Upload as AntdUpload,
  Pagination as AntdPagination,
  Tag as AntdTag,
} from 'antd';

// ---- @mui/material 组件（与 entry A 重叠） ----
import {
  Button as MuiButton,
  TextField as MuiTextField,
  Select as MuiSelect,
  Table as MuiTable,
  Card as MuiCard,
  Tabs as MuiTabs,
  Tooltip as MuiTooltip,
} from '@mui/material';

// ---- 本入口独有：@fluentui/react ----
import {
  ButtonGrid as FluentUIButtonGrid,
  Dialog as FluentUIDialog,
} from '@fluentui/react';

console.log('[E1002] Cross Chunks - Entry B');
console.log(
  'antd:',
  AntdButton, AntdInput, AntdSelect, AntdTable, AntdForm,
  AntdCard, AntdDatePicker, AntdUpload, AntdPagination, AntdTag,
);
console.log(
  'MUI:',
  MuiButton, MuiTextField, MuiSelect, MuiTable,
  MuiCard, MuiTabs, MuiTooltip,
);
console.log('FluentUI:', FluentUIButtonGrid, FluentUIDialog);
