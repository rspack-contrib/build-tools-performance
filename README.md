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

> Data from GitHub Actions: https://github.com/rstackjs/build-tools-performance/actions/runs/24564735293 (2026-04-18)

---

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

Development metrics:

| Name                  | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| --------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.0-rc.3 | 1311ms🥇           | 973ms🥈              | 133ms🥈 | 361MB🥈      |
| Rsbuild 2.0.0-rc.3    | 1365ms🥈           | 918ms🥇              | 156ms   | 316MB🥇      |
| Vite 8.0.8            | 6408ms             | 4173ms               | 123ms🥇 | 510MB🥉      |
| webpack 5.106.2       | 5344ms             | 3385ms               | 390ms   | 868MB        |
| Farm 1.7.11           | 1681ms🥉           | 1027ms🥉             | 135ms🥉 | 540MB        |
| Parcel 2.16.4         | 4393ms             | 1098ms               | 306ms   | 1099MB       |

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-rc.3 | 1155ms🥉         | 441ms🥇            | 282MB🥇      | 846.2kB🥈   | 222.0kB🥉    |
| Rsbuild 2.0.0-rc.3    | 773ms🥇          | 461ms🥈            | 283MB🥈      | 873.5kB     | 215.3kB🥇    |
| Vite 8.0.8            | 802ms🥈          | 608ms🥉            | 296MB🥉      | 826.3kB🥇   | 223.0kB      |
| webpack 5.106.2       | 6523ms           | 1897ms             | 685MB        | 846.5kB🥉   | 221.9kB🥈    |
| Farm 1.7.11           | 2053ms           | 1115ms             | 390MB        | 1089.7kB    | 256.9kB      |
| Parcel 2.16.4         | 4300ms           | 739ms              | 1065MB       | 966.2kB     | 231.0kB      |

---

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

Development metrics:

| Name                  | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| --------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.0-rc.3 | 1905ms🥈           | 1265ms🥈             | 240ms   | 299MB🥈      |
| Rsbuild 2.0.0-rc.3    | 1648ms🥇           | 1228ms🥇             | 154ms🥈 | 267MB🥇      |
| Vite 8.0.8            | 6934ms             | 4460ms               | 133ms🥇 | 748MB        |
| webpack 5.106.2       | 19335ms            | 18939ms              | 2651ms  | 1572MB       |
| Farm 1.7.11           | 2171ms🥉           | 1266ms🥉             | 190ms🥉 | 512MB🥉      |
| Parcel 2.16.4         | 19372ms            | 5976ms               | 1176ms  | 1811MB       |

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-rc.3 | 3380ms🥈         | 2695ms             | 631MB🥉      | 2825.6kB🥈  | 680.1kB🥈    |
| Rsbuild 2.0.0-rc.3    | 4841ms🥉         | 2072ms🥈           | 615MB🥇      | 2852.3kB    | 680.2kB🥉    |
| Vite 8.0.8            | 2125ms🥇         | 1911ms🥇           | 689MB        | 2631.1kB🥇  | 693.4kB      |
| webpack 5.106.2       | 20417ms          | 5755ms             | 1251MB       | 2826.0kB🥉  | 679.5kB🥇    |
| Farm 1.7.11           | 8371ms           | 4363ms             | 619MB🥈      | 3545.1kB    | 798.6kB      |
| Parcel 2.16.4         | 18438ms          | 2640ms🥉           | 2028MB       | 3489.6kB    | 766.6kB      |

---

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

Development metrics:

| Name                  | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| --------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.0-rc.3 | 1090ms🥈           | 906ms🥈              | 118ms🥇 | 351MB🥈      |
| Rsbuild 2.0.0-rc.3    | 980ms🥇            | 735ms🥇              | 137ms🥉 | 318MB🥇      |
| Vite 8.0.8            | 5081ms🥉           | 3923ms🥉             | 125ms🥈 | 1217MB🥉     |
| webpack 5.106.2       | 20985ms            | 17762ms              | 2453ms  | 2140MB       |

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-rc.3 | 3300ms🥉         | 1778ms🥇           | 1145MB🥈     | 5934.1kB🥈  | 1368.6kB🥉   |
| Rsbuild 2.0.0-rc.3    | 3026ms🥈         | 1965ms🥉           | 1113MB🥇     | 5984.6kB    | 1367.6kB🥇   |
| Vite 8.0.8            | 1830ms🥇         | 1879ms🥈           | 1242MB🥉     | 5466.2kB🥇  | 1417.6kB     |
| webpack 5.106.2       | 25672ms          | 5039ms             | 1869MB       | 5934.6kB🥉  | 1368.0kB🥈   |

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
| Rspack CLI 2.0.0-rc.3 | 7823ms🥉         | 3168ms🥈           | 1388MB🥇     | 5013.1kB🥇  | 1437.5kB🥇   |
| Rsbuild 2.0.0-rc.3    | 9089ms           | 6365ms             | 1506MB🥈     | 5013.2kB🥈  | 1437.6kB🥈   |
| Vite 8.0.8            | 5835ms🥈         | 5988ms             | 1660MB🥉     | 5019.9kB    | 1444.0kB     |
| webpack 5.106.2       | 51400ms          | 23197ms            | 2113MB       | 5016.6kB🥉  | 1439.6kB🥉   |
| esbuild 0.28.0        | 5228ms🥇         | 4158ms🥉           | N/A          | 6149.9kB    | 1776.1kB     |
| Farm 1.7.11           | 21784ms          | 5660ms             | 2196MB       | 7972.7kB    | 2688.7kB     |
| Parcel 2.16.4         | 35348ms          | 2326ms🥇           | 2222MB       | 5277.2kB    | 1480.0kB     |

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
| Rspack CLI 2.0.0-rc.3 | 1734ms           | 606ms🥇            | 435MB🥇      | 1779.3kB    | 556.0kB🥉    |
| Rsbuild 2.0.0-rc.3    | 1966ms           | 1649ms             | 445MB🥈      | 1778.4kB    | 555.7kB🥈    |
| Vite 8.0.8            | 1443ms🥉         | 1248ms             | 642MB        | 1777.5kB🥉  | 557.7kB      |
| Rollup 4.60.1         | 7667ms           | 8705ms             | 1265MB       | 1610.9kB🥇  | 500.0kB🥇    |
| Rolldown 1.0.0-rc.16  | 996ms🥈          | 1065ms🥉           | 586MB🥉      | 1775.6kB🥈  | 556.2kB      |
| webpack 5.106.2       | 9918ms           | 2317ms             | 1352MB       | 1787.2kB    | 557.2kB      |
| esbuild 0.28.0        | 850ms🥇          | 728ms🥈            | N/A          | 2074.5kB    | 627.8kB      |
| Farm 1.7.11           | 3988ms           | 1471ms             | 780MB        | 2245.9kB    | 761.2kB      |

---

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-rc.3 | 1240ms           | 264ms🥈            | 292MB🥉      | 1707.2kB    | 358.6kB      |
| Rsbuild 2.0.0-rc.3    | 911ms🥉          | 532ms              | 247MB🥈      | 1008.1kB🥇  | 271.0kB🥇    |
| Rolldown 1.0.0-rc.16  | 333ms🥈          | 307ms🥉            | 228MB🥇      | 1012.2kB🥈  | 271.8kB🥈    |
| webpack 5.106.2       | 3703ms           | 1028ms             | 626MB        | 1044.2kB    | 275.7kB🥉    |
| esbuild 0.28.0        | 278ms🥇          | 227ms🥇            | N/A          | 1025.2kB🥉  | 276.7kB      |

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
