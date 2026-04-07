# Standard: ui-components

## Q2: 产物优化

> Q2 关注所有可能对产物造成冗余的问题，按以下子类检查：

### Q2-A: 重复包

#### [CHECK] 识别出多个 UI 框架共存的依赖冗余

package.json 中同时依赖了 @mui/material、@chakra-ui/react、antd、react-bootstrap、
@mantine/core、@fluentui/react、@headlessui/react 等多个 React UI 框架，以及
element-plus、vuetify、vant 等 Vue UI 框架，存在严重的依赖冗余。

### Q2-B: 跨 chunk 相同 module 打包问题

#### [CHECK] 识别出 cross-chunks-a 和 cross-chunks-b 共享 antd 和 @mui/material

两个入口都引入了 antd（Button、Input、Select、Table 等）和 @mui/material 的大量组件。

#### [CHECK] 指出 splitChunks: false 导致共享依赖在两个 chunk 中各自打包一份

rspack.config.mjs 中 optimization.splitChunks 被设为 false，
导致 antd、@mui/material 等共享依赖被重复打包到两个不同的 chunk 中。

#### [CHECK] 关联 Rsdoctor E1002 规则

识别出该问题对应 Rsdoctor 的 E1002（Cross Chunks Package）规则。

#### [CHECK] 建议启用 splitChunks 配置 cacheGroups 提取公共依赖

建议配置 optimization.splitChunks.cacheGroups 提取 antd 和 @mui/material 等共享依赖为独立 chunk。

#### [CHECK] 识别出 shared/ 模块同时被同步 import 和动态 import() 引用

module-mixed-chunks 入口同步 import 了 shared/analytics.js、shared/chart-helpers.js、shared/user-info.js，
同时通过 import() 动态加载 lazy 页面，而 lazy 页面内部又同步引用了同一批 shared 模块。

#### [CHECK] 指出 splitChunks: false 导致 shared 模块被复制到 async chunk

由于 splitChunks 被禁用，async chunk 会将 shared 模块再打包一份，
导致同一模块同时出现在 initial chunk 和 async chunk 中。

#### [CHECK] 关联 Rsdoctor E1006 规则

识别出该问题对应 Rsdoctor 的 E1006（Module Mixed Chunks）规则。

#### [CHECK] 建议启用 splitChunks 或重构 import 方式解决模块重复

建议启用 splitChunks 让共享模块被提取到独立 chunk，或调整 lazy 页面的导入方式。

#### [CHECK] 指出 splitChunks: false 是 E1001/E1002/E1006 多个问题的共同根因

当前配置中 optimization.splitChunks: false 导致了跨 chunk 重复和模块混合等多个问题。

## Q3: 重复包

### [CHECK] 识别出 @emotion/hash 存在多版本重复（0.8.0 与 0.9.2）

项目中 @emotion/hash 同时存在两个版本，被不同依赖链引入：

**版本 0.8.0 — 由 antd 引入：**

```text
antd@6.3.5
  └─ @ant-design/cssinjs@2.1.2
       └─ @emotion/hash@0.8.0
```

**版本 0.9.2 — 由 @mui/material 和 @chakra-ui/react 引入：**

```text
@mui/material@7.x
  └─ @mui/styled-engine
       └─ @emotion/styled@11.14.1
            └─ @emotion/serialize@1.3.3
                 └─ @emotion/hash@0.9.2

@chakra-ui/react@3.x
  └─ @emotion/react@11.14.0
       └─ @emotion/serialize@1.3.3
            └─ @emotion/hash@0.9.2
```

### [CHECK] 识别出 @emotion/unitless 存在多版本重复（0.7.5 与 0.10.0）

项目中 @emotion/unitless 同时存在两个版本，被不同依赖链引入：

**版本 0.7.5 — 由 antd 引入：**

```text
antd@6.3.5
  └─ @ant-design/cssinjs@2.1.2
       └─ @emotion/unitless@0.7.5
```

**版本 0.10.0 — 由 @mui/material、@chakra-ui/react 引入：**

```text
@mui/material@7.x / @chakra-ui/react@3.x
  └─ @emotion/serialize@1.3.3
       └─ @emotion/unitless@0.10.0

@chakra-ui/react@3.x
  └─ styled-components@6.3.12
       └─ @emotion/unitless@0.10.0
```

### [CHECK] 指出冲突根因是 antd 的 @ant-design/cssinjs 与 @emotion 生态版本不一致

antd 通过 @ant-design/cssinjs 依赖了 @emotion/hash@0.8.0 和 @emotion/unitless@0.7.5（旧版），
而 @mui/material 和 @chakra-ui/react 通过 @emotion/serialize 依赖了 @emotion/hash@0.9.2 和
@emotion/unitless@0.10.0（新版）。两条依赖链对 @emotion 子包的版本要求不同，导致同一包被打包两份。

### [CHECK] 关联 Rsdoctor E1001 规则

识别出该问题对应 Rsdoctor 的 E1001（Duplicate Packages）规则。

### [CHECK] 建议使用 resolve.alias 或 pnpm overrides 统一重复包版本

**方案 1 — resolve.alias（构建侧）：** 在 rspack.config.mjs 中统一指向新版：

```js
resolve: {
  alias: {
    '@emotion/hash': path.resolve('node_modules/@emotion/hash'),       // → 0.9.2
    '@emotion/unitless': path.resolve('node_modules/@emotion/unitless') // → 0.10.0
  }
}
```

**方案 2 — pnpm overrides（包管理侧）：** 在根 package.json 中强制统一版本：

```json
{
  "pnpm": {
    "overrides": {
      "@emotion/hash": "0.9.2",
      "@emotion/unitless": "0.10.0"
    }
  }
}
```
