# Build Tools Comparison

Benchmark comparing JavaScript bundlers and build tools ([Rspack](https://github.com/web-infra-dev/rspack), [Rsbuild](https://github.com/web-infra-dev/rsbuild), [webpack](https://github.com/webpack/webpack), [Vite](https://github.com/vitejs/vite), [Rolldown](https://github.com/rolldown/rolldown), [esbuild](https://github.com/evanw/esbuild), [Rollup](https://github.com/rollup/rollup), [Parcel](https://github.com/parcel-bundler/parcel) and [Farm](https://github.com/farm-fe/farm)) for dev server startup time, build performance and bundle size for applications with different module sizes.

## Metrics

| Name                     | Description                                                                |
| ------------------------ | -------------------------------------------------------------------------- |
| **Startup (no cache)**   | Time from starting the dev server to page loaded                           |
| **Startup (with cache)** | Time from starting the dev server to page loaded with cache                |
| **HMR**                  | Time to HMR after changing a module                                        |
| **Build (no cache)**     | Time taken to build the production bundles                                 |
| **Build (with cache)**   | Time taken to build the production bundles with cache                      |
| **Memory (RSS)**         | Memory usage at the end of a cold start or production build                |
| **Output size**          | Total size of the output bundle, minified with the default minifier        |
| **Gzipped size**         | Gzipped size of the output bundle, represents actual network transfer size |

## Notes

- Build target is set to `es2022` (`Chrome >= 93`) for all tools.
- Minification is enabled in production for all tools.
- Source map is enabled in development and disabled in production for all tools.
- Benchmarks run on GitHub Actions with variable hardware, which may cause inconsistent results.

Tooling details:

- webpack is configured to use SWC instead of Babel / Terser.
- Vite uses Rolldown and Oxc.

## Results

> Data from GitHub Actions: https://github.com/rstackjs/build-tools-performance/actions/runs/23903855579 (2026-04-02)

---

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

Development metrics:

| Name                  | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| --------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.0-rc.0 | 1608ms🥈           | 1094ms🥇             | 175ms   | 347MB🥈      |
| Rsbuild 2.0.0-rc.0    | 1495ms🥇           | 1180ms🥉             | 174ms🥉 | 319MB🥇      |
| Vite 8.0.3            | 6496ms             | 5237ms               | 104ms🥇 | 513MB🥉      |
| webpack 5.105.4       | 5717ms             | 3502ms               | 609ms   | 852MB        |
| Farm 1.7.11           | 1882ms🥉           | 1176ms🥈             | 130ms🥈 | 544MB        |
| Parcel 2.16.4         | 5367ms             | 1541ms               | 437ms   | 1147MB       |

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-rc.0 | 1076ms🥉         | 660ms🥇            | 275MB🥇      | 846.4kB🥉   | 222.1kB      |
| Rsbuild 2.0.0-rc.0    | 997ms🥈          | 798ms🥈            | 283MB🥈      | 873.6kB     | 215.4kB🥇    |
| Vite 8.0.3            | 914ms🥇          | 864ms🥉            | 300MB🥉      | 823.3kB🥇   | 217.9kB🥈    |
| webpack 5.105.4       | 5363ms           | 1902ms             | 692MB        | 845.9kB🥈   | 221.7kB🥉    |
| Farm 1.7.11           | 2308ms           | 1428ms             | 389MB        | 1089.1kB    | 258.4kB      |
| Parcel 2.16.4         | 4958ms           | 1318ms             | 1086MB       | 965.6kB     | 230.9kB      |

---

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

Development metrics:

| Name                  | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| --------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.0-rc.0 | 1067ms🥈           | 966ms🥈              | 109ms🥇 | 282MB🥈      |
| Rsbuild 2.0.0-rc.0    | 1042ms🥇           | 896ms🥇              | 136ms🥈 | 265MB🥇      |
| Vite 8.0.3            | 5588ms             | 4460ms               | 137ms🥉 | 768MB        |
| webpack 5.105.4       | 15925ms            | 10481ms              | 3456ms  | 1684MB       |
| Farm 1.7.11           | 1540ms🥉           | 1127ms🥉             | 175ms   | 519MB🥉      |
| Parcel 2.16.4         | 14981ms            | 3047ms               | 837ms   | 1745MB       |

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-rc.0 | 2138ms🥈         | 1437ms🥈           | 594MB🥇      | 2825.8kB🥉  | 680.3kB🥈    |
| Rsbuild 2.0.0-rc.0    | 2190ms🥉         | 1505ms🥉           | 610MB🥈      | 2852.4kB    | 680.3kB🥉    |
| Vite 8.0.3            | 1560ms🥇         | 1391ms🥇           | 685MB        | 2630.3kB🥇  | 692.8kB      |
| webpack 5.105.4       | 14343ms          | 4019ms             | 1227MB       | 2825.4kB🥈  | 679.3kB🥇    |
| Farm 1.7.11           | 6842ms           | 2385ms             | 613MB🥉      | 3544.5kB    | 805.1kB      |
| Parcel 2.16.4         | 11755ms          | 1984ms             | 2014MB       | 3489.0kB    | 766.5kB      |

---

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

Development metrics:

| Name                  | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| --------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.0-rc.0 | 1116ms🥈           | 1030ms🥈             | 127ms🥇 | 357MB🥈      |
| Rsbuild 2.0.0-rc.0    | 1045ms🥇           | 920ms🥇              | 152ms🥈 | 322MB🥇      |
| Vite 8.0.3            | 6639ms🥉           | 4098ms🥉             | 154ms🥉 | 1219MB🥉     |
| webpack 5.105.4       | 19334ms            | 18977ms              | 2314ms  | 2191MB       |

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-rc.0 | 3010ms🥈         | 2226ms🥉           | 1098MB🥇     | 5934.4kB🥉  | 1368.8kB🥉   |
| Rsbuild 2.0.0-rc.0    | 3285ms🥉         | 1967ms🥈           | 1109MB🥈     | 5984.7kB    | 1367.7kB🥇   |
| Vite 8.0.3            | 2034ms🥇         | 1805ms🥇           | 1244MB🥉     | 5465.1kB🥇  | 1417.0kB     |
| webpack 5.105.4       | 29679ms          | 5916ms             | 1852MB       | 5934.0kB🥈  | 1368.0kB🥈   |

---

### ui-components

A React app that imports UI components from several popular UI libraries.

Including [@mui/material](https://npmjs.com/package/@mui/material), [@radix-ui/themes](https://npmjs.com/package/@radix-ui/themes), [antd](https://npmjs.com/package/antd), [antd-mobile](https://npmjs.com/package/antd-mobile), [@chakra-ui/react](https://npmjs.com/package/@chakra-ui/react), [@fluentui/react](https://npmjs.com/package/@fluentui/react), [@headlessui/react](https://npmjs.com/package/@headlessui/react), [@mantine/core](https://npmjs.com/package/@mantine/core), [react-bootstrap](https://npmjs.com/package/react-bootstrap), [primereact](https://npmjs.com/package/primereact), [rsuite](https://npmjs.com/package/rsuite), [@arco-design/web-react](https://npmjs.com/package/@arco-design/web-react), [@coreui/react](https://npmjs.com/package/@coreui/react), [element-plus](https://npmjs.com/package/element-plus), [ant-design-vue](https://npmjs.com/package/ant-design-vue), [naive-ui](https://npmjs.com/package/naive-ui), [primevue](https://npmjs.com/package/primevue), [vant](https://npmjs.com/package/vant), and [vuetify](https://npmjs.com/package/vuetify).

```bash
CASE=ui-components pnpm benchmark
```

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-rc.0 | 3014ms           | 1986ms🥈           | 645MB🥇      | 2376.6kB    | 682.0kB🥉    |
| Rsbuild 2.0.0-rc.0    | 2933ms🥉         | 2430ms             | 714MB🥈      | 2188.1kB🥈  | 676.4kB🥇    |
| Vite 8.0.3            | 2092ms🥇         | 2203ms             | 982MB🥉      | 2208.4kB🥉  | 683.9kB      |
| webpack 5.105.4       | 22563ms          | 13181ms            | 1722MB       | 2184.5kB🥇  | 676.8kB🥈    |
| esbuild 0.27.4        | 2692ms🥈         | 2038ms🥉           | N/A          | 3095.1kB    | 942.9kB      |
| Farm 1.7.11           | 11259ms          | 2815ms             | 1382MB       | 4128.5kB    | 1430.2kB     |
| Parcel 2.16.4         | 17493ms          | 1834ms🥇           | 2105MB       | 2225.0kB    | 683.9kB      |

---

### popular-libs

A browser app that imports a small number of live exports from 50 popular,
modern frontend libraries to compare tree-shaking quality across bundlers.

It keeps the original React/Vue/state/data set and adds 30 more mainstream
frontend packages with ESM-friendly entry points where practical, including
[axios](https://npmjs.com/package/axios),
[dayjs](https://npmjs.com/package/dayjs),
[clsx](https://npmjs.com/package/clsx),
[tailwind-merge](https://npmjs.com/package/tailwind-merge),
[class-variance-authority](https://npmjs.com/package/class-variance-authority),
[i18next](https://npmjs.com/package/i18next),
[react-i18next](https://npmjs.com/package/react-i18next),
[vue-i18n](https://npmjs.com/package/vue-i18n),
[immer](https://npmjs.com/package/immer),
[swr](https://npmjs.com/package/swr),
[framer-motion](https://npmjs.com/package/framer-motion),
[three](https://npmjs.com/package/three),
[lucide-react](https://npmjs.com/package/lucide-react),
[@headlessui/react](https://npmjs.com/package/@headlessui/react),
[@headlessui/vue](https://npmjs.com/package/@headlessui/vue),
[@heroicons/react](https://npmjs.com/package/@heroicons/react),
[@heroicons/vue](https://npmjs.com/package/@heroicons/vue),
[@radix-ui/react-slot](https://npmjs.com/package/@radix-ui/react-slot),
[query-string](https://npmjs.com/package/query-string),
[mitt](https://npmjs.com/package/mitt),
[fuse.js](https://npmjs.com/package/fuse.js),
[idb](https://npmjs.com/package/idb),
[dexie](https://npmjs.com/package/dexie),
[ky](https://npmjs.com/package/ky),
[lit](https://npmjs.com/package/lit),
[xstate](https://npmjs.com/package/xstate),
[preact](https://npmjs.com/package/preact),
[solid-js](https://npmjs.com/package/solid-js),
[swiper](https://npmjs.com/package/swiper), and
[remeda](https://npmjs.com/package/remeda).

```bash
CASE=popular-libs pnpm benchmark
```

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-rc.0 | 1140ms           | 1012ms             | 524MB🥇      | 1768.4kB    | 551.9kB      |
| Rsbuild 2.0.0-rc.0    | 1188ms           | 1068ms             | 542MB🥈      | 1767.5kB🥉  | 551.6kB🥉    |
| Vite 8.0.3            | 752ms🥈          | 775ms🥇            | 709MB        | 1751.1kB🥇  | 550.0kB🥇    |
| Rolldown 1.0.0-rc.12  | 680ms🥇          | 833ms🥉            | 632MB🥉      | 1756.4kB🥈  | 550.4kB🥈    |
| webpack 5.105.4       | 5483ms           | 1322ms             | 1348MB       | 1768.3kB    | 552.8kB      |
| esbuild 0.27.4        | 931ms🥉          | 812ms🥈            | N/A          | 2052.5kB    | 621.8kB      |
| Farm 1.7.11           | 1730ms           | 1254ms             | 829MB        | 2231.9kB    | 755.8kB      |

---

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-rc.0 | 560ms🥉          | 470ms              | 235MB🥈      | 1007.8kB🥉  | 270.9kB🥉    |
| Rsbuild 2.0.0-rc.0    | 606ms            | 467ms🥉            | 246MB🥉      | 1007.6kB🥈  | 270.8kB🥈    |
| Rolldown 1.0.0-rc.12  | 306ms🥈          | 284ms🥈            | 230MB🥇      | 1012.2kB    | 271.8kB      |
| webpack 5.105.4       | 2970ms           | 889ms              | 626MB        | 1006.0kB🥇  | 270.6kB🥇    |
| esbuild 0.27.4        | 243ms🥇          | 244ms🥇            | N/A          | 1025.2kB    | 276.7kB      |

---

## Run locally

Run the `benchmark.ts` script to get the results (requires Node.js >= 22):

```bash
# Run the benchmark for the react-5k case
pnpm benchmark

# Run the benchmark for the react-10k case
CASE=react-10k pnpm benchmark
```

If you want to start the project with the specified tool, try:

```bash
pnpm i # install dependencies

# Cd to the case directory
cd cases/react-5k
cd cases/react-10k
cd cases/popular-libs

# Dev server
pnpm start:rspack # Start Rspack
pnpm start:rsbuild # Start Rsbuild
pnpm start:webpack # Start webpack
pnpm start:vite # Start Vite
pnpm start:farm # Start Farm

# Build
pnpm build:rspack # Build Rspack
pnpm build:rsbuild # Build Rsbuild
pnpm build:webpack # Build webpack
pnpm build:vite # Build Vite
pnpm build:farm # Build Farm
```

### Options

Use `CASE` to switch the benchmark case:

```bash
CASE=react-1k pnpm benchmark
CASE=react-5k pnpm benchmark
CASE=react-10k pnpm benchmark
CASE=popular-libs pnpm benchmark
```

Use `TOOLS` to specify the build tools or bundlers:

```bash
# Run with all tools
TOOLS=all pnpm benchmark

# Run Rspack and Rsbuild
TOOLS=rspack,rsbuild pnpm benchmark
```

Use `RUN_TIMES` to specify the number of runs (defaults to `3`):

```bash
RUN_TIMES=3 pnpm benchmark
```

Use `WARMUP_TIMES` to specify the number of warmup runs (defaults to `2`):

```bash
WARMUP_TIMES=2 pnpm benchmark
```

Use `FARM=true` to run Farm:

```bash
FARM=true pnpm benchmark
```

## Credits

Forked from [farm-fe/performance-compare](https://github.com/farm-fe/performance-compare), thanks to the Farm team!
