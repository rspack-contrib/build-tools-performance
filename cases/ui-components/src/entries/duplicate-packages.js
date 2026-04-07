/**
 * [E1001] Duplicate Packages — 重复包演示
 *
 * 此入口同时使用 @mui/material 和 @chakra-ui/react，
 * 而项目中同时依赖了 antd，antd 通过 @ant-design/cssinjs 引入了
 * 旧版 @emotion 子包，与 @mui/@chakra 的新版形成版本冲突：
 *
 *   @emotion/hash:
 *     0.8.0  ← antd → @ant-design/cssinjs
 *     0.9.2  ← @mui/material → @emotion/styled → @emotion/serialize
 *            ← @chakra-ui/react → @emotion/react → @emotion/serialize
 *
 *   @emotion/unitless:
 *     0.7.5  ← antd → @ant-design/cssinjs
 *     0.10.0 ← @emotion/serialize（同上）
 *            ← @chakra-ui/react → styled-components
 *
 * 这会被 Rsdoctor E1001 规则检测到：同一 npm 包有多个版本被打入产物。
 *
 * 参考：https://rsdoctor.rs/zh/guide/rules/rules#e1001-duplicate-packages
 */

// ---- @mui/material 依赖链 ----
// @mui/material → @mui/styled-engine → @emotion/styled → @emotion/serialize → @emotion/hash@0.9.2, @emotion/unitless@0.10.0
import {
  Button as MuiButton,
  TextField as MuiTextField,
  Select as MuiSelect,
  Chip as MuiChip,
  Avatar as MuiAvatar,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Typography as MuiTypography,
  Divider as MuiDivider,
  IconButton as MuiIconButton,
} from '@mui/material';

// ---- @chakra-ui/react 依赖链 ----
// @chakra-ui/react → @emotion/react → @emotion/serialize → @emotion/hash@0.9.2, @emotion/unitless@0.10.0
// @chakra-ui/react → styled-components → @emotion/unitless@0.10.0
import {
  Button as ChakraButton,
  Input as ChakraInput,
  Select as ChakraSelect,
  Badge as ChakraBadge,
  Card as ChakraCard,
  Heading as ChakraHeading,
  Text as ChakraText,
  Stack as ChakraStack,
} from '@chakra-ui/react';

// ---- react-bootstrap 依赖链 ----
// 可能与上述库共享传递依赖的不同版本
import {
  Button as BootstrapButton,
  Card as BootstrapCard,
  Badge as BootstrapBadge,
  Form as BootstrapForm,
  Table as BootstrapTable,
  Alert as BootstrapAlert,
} from 'react-bootstrap';

// ---- @mantine/core 依赖链 ----
import {
  Button as MantineButton,
  TextInput as MantineTextInput,
  Badge as MantineBadge,
  Card as MantineCard,
  Table as MantineTable,
} from '@mantine/core';

// 使用所有导入，确保不被 tree-shake
console.log('[E1001] Duplicate Packages Demo');
console.log(
  'MUI:',
  MuiButton, MuiTextField, MuiSelect, MuiChip, MuiAvatar,
  MuiCard, MuiCardContent, MuiTypography, MuiDivider, MuiIconButton,
);
console.log(
  'Chakra:',
  ChakraButton, ChakraInput, ChakraSelect, ChakraBadge,
  ChakraCard, ChakraHeading, ChakraText, ChakraStack,
);
console.log(
  'Bootstrap:',
  BootstrapButton, BootstrapCard, BootstrapBadge,
  BootstrapForm, BootstrapTable, BootstrapAlert,
);
console.log(
  'Mantine:',
  MantineButton, MantineTextInput, MantineBadge, MantineCard, MantineTable,
);
