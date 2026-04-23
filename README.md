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

> Data from GitHub Actions: https://github.com/rstackjs/build-tools-performance/actions/runs/24771343987 (2026-04-22)

---

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

Development metrics:

| Name             | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ---------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.0 | 1394ms🥇           | 930ms🥇              | 146ms🥉 | 350MB🥈      |
| Rsbuild 2.0.0    | 1562ms🥈           | 998ms🥈              | 166ms   | 324MB🥇      |
| Vite 8.0.9       | 7111ms             | 5206ms               | 89ms🥇  | 509MB🥉      |
| webpack 5.106.2  | 7541ms             | 4288ms               | 755ms   | 858MB        |
| Farm 1.7.11      | 2122ms🥉           | 1003ms🥉             | 137ms🥈 | 550MB        |
| Parcel 2.16.4    | 5050ms             | 1257ms               | 361ms   | 1093MB       |

Build metrics:

| Name             | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0 | 993ms🥉          | 514ms🥇            | 282MB🥇      | 846.2kB🥈   | 222.0kB      |
| Rsbuild 2.0.0    | 862ms🥈          | 556ms🥈            | 289MB🥈      | 873.5kB     | 215.3kB🥇    |
| Vite 8.0.9       | 624ms🥇          | 703ms🥉            | 302MB🥉      | 823.8kB🥇   | 218.0kB🥈    |
| webpack 5.106.2  | 6538ms           | 1956ms             | 697MB        | 846.5kB🥉   | 221.9kB🥉    |
| Farm 1.7.11      | 2346ms           | 1262ms             | 397MB        | 1089.7kB    | 256.8kB      |
| Parcel 2.16.4    | 4770ms           | 1038ms             | 1106MB       | 966.2kB     | 231.0kB      |

---

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

Development metrics:

| Name             | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ---------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.0 | 745ms🥇            | 607ms🥉              | 106ms🥇 | 288MB🥈      |
| Rsbuild 2.0.0    | 750ms🥈            | 547ms🥇              | 126ms🥉 | 268MB🥇      |
| Vite 8.0.9       | 3318ms             | 2108ms               | 114ms🥈 | 754MB        |
| webpack 5.106.2  | 8246ms             | 8706ms               | 1209ms  | 1573MB       |
| Farm 1.7.11      | 1102ms🥉           | 597ms🥈              | 142ms   | 514MB🥉      |
| Parcel 2.16.4    | 8904ms             | 1108ms               | 433ms   | 1795MB       |

Build metrics:

| Name             | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0 | 1592ms🥉         | 855ms🥈            | 636MB🥈      | 2825.6kB🥈  | 680.1kB🥈    |
| Rsbuild 2.0.0    | 1511ms🥈         | 811ms🥇            | 648MB🥉      | 2852.2kB    | 680.2kB🥉    |
| Vite 8.0.9       | 984ms🥇          | 1003ms🥉           | 692MB        | 2630.9kB🥇  | 693.0kB      |
| webpack 5.106.2  | 9457ms           | 2569ms             | 1238MB       | 2826.0kB🥉  | 679.4kB🥇    |
| Farm 1.7.11      | 3911ms           | 1676ms             | 614MB🥇      | 3545.1kB    | 798.5kB      |
| Parcel 2.16.4    | 8583ms           | 1511ms             | 1973MB       | 3489.6kB    | 766.6kB      |

---

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

Development metrics:

| Name             | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ---------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.0 | 1862ms🥇           | 1284ms🥇             | 166ms🥈 | 355MB🥈      |
| Rsbuild 2.0.0    | 1906ms🥈           | 1623ms🥈             | 231ms🥉 | 324MB🥇      |
| Vite 8.0.9       | 11149ms🥉          | 6885ms🥉             | 130ms🥇 | 1158MB🥉     |
| webpack 5.106.2  | 33407ms            | 30613ms              | 7920ms  | 2204MB       |

Build metrics:

| Name             | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0 | 8310ms🥉         | 2387ms🥇           | 1141MB🥇     | 5934.1kB🥈  | 1368.6kB🥉   |
| Rsbuild 2.0.0    | 6464ms🥈         | 2639ms🥈           | 1153MB🥈     | 5984.5kB    | 1367.5kB🥇   |
| Vite 8.0.9       | 3327ms🥇         | 3198ms🥉           | 1250MB🥉     | 5465.7kB🥇  | 1417.1kB     |
| webpack 5.106.2  | 47639ms          | 8575ms             | 1836MB       | 5934.5kB🥉  | 1367.9kB🥈   |

