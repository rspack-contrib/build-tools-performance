# Build Tools Comparison

Benchmark comparing JavaScript bundlers and build tools ([Rspack](https://github.com/web-infra-dev/rspack), [Rsbuild](https://github.com/web-infra-dev/rsbuild), [webpack](https://github.com/webpack/webpack), [Vite](https://github.com/vitejs/vite), [Rolldown](https://github.com/rolldown/rolldown), [esbuild](https://github.com/evanw/esbuild), [Rollup](https://github.com/rollup/rollup), [Parcel](https://github.com/parcel-bundler/parcel), [Farm](https://github.com/farm-fe/farm) and [Utoo](https://github.com/utooland/utoo)) for dev server startup time, build performance and bundle size for applications with different module sizes.

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

> Data from GitHub Actions: https://github.com/rstackjs/build-tools-performance/actions/runs/31916976843 (2026-08-18)

---

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

Development metrics:

| Name              | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ----------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.1.10 | 1173ms🥈           | 706ms🥈              | 101ms🥇 | 372MB🥈      |
| Rsbuild 2.1.13    | 1012ms🥇           | 687ms🥇              | 111ms🥈 | 321MB🥇      |
| Vite 8.2.1        | 4669ms             | 3574ms               | 132ms   | 498MB        |
| webpack 5.109.2   | 5176ms             | 3042ms               | 444ms   | 876MB        |
| Farm 1.7.11       | 1607ms🥉           | 850ms🥉              | 114ms🥉 | 553MB        |
| Parcel 2.16.4     | 3894ms             | 886ms                | 271ms   | 1148MB       |
| Utoo 1.5.5        | 10324ms            | 966ms                | 122ms   | 414MB🥉      |

Build metrics:

| Name              | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.1.10 | 582ms🥉          | 283ms🥇            | 269MB🥇      | 842.8kB🥈   | 222.2kB      |
| Rsbuild 2.1.13    | 494ms🥇          | 376ms🥈            | 278MB🥈      | 844.3kB     | 214.2kB🥇    |
| Vite 8.2.1        | 515ms🥈          | 595ms              | 288MB🥉      | 820.8kB🥇   | 217.4kB🥈    |
| webpack 5.109.2   | 4568ms           | 1417ms             | 680MB        | 843.5kB🥉   | 222.1kB🥉    |
| Farm 1.7.11       | 1937ms           | 1086ms             | 390MB        | 1090.0kB    | 260.1kB      |
| Parcel 2.16.4     | 3826ms           | 834ms              | 1144MB       | 966.6kB     | 231.3kB      |
| Utoo 1.5.5        | 7364ms           | 399ms🥉            | 403MB        | 864.8kB     | 234.3kB      |

---

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

Development metrics:

| Name              | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ----------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.1.10 | 903ms🥈            | 652ms🥉              | 102ms🥇 | 302MB🥈      |
| Rsbuild 2.1.13    | 782ms🥇            | 602ms🥇              | 104ms🥈 | 272MB🥇      |
| Vite 8.2.1        | 3369ms             | 1999ms               | 131ms   | 735MB        |
| webpack 5.109.2   | 9835ms             | 8695ms               | 2355ms  | 1894MB       |
| Farm 1.7.11       | 1441ms🥉           | 616ms🥈              | 129ms🥉 | 518MB🥉      |
| Parcel 2.16.4     | 11892ms            | 2111ms               | 589ms   | 1810MB       |

Build metrics:

| Name              | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.1.10 | 1829ms🥉         | 935ms🥇            | 617MB🥈      | 2794.0kB🥉  | 679.8kB🥉    |
| Rsbuild 2.1.13    | 1739ms🥈         | 1008ms🥈           | 636MB🥉      | 2736.1kB🥈  | 675.8kB🥇    |
| Vite 8.2.1        | 1183ms🥇         | 1028ms🥉           | 660MB        | 2627.8kB🥇  | 692.1kB      |
| webpack 5.109.2   | 12504ms          | 3447ms             | 1309MB       | 2797.9kB    | 679.2kB🥈    |
| Farm 1.7.11       | 5096ms           | 2070ms             | 611MB🥇      | 3545.4kB    | 816.8kB      |
| Parcel 2.16.4     | 10926ms          | 1588ms             | 2065MB       | 3490.0kB    | 766.9kB      |

---

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

Development metrics:

| Name              | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ----------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.1.10 | 1562ms🥈           | 1104ms🥈             | 133ms🥈 | 374MB🥈      |
| Rsbuild 2.1.13    | 1457ms🥇           | 1089ms🥇             | 180ms🥉 | 323MB🥇      |
| Vite 8.2.1        | 9780ms🥉           | 5631ms🥉             | 112ms🥇 | 1176MB🥉     |
| webpack 5.109.2   | 25706ms            | 26604ms              | 3668ms  | 1987MB       |

Build metrics:

| Name              | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.1.10 | 4057ms🥈         | 2242ms🥈           | 1100MB🥇     | 5861.1kB🥉  | 1367.3kB🥉   |
| Rsbuild 2.1.13    | 4567ms🥉         | 2150ms🥇           | 1104MB🥈     | 5723.3kB🥈  | 1357.8kB🥇   |
| Vite 8.2.1        | 2421ms🥇         | 2340ms🥉           | 1182MB🥉     | 5462.7kB🥇  | 1416.3kB     |
| webpack 5.109.2   | 38824ms          | 8994ms             | 1928MB       | 5869.6kB    | 1367.0kB🥈   |

---

### ui-components

A React app that imports UI components from several popular UI libraries.

Including [@mui/material](https://npmjs.com/package/@mui/material), [@radix-ui/themes](https://npmjs.com/package/@radix-ui/themes), [antd](https://npmjs.com/package/antd), [antd-mobile](https://npmjs.com/package/antd-mobile), [@chakra-ui/react](https://npmjs.com/package/@chakra-ui/react), [@fluentui/react](https://npmjs.com/package/@fluentui/react), [@headlessui/react](https://npmjs.com/package/@headlessui/react), [@mantine/core](https://npmjs.com/package/@mantine/core), [react-bootstrap](https://npmjs.com/package/react-bootstrap), [primereact](https://npmjs.com/package/primereact), [rsuite](https://npmjs.com/package/rsuite), [@arco-design/web-react](https://npmjs.com/package/@arco-design/web-react), [@coreui/react](https://npmjs.com/package/@coreui/react), [element-plus](https://npmjs.com/package/element-plus), [ant-design-vue](https://npmjs.com/package/ant-design-vue), [naive-ui](https://npmjs.com/package/naive-ui), [primevue](https://npmjs.com/package/primevue), [vant](https://npmjs.com/package/vant), and [vuetify](https://npmjs.com/package/vuetify).

```bash
CASE=ui-components pnpm benchmark
```

Build metrics:

| Name              | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.1.10 | 4032ms🥉         | 1361ms🥈           | 1430MB🥈     | 5139.9kB🥉  | 1479.8kB🥇   |
| Rsbuild 2.1.13    | 5384ms           | 2043ms             | 1548MB🥉     | 5140.5kB    | 1480.1kB🥈   |
| Vite 8.2.1        | 2773ms🥇         | 2366ms             | 1744MB       | 5134.4kB🥇  | 1483.7kB     |
| webpack 5.109.2   | 20169ms          | 10886ms            | 1947MB       | 5134.6kB🥈  | 1481.3kB🥉   |
| esbuild 0.28.2    | 3387ms🥈         | 2811ms             | N/A          | 6313.4kB    | 1827.0kB     |
| Farm 1.7.11       | 13960ms          | 3600ms             | 2265MB       | 8120.8kB    | 2748.9kB     |
| Parcel 2.16.4     | 21731ms          | 1702ms🥉           | 2223MB       | 5397.9kB    | 1519.9kB     |
| Utoo 1.5.5        | 18402ms          | 647ms🥇            | 1245MB🥇     | 5324.1kB    | 1538.5kB     |

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

| Name              | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.1.10 | 1496ms           | 486ms🥉            | 437MB🥇      | 1822.2kB    | 569.0kB      |
| Rsbuild 2.1.13    | 1777ms           | 481ms🥈            | 448MB🥈      | 1821.4kB    | 568.8kB🥈    |
| Vite 8.2.1        | 1159ms🥉         | 1092ms             | 613MB        | 1818.4kB🥈  | 569.7kB      |
| Rollup 4.62.4     | 8462ms           | 7817ms             | 1215MB       | 1657.7kB🥇  | 514.2kB🥇    |
| Rolldown 1.2.4    | 883ms🥇          | 847ms              | 561MB        | 1819.2kB🥉  | 568.8kB🥉    |
| webpack 5.109.2   | 7502ms           | 1680ms             | 1067MB       | 1824.3kB    | 569.6kB      |
| esbuild 0.28.2    | 932ms🥈          | 793ms              | N/A          | 2126.9kB    | 643.9kB      |
| Farm 1.7.11       | 4519ms           | 1308ms             | 771MB        | 2309.4kB    | 782.7kB      |
| Utoo 1.5.5        | 6324ms           | 371ms🥇            | 504MB🥉      | 1865.4kB    | 581.5kB      |

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
