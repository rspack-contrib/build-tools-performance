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

> Data from GitHub Actions: https://github.com/rstackjs/build-tools-performance/actions/runs/33621329811 (2026-09-03)

---

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

Development metrics:

| Name             | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ---------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.2.2 | 1775ms🥈           | 1111ms🥉             | 171ms   | 357MB🥈      |
| Rsbuild 2.2.2    | 1578ms🥇           | 994ms🥇              | 165ms   | 313MB🥇      |
| Vite 8.2.2       | 5190ms             | 4479ms               | 124ms🥈 | 493MB        |
| webpack 5.110.3  | 7249ms             | 4321ms               | 691ms   | 833MB        |
| Farm 1.7.11      | 2049ms🥉           | 1105ms🥈             | 135ms🥉 | 554MB        |
| Parcel 2.16.4    | 5537ms             | 2191ms               | 393ms   | 1124MB       |
| Utoo 1.5.14      | 7009ms             | 1544ms               | 91ms🥇  | 423MB🥉      |

Build metrics:

| Name             | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.2.2 | 1028ms🥉         | 420ms🥇            | 252MB🥇      | 818.3kB🥉   | 221.4kB      |
| Rsbuild 2.2.2    | 927ms🥈          | 568ms🥈            | 258MB🥈      | 819.8kB     | 213.9kB🥇    |
| Vite 8.2.2       | 610ms🥇          | 585ms🥉            | 290MB🥉      | 796.3kB🥇   | 216.8kB🥈    |
| webpack 5.110.3  | 5829ms           | 1720ms             | 675MB        | 818.2kB🥈   | 221.0kB🥉    |
| Farm 1.7.11      | 2653ms           | 1531ms             | 392MB        | 1065.5kB    | 260.4kB      |
| Parcel 2.16.4    | 4552ms           | 1042ms             | 1107MB       | 942.1kB     | 230.6kB      |
| Utoo 1.5.14      | 7553ms           | 794ms              | 396MB        | 821.0kB     | 230.4kB      |

---

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

Development metrics:

| Name             | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ---------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.2.2 | 948ms🥇            | 628ms🥈              | 91ms🥈  | 297MB🥈      |
| Rsbuild 2.2.2    | 1029ms🥈           | 617ms🥇              | 109ms🥉 | 261MB🥇      |
| Vite 8.2.2       | 4646ms             | 2528ms               | 130ms   | 727MB        |
| webpack 5.110.3  | 11423ms            | 9633ms               | 2764ms  | 1541MB       |
| Farm 1.7.11      | 1380ms🥉           | 900ms🥉              | 73ms🥇  | 515MB🥉      |
| Parcel 2.16.4    | 11636ms            | 1983ms               | 567ms   | 1803MB       |

Build metrics:

| Name             | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.2.2 | 1610ms🥈         | 677ms🥇            | 542MB🥇      | 2678.6kB🥉  | 673.7kB🥉    |
| Rsbuild 2.2.2    | 1753ms🥉         | 918ms🥈            | 556MB🥈      | 2620.7kB🥈  | 669.7kB🥇    |
| Vite 8.2.2       | 1153ms🥇         | 1135ms🥉           | 659MB        | 2512.4kB🥇  | 684.6kB      |
| webpack 5.110.3  | 12285ms          | 4043ms             | 1192MB       | 2681.6kB    | 673.1kB🥈    |
| Farm 1.7.11      | 6007ms           | 1965ms             | 624MB🥉      | 3430.0kB    | 809.3kB      |
| Parcel 2.16.4    | 11011ms          | 1781ms             | 2031MB       | 3374.6kB    | 758.7kB      |

---

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

Development metrics:

| Name             | Startup (no cache) | Startup (with cache) | HMR    | Memory (RSS) |
| ---------------- | ------------------ | -------------------- | ------ | ------------ |
| Rspack CLI 2.2.2 | 961ms🥈            | 565ms🥇              | 88ms🥇 | 365MB🥈      |
| Rsbuild 2.2.2    | 695ms🥇            | 628ms🥈              | 98ms🥉 | 313MB🥇      |
| Vite 8.2.2       | 4241ms🥉           | 2693ms🥉             | 93ms🥈 | 1182MB🥉     |
| webpack 5.110.3  | 13219ms            | 9999ms               | 4898ms | 2442MB       |

Build metrics:

| Name             | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.2.2 | 2963ms🥉         | 1026ms🥈           | 957MB🥇      | 5601.5kB🥉  | 1352.5kB🥉   |
| Rsbuild 2.2.2    | 2286ms🥈         | 909ms🥇            | 967MB🥈      | 5463.6kB🥈  | 1343.5kB🥇   |
| Vite 8.2.2       | 1235ms🥇         | 1299ms🥉           | 1204MB🥉     | 5203.0kB🥇  | 1398.3kB     |
| webpack 5.110.3  | 15260ms          | 4642ms             | 1906MB       | 5609.1kB    | 1352.0kB🥈   |

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
| Rspack CLI 2.2.2 | 5709ms🥉         | 1815ms🥈           | 1208MB🥇     | 5130.8kB🥇  | 1474.1kB🥇   |
| Rsbuild 2.2.2    | 6342ms           | 2187ms🥉           | 1346MB🥉     | 5131.2kB🥈  | 1474.4kB🥈   |
| Vite 8.2.2       | 4356ms🥇         | 3429ms             | 1735MB       | 5135.8kB🥉  | 1484.0kB     |
| webpack 5.110.3  | 29534ms          | 16155ms            | 1750MB       | 5143.9kB    | 1475.7kB🥉   |
| esbuild 0.28.2   | 4638ms🥈         | 3991ms             | N/A          | 6310.7kB    | 1826.6kB     |
| Farm 1.7.11      | 17127ms          | 5313ms             | 2256MB       | 8630.6kB    | 2920.9kB     |
| Parcel 2.16.4    | 28367ms          | 2435ms             | 2366MB       | 5417.7kB    | 1518.9kB     |
| Utoo 1.5.14      | 30799ms          | 1102ms🥇           | 1219MB🥈     | 5313.0kB    | 1533.6kB     |

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

| Name             | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.2.2 | 1102ms           | 323ms🥈            | 418MB🥇      | 1757.4kB    | 535.1kB      |
| Rsbuild 2.2.2    | 1236ms           | 355ms🥉            | 426MB🥈      | 1756.6kB    | 534.9kB🥉    |
| Vite 8.2.2       | 894ms🥉          | 847ms              | 607MB        | 1756.0kB🥈  | 536.9kB      |
| Rollup 4.63.1    | 6592ms           | 6401ms             | 1263MB       | 1687.4kB🥇  | 516.0kB🥇    |
| Rolldown 1.2.6   | 767ms🥇          | 640ms              | 550MB        | 1756.3kB🥉  | 535.7kB      |
| webpack 5.110.3  | 5261ms           | 1289ms             | 753MB        | 1758.6kB    | 534.5kB🥈    |
| esbuild 0.28.2   | 807ms🥈          | 608ms              | N/A          | 2070.4kB    | 608.1kB      |
| Farm 1.7.11      | 3306ms           | 1187ms             | 788MB        | 2244.0kB    | 752.4kB      |
| Utoo 1.5.14      | 4734ms           | 311ms🥇            | 492MB🥉      | 1892.0kB    | 581.5kB      |

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
