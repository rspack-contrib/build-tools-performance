# Rspack popular-libs 前 5 个体积落后 case 分析

- 报告基线: `reports/popular-libs-size-report.md`，生成时间 `2026-04-03T05:26:58.879Z`
- 选取方式: 按报告中 `Rspack 有提升空间的 case` 表的排序，取前 5 个 case
- 结论先看: 这 5 个 case 里，我没有找到能单靠 `mainFields` / `conditionNames` / 错误入口命中解释掉的大差距。主因基本都落在 `tree shaking / usedExports` 粒度上，其中 4 个都和 Vue 运行时代码被过度保留有关。

## Top 5 概览

| Case | Rspack | Best | Raw gap | Gzip gap | 归类 |
| --- | --- | --- | --- | --- | --- |
| `vue-i18n` | 176.1 / 63.7 kB | Rollup 79.2 / 27.0 kB | +96.9 kB | +36.7 kB | 功能差距 |
| `@headlessui/vue` | 93.8 / 30.9 kB | Rollup 58.5 / 20.9 kB | +35.3 kB | +10.0 kB | 功能差距 |
| `@vueuse/core` | 27.0 / 10.4 kB | Rollup 2.7 / 1.1 kB | +24.4 kB | +9.3 kB | 功能差距 |
| `three` | 120.5 / 33.5 kB | Rollup 84.0 / 24.2 kB | +36.5 kB | +9.3 kB | 功能差距 |
| `@heroicons/vue` | 26.4 / 10.3 kB | Rollup 6.1 / 2.7 kB | +20.3 kB | +7.7 kB | 功能差距 |

## 总体判断

1. `vue-i18n`、`@headlessui/vue`、`@heroicons/vue`、`@vueuse/core` 都属于 Vue 生态 case。共同模式是:
   - Rollup 与 Rspack 命中的库入口/子模块基本一致。
   - 真正的差距主要出现在 `vue` / `@vue/runtime-core` / `@vue/runtime-dom` / `@vue/shared` 这些运行时模块的裁剪结果上。
   - Rspack 的 `usedExports` 判定更保守，Rollup 能把更多未使用导出和分支删掉。
2. `three` 不是入口解析问题，而是超大单文件 ESM(`three/build/three.core.js`)的细粒度 DCE 差距。
3. 这 5 个 case 里，没有证据表明“把 Rspack 的 resolve 配置改成和 Rollup 一样”就能抹平主要差距。
4. 当前 benchmark 配置没有统一注入 Vue / vue-i18n feature flags，这会影响所有 bundler 的绝对体积；但它不是这 5 个 case 中 Rspack 落后于 Rollup 的主因，因为 Rollup 在同样条件下仍然明显更小。

## 逐 case 分析

### 1. `vue-i18n`

结论:
- 主要问题不是命中了错误入口，而是 `vue-i18n -> vue` 这条链上的 tree shaking 过于保守。
- `@intlify/message-compiler` 和 `@vue/devtools-api` 在 Rollup 和 Rspack 中都存在，它们是基础成本，不是 Rspack 独有的额外成本。

证据:
- Rspack 与 Rollup 都命中 `vue-i18n/dist/vue-i18n.mjs`，没有发现“Rspack 走了更差的 browser / node / cjs 入口”。
- Rspack 的分析结果里，`vue/dist/vue.runtime.esm-bundler.js` 出现 `usedExports: true`，等价于“整模块导出面被视为都可能用到”。
- Rspack 的 `@vue/runtime-dom` / `@vue/runtime-core` 中还能看到 `createApp`、`defineAsyncComponent`、`TransitionGroup`、SSR / hydration API 等大量并不属于这个 case 所需能力的导出都被标记为 used。
- Rollup 对同样模块的结果明显更窄。例如 `@vue/runtime-core` 的 `renderedExports` 只剩下一小部分真正需要的 API。

归因:
- `vue-i18n.mjs` 内部同时使用了 `import * as Vue from 'vue'` 和多处 named imports。Rspack 在这类 namespace import 场景下明显更保守，导致 Vue runtime 被过量保留。
- 这是能力差距，不是配置未对齐。

