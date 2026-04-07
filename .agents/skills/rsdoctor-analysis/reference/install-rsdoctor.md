# Install Rsdoctor Plugin

This documentation has been split into project-specific guides:

## Choose Your Project Type

- **For Rspack/Rsbuild/Modern.js projects:** See [install-rsdoctor-rspack.md](./install-rsdoctor-rspack.md)
- **For Webpack projects:** See [install-rsdoctor-webpack.md](./install-rsdoctor-webpack.md)

## Quick Decision Guide

**Determine your project type:**

1. **Check project type** (`projectType`):
   - If project uses **Rspack** (including Rsbuild, Rslib, or any Rspack-based project) → Use `projectType: 'rspack'` → See [install-rsdoctor-rspack.md](./install-rsdoctor-rspack.md)
   - If project uses **Webpack** (webpack >= 5) → Use `projectType: 'webpack'` → See [install-rsdoctor-webpack.md](./install-rsdoctor-webpack.md)

2. **Check framework** (`framework`):
   - If using **Rspack CLI** → `framework: 'rspack'` → See [install-rsdoctor-rspack.md](./install-rsdoctor-rspack.md)
   - If using **Rsbuild** → `framework: 'rsbuild'` → See [install-rsdoctor-rspack.md](./install-rsdoctor-rspack.md)
   - If using **Modern.js** → `framework: 'modern.js'` → See [install-rsdoctor-rspack.md](./install-rsdoctor-rspack.md)
   - If using **Rslib** → `framework: 'rslib'` → See [install-rsdoctor-rspack.md](./install-rsdoctor-rspack.md)
   - If using **Rspress** → `framework: 'rspress'` → See [install-rsdoctor-rspack.md](./install-rsdoctor-rspack.md)
   - If using **Webpack** → `framework: 'webpack'` → See [install-rsdoctor-webpack.md](./install-rsdoctor-webpack.md)

**Decision flow:**

```
User's project
├─ Is it Rspack-based? (Rsbuild, Rslib, Rspress, etc.)
│  ├─ Yes → projectType: 'rspack'
│  │  ├─ Rspack CLI? → framework: 'rspack' → install-rsdoctor-rspack.md
│  │  ├─ Rsbuild? → framework: 'rsbuild' → install-rsdoctor-rspack.md
│  │  ├─ Rslib? → framework: 'rslib' → install-rsdoctor-rspack.md
│  │  ├─ Rspress? → framework: 'rspress' → install-rsdoctor-rspack.md
│  │  └─ Modern.js? → framework: 'modern.js' → install-rsdoctor-rspack.md
│  └─ No → Is it Webpack >= 5?
│     └─ Yes → projectType: 'webpack', framework: 'webpack' → install-rsdoctor-webpack.md
```