---

### ui-components

A React app that imports UI components from several popular UI libraries.

Including [@mui/material](https://npmjs.com/package/@mui/material), [@radix-ui/themes](https://npmjs.com/package/@radix-ui/themes), [antd](https://npmjs.com/package/antd), [antd-mobile](https://npmjs.com/package/antd-mobile), [@chakra-ui/react](https://npmjs.com/package/@chakra-ui/react), [@fluentui/react](https://npmjs.com/package/@fluentui/react), [@headlessui/react](https://npmjs.com/package/@headlessui/react), [@mantine/core](https://npmjs.com/package/@mantine/core), [react-bootstrap](https://npmjs.com/package/react-bootstrap), [primereact](https://npmjs.com/package/primereact), [rsuite](https://npmjs.com/package/rsuite), [@arco-design/web-react](https://npmjs.com/package/@arco-design/web-react), [@coreui/react](https://npmjs.com/package/@coreui/react), [element-plus](https://npmjs.com/package/element-plus), [ant-design-vue](https://npmjs.com/package/ant-design-vue), [naive-ui](https://npmjs.com/package/naive-ui), [primevue](https://npmjs.com/package/primevue), [vant](https://npmjs.com/package/vant), and [vuetify](https://npmjs.com/package/vuetify).

```bash
CASE=ui-components pnpm benchmark
```

Build metrics:

| Name             | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0 | 6587ms🥈         | 2377ms🥇           | 1396MB🥇     | 5009.3kB🥇  | 1436.9kB🥇   |
| Rsbuild 2.0.0    | 8315ms           | 3543ms🥉           | 1506MB🥈     | 5009.3kB🥈  | 1437.0kB🥈   |
| Vite 8.0.9       | 7463ms🥉         | 5279ms             | 1672MB🥉     | 5018.3kB    | 1444.3kB     |
| webpack 5.106.2  | 37688ms          | 22247ms            | 2252MB       | 5012.8kB🥉  | 1438.8kB🥉   |
| esbuild 0.28.0   | 5783ms🥇         | 4934ms             | N/A          | 6146.4kB    | 1775.4kB     |
| Farm 1.7.11      | 16791ms          | 5267ms             | 2193MB       | 7962.8kB    | 2689.5kB     |
| Parcel 2.16.4    | 33749ms          | 2924ms🥈           | 2393MB       | 5273.3kB    | 1479.2kB     |

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

| Name                 | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| -------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0     | 2579ms           | 970ms🥇            | 438MB🥇      | 1781.4kB    | 556.8kB🥉    |
| Rsbuild 2.0.0        | 3042ms           | 2827ms             | 444MB🥈      | 1780.5kB    | 556.5kB🥈    |
| Vite 8.0.9           | 2002ms🥉         | 1667ms             | 655MB        | 1779.6kB🥉  | 558.5kB      |
| Rollup 4.60.2        | 14048ms          | 13186ms            | 1273MB       | 1612.8kB🥇  | 500.7kB🥇    |
| Rolldown 1.0.0-rc.16 | 1587ms🥇         | 1390ms🥉           | 588MB🥉      | 1777.6kB🥈  | 557.0kB      |
| webpack 5.106.2      | 16044ms          | 4050ms             | 1336MB       | 1789.3kB    | 557.9kB      |
| esbuild 0.28.0       | 1769ms🥈         | 1086ms🥈           | N/A          | 2076.6kB    | 628.5kB      |
| Farm 1.7.11          | 6671ms           | 2203ms             | 766MB        | 2247.9kB    | 761.1kB      |

---

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

Build metrics:

| Name                 | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| -------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0     | 1223ms🥉         | 324ms🥈            | 296MB🥉      | 1704.6kB    | 358.1kB      |
| Rsbuild 2.0.0        | 1314ms           | 488ms              | 245MB🥈      | 1008.1kB🥇  | 271.0kB🥇    |
| Rolldown 1.0.0-rc.16 | 431ms🥈          | 411ms🥉            | 223MB🥇      | 1012.2kB🥈  | 271.8kB🥈    |
| webpack 5.106.2      | 4655ms           | 1358ms             | 624MB        | 1044.2kB    | 275.7kB🥉    |
| esbuild 0.28.0       | 303ms🥇          | 279ms🥇            | N/A          | 1025.2kB🥉  | 276.7kB      |

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