验证路径:
1. 先执行 `node ./scripts/generate-popular-libs-size-report.ts`，确认 `vue-i18n` 仍然在前 5。
2. 执行 `node ./scripts/analyze-popular-libs-case.ts --case vue-i18n`。
3. 打开 `cases/popular-libs/.analysis/vue-i18n-analysis/rspack/summary.json`，搜索:
   - `vue-i18n/dist/vue-i18n.mjs`
   - `vue.runtime.esm-bundler.js`
   - `@vue/runtime-core/dist/runtime-core.esm-bundler.js`
4. 重点看 `usedExports`:
   - 如果 `vue.runtime.esm-bundler.js` 是 `true`
   - 或 `runtime-core/runtime-dom` 中出现大量明显无关的 Vue API
   那就能验证“问题在 Vue runtime 过度保留”。
5. 对比 `cases/popular-libs/.analysis/vue-i18n-analysis/rollup/summary.json` 里的 `renderedExports` / `removedExports`。

### 2. `@headlessui/vue`

结论:
- 不是 Rspack 把整个 `@headlessui/vue` 所有组件都打进来了。
- 两边保留的 HeadlessUI 模块集合基本一致，差距主要来自 Vue runtime 被 Rspack 保留得更多。

证据:
- Rspack 只命中了 `combobox.js`、`dialog.js` 以及它们的依赖模块，没有发现 `disclosure` / `menu` / `tabs` / `listbox` 这类无关组件模块。
- Rollup 的模块图与之相近。
- 但在 Vue 运行时部分，Rspack 的 `usedExports` 远宽于 Rollup，尤其是 `@vue/runtime-core` / `@vue/runtime-dom` / `@vue/shared`。

归因:
- 这是“相同模块图下，Rspack 对 Vue 运行时内部代码裁剪不如 Rollup”的问题。
- 仍然属于 tree shaking / usedExports 粒度差距，不是 resolve 配置问题。

验证路径:
1. 执行 `node ./scripts/analyze-popular-libs-case.ts --case headlessui-vue`。
2. 打开 `cases/popular-libs/.analysis/headlessui-vue-analysis/rspack/summary.json`，确认命中的 HeadlessUI 主模块主要是:
   - `components/combobox/combobox.js`
   - `components/dialog/dialog.js`
   - 以及 `focus-trap` / `portal` / `render` 等真实依赖
3. 对比 `cases/popular-libs/.analysis/headlessui-vue-analysis/rollup/summary.json` 里 `runtime-core` / `runtime-dom` / `shared` 的 `renderedExports`。
4. 如果两边 HeadlessUI 模块图相近，但 Vue runtime 裁剪结果差异很大，就能验证本报告结论。

### 3. `@vueuse/core`

结论:
- 这 3 个被测 API 实际都来自 `@vueuse/shared` 的 re-export。
- Rspack 并没有错误地把整个 `@vueuse/core` 全带进来，问题在于 `@vueuse/shared/dist/index.js` 这种单文件 bundle 的内部裁剪不够干净。

证据:
- Rspack 的分析结果里，核心模块其实是 `@vueuse/shared/dist/index.js`，没有额外的大块 `@vueuse/core` 自身逻辑被拉进来。
- Rspack 对 `@vueuse/shared/dist/index.js` 的 `usedExports` 只有 3 个: `createGlobalState`、`useDebounceFn`、`useThrottleFn`。
- 但 Rollup 的结果显示，同一个文件最后只保留了很小的一部分渲染结果，`renderedLength` 只有约 5.7 kB，并且 `renderedExports` 只剩 7 个左右的最小必要导出。
- 同时 Rspack 在 Vue runtime 上依然比 Rollup 更保守。

归因:
- 这是典型的“超大单文件 ESM + re-export + helper 链路”上的细粒度 DCE 能力差距。
- 不属于配置未配对。

验证路径:
1. 执行 `node ./scripts/analyze-popular-libs-case.ts --case vueuse-core`。
2. 打开 `cases/popular-libs/.analysis/vueuse-core-analysis/rspack/summary.json`，确认主体是 `@vueuse/shared/dist/index.js`。
3. 再查看 `cases/popular-libs/.analysis/vueuse-core-analysis/rollup/summary.json`。
4. 对比两个 `summary.json`:
   - Rspack: `@vueuse/shared/dist/index.js` 只有 module-level `usedExports`
   - Rollup: 同一模块的 `removedExports` 很长，`renderedExports` 很短
5. 这能直接验证“不是入口选错，而是模块内部裁剪不够细”。

### 4. `three`

结论:
- 两边都命中 `three/build/three.core.js`。
- 差距来自单文件巨模块内部的 DCE 能力，而不是入口/子路径选择。

