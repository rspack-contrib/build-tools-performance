/**
 * [E1002] Cross Chunks Package — 跨 Chunks 重复包演示 (Entry A)
 *
 * 此入口与 cross-chunks-b.js 共同使用 antd、@mui/material 等包。
 * 在没有 splitChunks 优化的情况下，两个入口各自打包一份相同的依赖，
 * 导致 antd、@mui/material 等包同时出现在两个不同的 chunks 中。
 *
 * 这会被 Rsdoctor E1002 规则检测到：同一模块被重复打包到不同 chunks。
 *
 * 参考：https://rsdoctor.rs/zh/guide/rules/rules#e1002-cross-chunks-package
 */

// ---- antd 组件（与 entry B 重叠） ----
import {
  Button as AntdButton,
  Input as AntdInput,
  Select as AntdSelect,
  Table as AntdTable,
  Form as AntdForm,
  Card as AntdCard,
  Tabs as AntdTabs,
  Modal as AntdModal,
  Drawer as AntdDrawer,
  message as antdMessage,
} from 'antd';

// ---- @mui/material 组件（与 entry B 重叠） ----
import {
  Button as MuiButton,
  TextField as MuiTextField,
  Select as MuiSelect,
  Table as MuiTable,
  Card as MuiCard,
  Dialog as MuiDialog,
  Snackbar as MuiSnackbar,
} from '@mui/material';

// ---- 本入口独有：@headlessui/react ----
import {
  Dialog as HeadlessDialog,
  Listbox as HeadlessListbox,
  Menu as HeadlessMenu,
} from '@headlessui/react';

console.log('[E1002] Cross Chunks - Entry A');
console.log(
  'antd:',
  AntdButton, AntdInput, AntdSelect, AntdTable, AntdForm,
  AntdCard, AntdTabs, AntdModal, AntdDrawer, antdMessage,
);
console.log(
  'MUI:',
  MuiButton, MuiTextField, MuiSelect, MuiTable,
  MuiCard, MuiDialog, MuiSnackbar,
);
console.log('Headless:', HeadlessDialog, HeadlessListbox, HeadlessMenu);
