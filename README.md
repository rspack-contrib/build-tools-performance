# Build Tools Comparison

Benchmark comparing JavaScript bundlers and build tools ([Rspack](https://github.com/web-infra-dev/rspack), [Rsbuild](https://github.com/web-infra-dev/rsbuild), [webpack](https://github.com/webpack/webpack), [Vite](https://github.com/vitejs/vite), [Rolldown](https://github.com/rolldown/rolldown), [esbuild](https://github.com/evanw/esbuild), [Parcel](https://github.com/parcel-bundler/parcel) and [Farm](https://github.com/farm-fe/farm)) for dev server startup time, build performance and bundle size for applications with different module sizes.

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

## Results

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/20457026995 (2025-12-23)

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

Development metrics:

| Name                    | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ----------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 1.7.0-beta.1 | 1556ms🥈           | 1042ms🥉             | 112ms🥉 | 372MB🥉      |
| Rsbuild 1.7.0-beta.1    | 1333ms🥇           | 941ms🥈              | 110ms🥈 | 312MB🥇      |
| Vite (Rolldown) 7.2.10  | 8247ms             | 5654ms               | 2986ms  | 403MB        |
| Vite (Rollup) 7.2.7     | 6542ms             | 3872ms               | 1564ms  | 324MB🥈      |
| webpack (SWC) 5.103.0   | 4662ms             | 3400ms               | 385ms   | 812MB        |
| Farm 1.7.11             | 1845ms🥉           | 734ms🥇              | 107ms🥇 | 559MB        |
| Parcel 2.16.3           | 4382ms             | 1524ms               | 114ms   | 1147MB       |

Build metrics:

| Name                    | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.7.0-beta.1 | 902ms🥉          | 833ms🥉            | 280MB🥉      | 843.5kB🥉   | 221.2kB🥉    |
| Rsbuild 1.7.0-beta.1    | 879ms🥈          | 595ms🥈            | 276MB🥈      | 870.8kB     | 214.6kB🥇    |
| Vite (Rolldown) 7.2.10  | 728ms🥇          | 498ms🥇            | 264MB🥇      | 831.4kB🥈   | 226.5kB      |
| Vite (Rollup) 7.2.7     | 2452ms           | 2472ms             | 500MB        | 805.8kB🥇   | 217.5kB🥈    |
| webpack (SWC) 5.103.0   | 4212ms           | 1809ms             | 674MB        | 844.3kB     | 225.6kB      |
| Farm 1.7.11             | 1769ms           | 938ms              | 379MB        | 1086.1kB    | 255.9kB      |
| Parcel 2.16.3           | 4219ms           | 961ms              | 1092MB       | 962.8kB     | 230.1kB      |

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

Development metrics:

| Name                    | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ----------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 1.7.0-beta.1 | 1410ms🥈           | 939ms🥈              | 88ms🥇  | 326MB🥉      |
| Rsbuild 1.7.0-beta.1    | 1368ms🥇           | 820ms🥇              | 137ms🥉 | 264MB🥇      |
| Vite (Rolldown) 7.2.10  | 5781ms             | 3242ms               | 3205ms  | 568MB        |
| Vite (Rollup) 7.2.7     | 5034ms             | 3501ms               | 1429ms  | 293MB🥈      |
| webpack (SWC) 5.103.0   | 13954ms            | 14246ms              | 3008ms  | 1462MB       |
| Farm 1.7.11             | 1658ms🥉           | 998ms🥉              | 111ms🥈 | 512MB        |
| Parcel 2.16.3           | 13633ms            | 2738ms               | 423ms   | 1788MB       |

Build metrics:

| Name                    | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.7.0-beta.1 | 2231ms🥈         | 1574ms🥈           | 574MB🥈      | 2822.9kB🥉  | 678.7kB🥇    |
| Rsbuild 1.7.0-beta.1    | 3127ms🥉         | 1779ms🥉           | 579MB🥉      | 2849.5kB    | 679.6kB🥈    |
| Vite (Rolldown) 7.2.10  | 1885ms🥇         | 1495ms🥇           | 488MB🥇      | 2661.2kB🥈  | 725.8kB      |
| Vite (Rollup) 7.2.7     | 6203ms           | 6736ms             | 948MB        | 2583.8kB🥇  | 689.8kB🥉    |
| webpack (SWC) 5.103.0   | 12795ms          | 3775ms             | 1246MB       | 2833.2kB    | 699.1kB      |
| Farm 1.7.11             | 8639ms           | 2545ms             | 597MB        | 3541.6kB    | 796.0kB      |
| Parcel 2.16.3           | 14979ms          | 2680ms             | 2044MB       | 3486.2kB    | 765.7kB      |

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

Development metrics:

| Name                    | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ----------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 1.7.0-beta.1 | 1362ms🥈           | 907ms🥈              | 108ms🥈 | 380MB🥉      |
| Rsbuild 1.7.0-beta.1    | 986ms🥇            | 728ms🥇              | 99ms🥇  | 317MB🥇      |
| Vite (Rolldown) 7.2.10  | 5555ms🥉           | 3399ms               | 580ms🥉 | 837MB        |
| Vite (Rollup) 7.2.7     | 7208ms             | 2989ms🥉             | 1350ms  | 357MB🥈      |
| webpack (SWC) 5.103.0   | 18459ms            | 26575ms              | 3099ms  | 2097MB       |

Build metrics:

| Name                    | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.7.0-beta.1 | 2947ms🥈         | 2487ms🥉           | 1033MB🥈     | 5931.4kB🥉  | 1367.2kB🥈   |
| Rsbuild 1.7.0-beta.1    | 3888ms🥉         | 2272ms🥈           | 1039MB🥉     | 5981.8kB    | 1366.9kB🥇   |
| Vite (Rolldown) 7.2.10  | 1824ms🥇         | 1420ms🥇           | 856MB🥇      | 5530.0kB🥈  | 1483.9kB     |
| Vite (Rollup) 7.2.7     | 9947ms           | 9872ms             | 1461MB       | 5373.6kB🥇  | 1410.5kB🥉   |
| webpack (SWC) 5.103.0   | 28242ms          | 5411ms             | 1833MB       | 5955.4kB    | 1450.2kB     |

### ui-components

A React app that imports UI components from several popular UI libraries.

Including [@mui/material](https://npmjs.com/package/@mui/material), [antd](https://npmjs.com/package/antd), [@chakra-ui/react](https://npmjs.com/package/@chakra-ui/react), [@fluentui/react](https://npmjs.com/package/@fluentui/react), [@headlessui/react](https://npmjs.com/package/@headlessui/react), [@mantine/core](https://npmjs.com/package/@mantine/core), [react-bootstrap](https://npmjs.com/package/react-bootstrap), [element-plus](https://npmjs.com/package/element-plus), [vant](https://npmjs.com/package/vant), and [vuetify](https://npmjs.com/package/vuetify).

```bash
CASE=ui-components pnpm benchmark
```

Build metrics:

| Name                    | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.7.0-beta.1 | 2876ms           | 2409ms             | 620MB🥇      | 2173.7kB🥈  | 671.0kB🥈    |
| Rsbuild 1.7.0-beta.1    | 3759ms           | 2241ms             | 661MB🥈      | 2173.2kB🥇  | 670.8kB🥇    |
| Vite (Rollup) 7.2.7     | 10709ms          | 12069ms            | 1659MB       | 2203.1kB    | 694.7kB      |
| Vite (Rolldown) 7.2.10  | 2440ms🥉         | 2014ms🥉           | 964MB        | 2188.8kB    | 678.5kB      |
| Rolldown 1.0.0-beta.53  | 2203ms🥇         | 1449ms🥈           | 893MB🥉      | 2206.1kB    | 680.0kB      |
| webpack (SWC) 5.103.0   | 20099ms          | 11599ms            | 1761MB       | 2176.6kB🥉  | 672.5kB🥉    |
| esbuild 0.27.1          | 2211ms🥈         | 2069ms             | N/A          | 3053.5kB    | 935.2kB      |
| Farm 1.7.11             | 8990ms           | 2502ms             | 1415MB       | 3988.0kB    | 1384.0kB     |
| Parcel 2.16.3           | 15321ms          | 1412ms🥇           | 2045MB       | 2216.1kB    | 678.8kB      |

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

Build metrics:

| Name                    | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.7.0-beta.1 | 835ms🥉          | 563ms🥉            | 258MB🥉      | 1008.0kB🥉  | 270.9kB🥈    |
| Rsbuild 1.7.0-beta.1    | 870ms            | 667ms              | 244MB🥈      | 1007.9kB🥈  | 270.9kB🥉    |
| Rolldown 1.0.0-beta.53  | 361ms🥈          | 302ms🥈            | 227MB🥇      | 1012.2kB    | 271.8kB      |
| webpack (SWC) 5.103.0   | 3938ms           | 1068ms             | 628MB        | 1006.2kB🥇  | 270.5kB🥇    |
| esbuild 0.27.1          | 277ms🥇          | 292ms🥇            | N/A          | 1025.2kB    | 276.7kB      |

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
