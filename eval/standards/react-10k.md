# Standard: react-10k

## Q2: 产物优化

> Q2 关注所有可能对产物造成冗余的问题，按以下子类检查：

### Q2-A: 跨 chunk 相同 module 打包问题

#### [CHECK] 建议为 react/react-dom/react-router-dom 配置 splitChunks 提取 vendor chunk

应配置 splitChunks 将 react、react-dom、react-router-dom 等框架依赖
提取为独立的长期缓存 chunk。

### Q2-B: 过大依赖包

#### [CHECK] 注意到 @iconify-icons/material-symbols 包可能体积较大

如果只使用少量图标，应考虑按需导入或使用更轻量的图标方案。


