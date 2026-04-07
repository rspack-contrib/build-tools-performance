# Standard: antd-tob-mpa

## Q1: 仅因副作用而被打包的文件

### [CHECK] 识别出 5 个 register-* 纯副作用导入模块及其引入链

side-effects-only-imports 页面（`src/pages/side-effects-only-imports/index.jsx:13-17`）以 `import 'module'` 形式导入了 5 个模块，
这些模块纯粹为了执行副作用，没有使用任何具名导出。引入链如下：

1. `index.jsx` → `import '../../side-effects/register-polyfills'`
   - 副作用：写入 `globalThis.__POLYFILL_REGISTRY__`（arrayAt / structuredClone / objectGroupBy）
   - 未使用的导出：`POLYFILL_VERSION`、`getPolyfillStatus()`

2. `index.jsx` → `import '../../side-effects/register-logger'`
   - 副作用：创建 Logger 实例并挂载到 `globalThis.__APP_LOGGER__`
   - 无具名导出

3. `index.jsx` → `import '../../side-effects/register-error-handler'`
   - 副作用：`window.addEventListener('error', ...)` 和 `window.addEventListener('unhandledrejection', ...)`，写入 `globalThis.__ERROR_BUFFER__`
   - 未使用的导出：`getErrorBuffer()`、`clearErrorBuffer()`

4. `index.jsx` → `import '../../side-effects/register-performance-marks'`
   - 副作用：`performance.mark('app:init')`，写入 `globalThis.__PERF_MARKS__`
   - 未使用的导出：`PERF_MARKS`、`markLayoutReady()`、`markDataLoaded()`

5. `index.jsx` → `import '../../side-effects/register-theme'`
   - 副作用：遍历 themeTokens 对象，调用 `document.documentElement.style.setProperty()` 注入 CSS 变量
   - 未使用的导出：`themeTokens`、`updateThemeToken()`

## Q2: 产物优化

> Q2 关注所有可能对产物造成冗余的问题，按以下子类检查：

### Q2-A: 跨 chunk 相同 module 打包问题

#### [CHECK] 识别出 14 个 MPA 入口页面

该 case 配置了 14 个入口（`rspack.config.mjs:18-32`）：dashboard、charts、orders、product-detail、create-order、
new-feature、feature-duplicate-1~5、side-effects-only-imports、esm-resolved-to-cjs、large-assets。

#### [CHECK] 指出所有页面共享 react/react-dom/antd 依赖应提取公共 chunk

所有 14 个页面都依赖 react、react-dom 和 antd，当前 rspack.config.mjs 及 shared config 中均未配置 `optimization.splitChunks`，
导致这些公共依赖在每个页面 chunk 中各打包一份。应配置 splitChunks 提取为独立 chunk。

#### [CHECK] 注意到 feature-duplicate-1~5 是几乎相同的页面，应合并或提取公共模块

feature-duplicate-1 到 feature-duplicate-5 的源码几乎完全相同（均导入 AppLayout、PageHeader、OverviewCards、dashboardMetrics），
仅组件名和标题字符串不同。这 5 个入口各自独立打包，产物中存在大量重复代码。

### Q2-B: 仅因副作用而被打进来的文件

#### [CHECK] 识别出 barrel file 导致 3 个未使用的子模块被打进产物

页面仅使用 `formatDate`（date-utils）和 `formatCurrency`（number-utils），
但通过 `utils/index.js` barrel file 导入，导致 string-utils、validator-utils、color-utils
三个未使用子模块也因模块级副作用被强制打入产物。

### Q2-C: 过大媒体或字体资源

#### [CHECK] 识别出 hero-banner.svg（~190KB）过大 SVG 被打入产物

large-assets 页面导入了 `src/assets/hero-banner.svg`（~190KB），
该 SVG 包含 2000 条路径，作为 asset 模块导入后进入产物。
应压缩为 PNG/WebP 或通过 CDN 外链加载，避免膨胀产物体积。

#### [CHECK] 识别出 resource-map.json（~108KB）整包打入 JS 但仅使用 3/200 个图标

large-assets 页面导入了 `src/assets/resource-map.json`（~108KB），
其中包含 200 个 base64 编码的图标 sprite，但页面仅使用其中 3 个。
整个 JSON 被序列化进 JS chunk，浪费约 105KB。应按需加载或拆分为独立的异步请求。

#### [CHECK] 识别出 enterprise-font.css（~391KB）以 base64 内嵌字体

large-assets 页面导入了 `src/assets/enterprise-font.css`（~391KB），
其中通过 `@font-face` 的 `data:font/woff2;base64,...` 将 ~200KB 字体文件
以 base64 形式内嵌（normal + bold 各一份），导致 CSS 产物膨胀一倍。
应改为外部 woff2 文件引用，利用浏览器缓存。

## Q4: Tree-shaking 优化

### [CHECK] 识别出 barrel file（utils/index.js）导致 tree-shaking 失效
页面从 barrel file（side-effects/utils/index.js）导入 formatDate 和 formatCurrency，
但 barrel file re-export 了 5 个子模块（date-utils、number-utils、string-utils、validator-utils、color-utils）的所有导出。

### [CHECK] 指出子模块包含模块级副作用导致无法被 tree-shake 移除
每个子模块都有模块级副作用（如 `globalThis.__xxx__ = true`），
导致打包器无法安全地移除未使用的导出，即使消费方只用了其中 2 个函数。

### [CHECK] 建议直接从子模块导入替代通过 barrel file 导入
应将 `import { formatDate, formatCurrency } from '../../side-effects/utils'`
改为 `import { formatDate } from '../../side-effects/utils/date-utils'`
和 `import { formatCurrency } from '../../side-effects/utils/number-utils'`。

### [CHECK] 识别出 esm-resolved-to-cjs 规则配置为 Warn 级别
rspack.config.mjs 中 Rsdoctor 的 esm-resolved-to-cjs 规则被设为 Warn，
并配置了 ignore: ['node_modules']。

### [CHECK] 解释 ESM 解析到 CJS 对 tree-shaking 和 bundle 体积的影响
当 ESM import 在构建时解析到 CJS 模块，会阻碍 tree-shaking 和 scope hoisting，增加产物体积。
