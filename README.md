# Build Tools Comparison

Benchmark comparing JavaScript bundlers and build tools ([Rspack](https://github.com/web-infra-dev/rspack), [Rsbuild](https://github.com/web-infra-dev/rsbuild), [webpack](https://github.com/webpack/webpack), [Vite](https://github.com/vitejs/vite), [Rolldown](https://github.com/rolldown/rolldown), [esbuild](https://github.com/evanw/esbuild), [Rollup](https://github.com/rollup/rollup), [Parcel](https://github.com/parcel-bundler/parcel), [Farm](https://github.com/farm-fe/farm), [Utoo](https://github.com/utooland/utoo) and [Bun](https://github.com/oven-sh/bun)) for dev server startup time, build performance and bundle size for applications with different module sizes.

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
- Bun is a native binary rather than an npm dependency, so it must be installed separately (see https://bun.sh). The benchmark invokes the `bun` executable on your `PATH`.

## Results

> Data from GitHub Actions: https://github.com/rstackjs/build-tools-performance/actions/runs/26758017737 (2026-06-01)

---

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

Development metrics:

| Name             | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ---------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.5 | 1566ms🥇           | 1163ms🥈             | 163ms🥉 | 347MB🥈      |
| Rsbuild 2.0.9    | 1624ms🥈           | 1125ms🥇             | 206ms   | 313MB🥇      |
| Vite 8.0.14      | 8043ms             | 5932ms               | 156ms🥈 | 502MB🥉      |
| webpack 5.107.2  | 9135ms             | 4602ms               | 736ms   | 822MB        |
| Farm 1.7.11      | 2679ms🥉           | 1251ms🥉             | 151ms🥇 | 551MB        |
| Parcel 2.16.4    | 6230ms             | 2287ms               | 427ms   | 1115MB       |
| Utoo 1.4.9       | 13240ms            | 12505ms              | 206ms   | 538MB        |

Build metrics:

| Name             | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.5 | 1032ms🥉         | 419ms🥇            | 276MB🥇      | 842.5kB🥈   | 222.1kB      |
| Rsbuild 2.0.9    | 1005ms🥈         | 614ms🥉            | 282MB🥈      | 865.3kB     | 215.2kB🥇    |
| Vite 8.0.14      | 789ms🥇          | 727ms              | 295MB🥉      | 823.7kB🥇   | 218.1kB🥈    |
| webpack 5.107.2  | 7730ms           | 2320ms             | 688MB        | 846.3kB🥉   | 222.0kB🥉    |
| Farm 1.7.11      | 2747ms           | 1608ms             | 390MB        | 1089.5kB    | 259.5kB      |
| Parcel 2.16.4    | 5284ms           | 1167ms             | 1077MB       | 966.1kB     | 231.0kB      |
| Utoo 1.4.9       | 8254ms           | 542ms🥈            | 560MB        | 1069.4kB    | 239.1kB      |

---

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

Development metrics:

| Name             | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ---------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.5 | 901ms🥇            | 747ms🥇              | 105ms🥈 | 283MB🥈      |
| Rsbuild 2.0.9    | 992ms🥈            | 764ms🥈              | 132ms🥉 | 261MB🥇      |
| Vite 8.0.14      | 5425ms             | 3491ms               | 65ms🥇  | 729MB        |
| webpack 5.107.2  | 14189ms            | 9222ms               | 3314ms  | 1818MB       |
| Farm 1.7.11      | 1358ms🥉           | 795ms🥉              | 149ms   | 512MB🥉      |
| Parcel 2.16.4    | 14384ms            | 2472ms               | 739ms   | 1805MB       |

Build metrics:

| Name             | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.5 | 2014ms🥈         | 1174ms🥈           | 621MB🥈      | 2794.0kB🥈  | 679.7kB🥉    |
| Rsbuild 2.0.9    | 2029ms🥉         | 1043ms🥇           | 629MB🥉      | 2816.1kB🥉  | 679.6kB🥇    |
| Vite 8.0.14      | 1550ms🥇         | 1539ms🥉           | 656MB        | 2630.7kB🥇  | 693.1kB      |
| webpack 5.107.2  | 14071ms          | 3849ms             | 1279MB       | 2825.8kB    | 679.6kB🥈    |
| Farm 1.7.11      | 5250ms           | 2439ms             | 618MB🥇      | 3544.9kB    | 811.5kB      |
| Parcel 2.16.4    | 13051ms          | 2213ms             | 1929MB       | 3489.5kB    | 766.7kB      |

---

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

Development metrics:

| Name             | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ---------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.5 | 1476ms🥇           | 987ms🥇              | 156ms🥈 | 355MB🥈      |
| Rsbuild 2.0.9    | 1739ms🥈           | 1163ms🥈             | 184ms🥉 | 321MB🥇      |
| Vite 8.0.14      | 9100ms🥉           | 4556ms🥉             | 103ms🥇 | 1155MB🥉     |
| webpack 5.107.2  | 26984ms            | 27569ms              | 3386ms  | 1923MB       |

Build metrics:

| Name             | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.5 | 5219ms🥈         | 1871ms🥇           | 1121MB🥇     | 5861.1kB🥈  | 1367.1kB🥈   |
| Rsbuild 2.0.9    | 5867ms🥉         | 2367ms🥈           | 1123MB🥈     | 5903.4kB🥉  | 1366.0kB🥇   |
| Vite 8.0.14      | 3595ms🥇         | 2571ms🥉           | 1172MB🥉     | 5465.6kB🥇  | 1417.2kB     |
| webpack 5.107.2  | 45436ms          | 7836ms             | 1860MB       | 5934.3kB    | 1368.2kB🥉   |

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
| Rspack CLI 2.0.5 | 7929ms🥉         | 2628ms🥈           | 1400MB🥇     | 5067.0kB🥈  | 1456.1kB🥇   |
| Rsbuild 2.0.9    | 8488ms           | 3083ms             | 1510MB🥈     | 5067.0kB🥉  | 1456.1kB🥈   |
| Vite 8.0.14      | 6176ms🥈         | 5067ms             | 1724MB       | 5076.0kB    | 1462.3kB     |
| webpack 5.107.2  | 49698ms          | 25745ms            | 2235MB       | 5062.7kB🥇  | 1456.1kB🥉   |
| esbuild 0.28.0   | 5294ms🥇         | 3512ms             | N/A          | 6217.3kB    | 1799.8kB     |
| Farm 1.7.11      | 21637ms          | 6944ms             | 2246MB       | 8039.6kB    | 2716.1kB     |
| Parcel 2.16.4    | 36322ms          | 2957ms🥉           | 2148MB       | 5320.5kB    | 1495.7kB     |
| Utoo 1.4.9       | 52702ms          | 1100ms🥇           | 1671MB🥉     | 6649.9kB    | 1839.6kB     |

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
| Rspack CLI 2.0.5     | 1668ms           | 466ms🥈            | 434MB🥇      | 1803.7kB🥉  | 562.8kB🥉    |
| Rsbuild 2.0.9        | 1746ms           | 481ms🥉            | 443MB🥈      | 1803.0kB🥈  | 562.5kB🥈    |
| Vite 8.0.14          | 1023ms🥉         | 948ms              | 646MB        | 1805.2kB    | 565.4kB      |
| Rollup 4.60.4        | 6657ms           | 6751ms             | 1263MB       | 1637.7kB🥇  | 507.8kB🥇    |
| Rolldown 1.0.3       | 812ms🥈          | 797ms              | 571MB        | 1804.8kB    | 564.0kB      |
| webpack 5.107.2      | 8414ms           | 1758ms             | 1341MB       | 1804.8kB    | 563.0kB      |
| esbuild 0.28.0       | 670ms🥇          | 630ms              | N/A          | 2104.7kB    | 636.0kB      |
| Farm 1.7.11          | 3499ms           | 1248ms             | 775MB        | 2274.5kB    | 771.5kB      |
| Utoo 1.4.9           | 8443ms           | 352ms🥇            | 560MB🥉      | 2126.3kB    | 638.7kB      |

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