证据:
- Rspack 的 `usedExports` 只有 `BoxGeometry`、`Color`、`Vector3`。
- 但 Rollup 对同一个 `three.core.js` 给出了极长的 `removedExports` 列表，说明它实际删掉了大量未使用类型和类。
- 我在 Rspack 的 no-minify 输出里能直接 grep 到未使用类定义:
   - `class PerspectiveCamera`
   - `class AmbientLight`
   - `class AnimationMixer`
   - `class WebGLRenderTarget`
- Rollup 的 no-minify 输出里这些词只剩注释引用，没有类定义本体。

归因:
- 这是 Rspack 在超大 ESM 单文件上的细粒度 tree shaking 明显弱于 Rollup。

验证路径:
1. 执行 `node ./scripts/analyze-popular-libs-case.ts --case three`。
2. 查看 `cases/popular-libs/.analysis/three-analysis/rspack/summary.json`，确认只请求了 `BoxGeometry` / `Color` / `Vector3`。
3. 在输出目录里 grep:
   - `rg -n "class PerspectiveCamera|class AmbientLight|class AnimationMixer|class WebGLRenderTarget" cases/popular-libs/.analysis/three-analysis/rspack`
4. 再查看 `cases/popular-libs/.analysis/three-analysis/rollup/summary.json`。
5. 对 Rollup 输出做同样 grep:
   - 若只剩注释命中、没有类定义本体，就能验证 Rollup 删掉了这些未使用能力，而 Rspack 没删干净。

### 5. `@heroicons/vue`

结论:
- 图标模块命中是正确的，Rspack 也只打进了 3 个 icon ESM 文件。
- 差距几乎完全来自 Vue runtime 的保留过宽，不是 icon barrel 没抖干净。

证据:
- Rspack 和 Rollup 都只包含:
   - `AcademicCapIcon.js`
   - `AdjustmentsHorizontalIcon.js`
   - `ArchiveBoxIcon.js`
- 但 Rspack 的 `@vue/runtime-core` / `@vue/runtime-dom` / `@vue/shared` 依然保留了比 Rollup 更宽的代码面。

归因:
- 本质上和 `@headlessui/vue` 一样，属于 Vue runtime tree shaking 差距。
- 不是 `@heroicons/vue` 自身入口或 re-export 配置问题。

验证路径:
1. 执行 `node ./scripts/analyze-popular-libs-case.ts --case heroicons-vue`。
2. 打开 `cases/popular-libs/.analysis/heroicons-vue-analysis/rspack/summary.json`，确认只有 3 个图标文件。
3. 再查看 `cases/popular-libs/.analysis/heroicons-vue-analysis/rollup/summary.json`。
4. 如果 icon 模块集合一致，但 Vue runtime 裁剪结果仍明显不同，就能验证主因不在 heroicons 包本身。

## 配置因素补充

我额外看了 benchmark 配置，当前只统一替换了 `process.env.NODE_ENV`:

- `shared/rollup.config.mjs`
- `shared/rspack.config.mjs`

没有统一注入的 feature flags 包括但不限于:

- Vue: `__VUE_OPTIONS_API__`、`__VUE_PROD_DEVTOOLS__`
- vue-i18n: `__VUE_I18N_FULL_INSTALL__`、`__VUE_I18N_LEGACY_API__`、`__INTLIFY_DROP_MESSAGE_COMPILER__`、`__INTLIFY_PROD_DEVTOOLS__`

这个点值得后续做一轮“绝对最小体积”的补齐验证，但我不把它列为 top 5 的主因，原因是:

1. 这些 flag 当前对所有 bundler 都没有统一配置。
2. 在同样前提下，Rollup 仍然远小于 Rspack。
3. 我对 top 5 做的模块级比对已经足够说明主差距来自 DCE / usedExports 粒度，而不是 resolve/define 的简单未对齐。

## 建议的后续排查顺序

1. 先优先盯 Vue runtime 相关 case:
   - `vue-i18n`
   - `@headlessui/vue`
   - `@heroicons/vue`
2. 再单独盯“超大单文件 ESM”能力:
   - `@vueuse/shared/dist/index.js`
   - `three/build/three.core.js`
3. 如果要继续往前推进:
   - 先做 `usedExports` / namespace import 相关能力验证
   - 再做 feature flags 对齐验证
   - 最后才看是否需要补 benchmark 配置差异
