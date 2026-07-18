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

> Data from GitHub Actions: https://github.com/rstackjs/build-tools-performance/actions/runs/29583607796 (2026-07-18)

---

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

Development metrics:

| Name             | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ---------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.1.4 | 1097ms🥇           | 783ms🥇              | 148ms🥈 | 366MB🥈      |
| Rsbuild 2.1.6    | 1116ms🥈           | 943ms🥉              | 233ms   | 322MB🥇      |
| Vite 8.1.5       | 6428ms             | 4111ms               | 152ms🥉 | 506MB        |
| webpack 5.108.4  | 5247ms             | 2869ms               | 379ms   | 851MB        |
| Farm 1.7.11      | 1637ms🥉           | 1091ms               | 213ms   | 546MB        |
| Parcel 2.16.4    | 4273ms             | 1116ms               | 298ms   | 1132MB       |
| Utoo 1.4.26      | 4799ms             | 853ms🥈              | 122ms🥇 | 434MB🥉      |

Build metrics:

| Name             | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.1.4 | 630ms🥈          | 363ms🥇            | 272MB🥇      | 842.8kB🥈   | 222.2kB      |
| Rsbuild 2.1.6    | 754ms🥉          | 464ms              | 277MB🥈      | 844.3kB     | 214.2kB🥇    |
| Vite 8.1.5       | 567ms🥇          | 453ms🥉            | 286MB🥉      | 824.3kB🥇   | 218.3kB🥈    |
| webpack 5.108.4  | 4638ms           | 2282ms             | 650MB        | 843.7kB🥉   | 222.1kB🥉    |
| Farm 1.7.11      | 2160ms           | 1186ms             | 392MB        | 1090.0kB    | 257.6kB      |
| Parcel 2.16.4    | 4288ms           | 1046ms             | 1085MB       | 966.6kB     | 231.3kB      |
| Utoo 1.4.26      | 5081ms           | 419ms🥈            | 411MB        | 864.4kB     | 234.1kB      |

---

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

Development metrics:

| Name             | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ---------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.1.4 | 1149ms🥈           | 790ms🥉              | 121ms🥈 | 300MB🥈      |
| Rsbuild 2.1.6    | 989ms🥇            | 728ms🥈              | 120ms🥇 | 271MB🥇      |
| Vite 8.1.5       | 3826ms             | 2573ms               | 144ms   | 728MB        |
| webpack 5.108.4  | 12581ms            | 8604ms               | 2660ms  | 1648MB       |
| Farm 1.7.11      | 1200ms🥉           | 692ms🥇              | 138ms🥉 | 517MB🥉      |
| Parcel 2.16.4    | 13583ms            | 4956ms               | 755ms   | 1820MB       |

Build metrics:

| Name             | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.1.4 | 1859ms🥈         | 971ms🥇            | 620MB🥇      | 2794.0kB🥉  | 679.8kB🥉    |
| Rsbuild 2.1.6    | 2075ms🥉         | 1263ms🥉           | 640MB🥉      | 2736.1kB🥈  | 675.8kB🥇    |
| Vite 8.1.5       | 1330ms🥇         | 1222ms🥈           | 651MB        | 2631.3kB🥇  | 693.3kB      |
| webpack 5.108.4  | 13130ms          | 3799ms             | 1241MB       | 2798.4kB    | 679.2kB🥈    |
| Farm 1.7.11      | 4208ms           | 1877ms             | 623MB🥈      | 3545.4kB    | 803.4kB      |
| Parcel 2.16.4    | 14095ms          | 1548ms             | 2006MB       | 3490.0kB    | 766.9kB      |

---

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

Development metrics:

| Name             | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ---------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.1.4 | 865ms🥇            | 732ms🥇              | 120ms🥇 | 374MB🥈      |
| Rsbuild 2.1.6    | 1127ms🥈           | 897ms🥈              | 179ms🥉 | 326MB🥇      |
| Vite 8.1.5       | 6022ms🥉           | 3613ms🥉             | 146ms🥈 | 1162MB🥉     |
| webpack 5.108.4  | 18870ms            | 20420ms              | 2314ms  | 2055MB       |

Build metrics:

| Name             | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.1.4 | 2729ms🥈         | 1674ms🥈           | 1103MB🥇     | 5861.1kB🥉  | 1367.3kB🥉   |
| Rsbuild 2.1.6    | 3918ms🥉         | 1500ms🥇           | 1114MB🥈     | 5723.3kB🥈  | 1357.8kB🥇   |
| Vite 8.1.5       | 1946ms🥇         | 1781ms🥉           | 1173MB🥉     | 5466.2kB🥇  | 1417.4kB     |
| webpack 5.108.4  | 34179ms          | 6067ms             | 1912MB       | 5870.3kB    | 1367.1kB🥈   |

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
| Rspack CLI 2.1.4 | 4904ms           | 2248ms             | 1412MB🥈     | 5123.0kB🥈  | 1473.6kB🥇   |
| Rsbuild 2.1.6    | 4409ms🥉         | 1360ms🥈           | 1547MB🥉     | 5123.5kB🥉  | 1474.0kB🥈   |
| Vite 8.1.5       | 3276ms🥇         | 3380ms             | 1704MB       | 5128.6kB    | 1482.0kB     |
| webpack 5.108.4  | 27567ms          | 14352ms            | 2150MB       | 5119.4kB🥇  | 1474.0kB🥉   |
| esbuild 0.28.1   | 3983ms🥈         | 2810ms             | N/A          | 6292.8kB    | 1822.8kB     |
| Farm 1.7.11      | 16379ms          | 4625ms             | 2252MB       | 8071.3kB    | 2731.0kB     |
| Parcel 2.16.4    | 23755ms          | 1817ms🥉           | 2437MB       | 5375.4kB    | 1513.0kB     |
| Utoo 1.4.26      | 20425ms          | 680ms🥇            | 1319MB🥇     | 5590.5kB    | 1592.2kB     |

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
| Rspack CLI 2.1.4 | 1490ms           | 496ms🥈            | 431MB🥇      | 1812.6kB    | 565.4kB🥉    |
| Rsbuild 2.1.6    | 1503ms           | 598ms🥉            | 446MB🥈      | 1811.7kB🥉  | 565.1kB🥈    |
| Vite 8.1.5       | 1252ms🥉         | 1049ms             | 610MB        | 1815.6kB    | 568.3kB      |
| Rollup 4.62.2    | 8801ms           | 8690ms             | 1284MB       | 1648.3kB🥇  | 511.1kB🥇    |
| Rolldown 1.2.0   | 1082ms🥈         | 1014ms             | 562MB        | 1810.4kB🥈  | 565.5kB      |
| webpack 5.108.4  | 8228ms           | 1841ms             | 1167MB       | 1815.7kB    | 566.4kB      |
| esbuild 0.28.1   | 783ms🥇          | 768ms              | N/A          | 2116.9kB    | 640.0kB      |
| Farm 1.7.11      | 4679ms           | 1523ms             | 787MB        | 2300.7kB    | 781.2kB      |
| Utoo 1.4.26      | 4945ms           | 315ms🥇            | 501MB🥉      | 1856.3kB    | 577.7kB      |

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
