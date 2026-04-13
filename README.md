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

> Data from GitHub Actions: https://github.com/rstackjs/build-tools-performance/actions/runs/24323582005 (2026-04-13)

---

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

Development metrics:

| Name                  | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| --------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.0-rc.1 | 1528ms🥇           | 1074ms🥇             | 132ms🥈 | 341MB🥈      |
| Rsbuild 2.0.0-rc.2    | 1556ms🥈           | 1089ms🥈             | 204ms   | 319MB🥇      |
| Vite 8.0.8            | 8141ms             | 4846ms               | 113ms🥇 | 514MB🥉      |
| webpack 5.106.1       | 6634ms             | 4307ms               | 613ms   | 852MB        |
| Farm 1.7.11           | 2269ms🥉           | 1183ms🥉             | 145ms🥉 | 540MB        |
| Parcel 2.16.4         | 5413ms             | 1725ms               | 387ms   | 1124MB       |

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-rc.1 | 1032ms🥈         | 739ms🥉            | 277MB🥇      | 847.0kB🥉   | 222.2kB🥉    |
| Rsbuild 2.0.0-rc.2    | 1149ms🥉         | 641ms🥇            | 283MB🥈      | 874.3kB     | 215.5kB🥇    |
| Vite 8.0.8            | 768ms🥇          | 714ms🥈            | 292MB🥉      | 826.4kB🥇   | 223.0kB      |
| webpack 5.106.1       | 6277ms           | 1908ms             | 693MB        | 846.6kB🥈   | 221.8kB🥈    |
| Farm 1.7.11           | 2682ms           | 1299ms             | 390MB        | 1089.7kB    | 256.8kB      |
| Parcel 2.16.4         | 4593ms           | 1160ms             | 1103MB       | 966.3kB     | 231.0kB      |

---

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

Development metrics:

| Name                  | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| --------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.0-rc.1 | 1131ms🥇           | 707ms🥇              | 107ms🥈 | 283MB🥈      |
| Rsbuild 2.0.0-rc.2    | 1370ms🥈           | 980ms🥉              | 187ms   | 266MB🥇      |
| Vite 8.0.8            | 5199ms             | 3719ms               | 98ms🥇  | 756MB        |
| webpack 5.106.1       | 17099ms            | 18425ms              | 2145ms  | 1607MB       |
| Farm 1.7.11           | 1534ms🥉           | 916ms🥈              | 121ms🥉 | 514MB🥉      |
| Parcel 2.16.4         | 13421ms            | 2106ms               | 622ms   | 1783MB       |

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-rc.1 | 2716ms🥈         | 1458ms🥈           | 592MB🥇      | 2826.5kB🥉  | 680.3kB🥈    |
| Rsbuild 2.0.0-rc.2    | 2754ms🥉         | 1822ms🥉           | 615MB🥈      | 2853.1kB    | 680.4kB🥉    |
| Vite 8.0.8            | 1712ms🥇         | 1365ms🥇           | 682MB        | 2631.2kB🥇  | 693.4kB      |
| webpack 5.106.1       | 16471ms          | 3817ms             | 1231MB       | 2826.1kB🥈  | 679.3kB🥇    |
| Farm 1.7.11           | 6725ms           | 2532ms             | 620MB🥉      | 3545.2kB    | 798.4kB      |
| Parcel 2.16.4         | 15113ms          | 2292ms             | 1969MB       | 3489.7kB    | 766.5kB      |

---

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

Development metrics:

| Name                  | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| --------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.0-rc.1 | 969ms🥈            | 715ms🥇              | 103ms🥇 | 352MB🥈      |
| Rsbuild 2.0.0-rc.2    | 864ms🥇            | 800ms🥈              | 123ms🥉 | 320MB🥇      |
| Vite 8.0.8            | 5155ms🥉           | 3194ms🥉             | 116ms🥈 | 1188MB🥉     |
| webpack 5.106.1       | 17237ms            | 22637ms              | 1930ms  | 2121MB       |

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-rc.1 | 3308ms🥉         | 1505ms🥈           | 1110MB🥇     | 5935.0kB🥉  | 1368.8kB🥉   |
| Rsbuild 2.0.0-rc.2    | 2652ms🥈         | 1639ms🥉           | 1113MB🥈     | 5985.4kB    | 1367.8kB🥇   |
| Vite 8.0.8            | 1560ms🥇         | 1350ms🥇           | 1225MB🥉     | 5466.3kB🥇  | 1417.6kB     |
| webpack 5.106.1       | 20719ms          | 4863ms             | 1905MB       | 5934.6kB🥈  | 1367.8kB🥈   |

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
| Rspack CLI 2.0.0-rc.1 | 8227ms🥉         | 6766ms             | 1428MB🥇     | 5199.8kB    | 1441.6kB🥉   |
| Rsbuild 2.0.0-rc.2    | 10518ms          | 6758ms🥉           | 1522MB🥈     | 5010.6kB🥇  | 1435.9kB🥇   |
| Vite 8.0.8            | 7513ms🥇         | 6800ms             | 1650MB🥉     | 5015.4kB🥉  | 1442.4kB     |
| webpack 5.106.1       | 59598ms          | 31874ms            | 2232MB       | 5012.3kB🥈  | 1437.5kB🥈   |
| esbuild 0.28.0        | 7747ms🥈         | 5526ms🥈           | N/A          | 6145.4kB    | 1774.1kB     |
| Farm 1.7.11           | 24906ms          | 7205ms             | 2191MB       | 7967.0kB    | 2687.1kB     |
| Parcel 2.16.4         | 44445ms          | 3657ms🥇           | 2342MB       | 5272.8kB    | 1478.0kB     |

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
| Rspack CLI 2.0.0-rc.1 | 2464ms           | 2415ms             | 445MB🥇      | 1774.3kB    | 554.3kB      |
| Rsbuild 2.0.0-rc.2    | 3486ms           | 2208ms             | 456MB🥈      | 1773.4kB    | 554.0kB      |
| Vite 8.0.8            | 1607ms🥉         | 1447ms🥉           | 646MB        | 1757.7kB🥈  | 552.2kB🥈    |
| Rollup 4.60.1         | 11368ms          | 9737ms             | 1293MB       | 1598.3kB🥇  | 496.4kB🥇    |
| Rolldown 1.0.0-rc.15  | 1185ms🥈         | 1182ms🥈           | 584MB🥉      | 1763.0kB🥉  | 552.6kB🥉    |
| webpack 5.106.1       | 11970ms          | 2778ms             | 1336MB       | 1780.0kB    | 555.0kB      |
| esbuild 0.28.0        | 889ms🥇          | 894ms🥇            | N/A          | 2059.2kB    | 623.7kB      |
| Farm 1.7.11           | 4722ms           | 1587ms             | 772MB        | 2238.3kB    | 757.8kB      |

---

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-rc.1 | 699ms🥉          | 512ms🥉            | 234MB🥈      | 1007.7kB🥇  | 270.9kB🥇    |
| Rsbuild 2.0.0-rc.2    | 1536ms           | 675ms              | 244MB🥉      | 1008.1kB🥈  | 271.0kB🥈    |
| Rolldown 1.0.0-rc.15  | 343ms🥈          | 508ms🥈            | 231MB🥇      | 1012.2kB🥉  | 271.8kB🥉    |
| webpack 5.106.1       | 3545ms           | 1064ms             | 631MB        | 1044.2kB    | 275.7kB      |
| esbuild 0.28.0        | 234ms🥇          | 236ms🥇            | N/A          | 1025.2kB    | 276.7kB      |

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
