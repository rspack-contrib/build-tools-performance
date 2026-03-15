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

Tooling details:

- webpack is configured to use SWC instead of Babel / Terser.
- Vite uses Rolldown and Oxc.

## Results

> Data from GitHub Actions: https://github.com/rstackjs/build-tools-performance/actions/runs/23100631274 (2026-03-15)

---

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

Development metrics:

| Name                    | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ----------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.0-beta.6 | 942ms🥇            | 646ms🥈              | 129ms🥇 | 363MB🥈      |
| Rsbuild 2.0.0-beta.8    | 973ms🥈            | 654ms🥉              | 160ms   | 334MB🥇      |
| Vite 8.0.0              | 3702ms             | 2624ms               | 133ms🥈 | 470MB🥉      |
| webpack 5.105.4         | 3697ms             | 2207ms               | 444ms   | 870MB        |
| Farm 1.7.11             | 1179ms🥉           | 545ms🥇              | 148ms🥉 | 550MB        |
| Parcel 2.16.4           | 3118ms             | 711ms                | 188ms   | 1137MB       |

Build metrics:

| Name                    | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-beta.6 | 539ms🥉          | 497ms🥉            | 275MB🥇      | 846.4kB🥉   | 222.1kB      |
| Rsbuild 2.0.0-beta.8    | 522ms🥈          | 411ms🥈            | 282MB🥈      | 873.6kB     | 215.4kB🥇    |
| Vite 8.0.0              | 386ms🥇          | 384ms🥇            | 297MB🥉      | 823.2kB🥇   | 217.9kB🥈    |
| webpack 5.105.4         | 3555ms           | 1136ms             | 689MB        | 845.9kB🥈   | 221.7kB🥉    |
| Farm 1.7.11             | 1325ms           | 729ms              | 390MB        | 1089.1kB    | 258.5kB      |
| Parcel 2.16.4           | 3152ms           | 657ms              | 1111MB       | 965.6kB     | 230.9kB      |

---

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

Development metrics:

| Name                    | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ----------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.0-beta.6 | 759ms🥇            | 573ms🥉              | 105ms🥇 | 305MB🥈      |
| Rsbuild 2.0.0-beta.8    | 820ms🥈            | 553ms🥈              | 139ms🥈 | 280MB🥇      |
| Vite 8.0.0              | 3294ms             | 2163ms               | 147ms   | 740MB        |
| webpack 5.105.4         | 9324ms             | 5348ms               | 1831ms  | 1642MB       |
| Farm 1.7.11             | 1046ms🥉           | 513ms🥇              | 142ms🥉 | 518MB🥉      |
| Parcel 2.16.4           | 8851ms             | 1279ms               | 463ms   | 1719MB       |

Build metrics:

| Name                    | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-beta.6 | 1724ms🥉         | 1146ms🥈           | 595MB🥇      | 2825.8kB🥉  | 680.3kB🥈    |
| Rsbuild 2.0.0-beta.8    | 1628ms🥈         | 1295ms             | 604MB🥈      | 2852.4kB    | 680.3kB🥉    |
| Vite 8.0.0              | 1075ms🥇         | 881ms🥇            | 684MB        | 2630.1kB🥇  | 692.8kB      |
| webpack 5.105.4         | 9278ms           | 2391ms             | 1250MB       | 2825.4kB🥈  | 679.3kB🥇    |
| Farm 1.7.11             | 3991ms           | 1513ms             | 613MB🥉      | 3544.5kB    | 805.2kB      |
| Parcel 2.16.4           | 8511ms           | 1221ms🥉           | 1931MB       | 3489.0kB    | 766.5kB      |

---

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

Development metrics:

| Name                    | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ----------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 2.0.0-beta.6 | 1438ms🥈           | 928ms🥇              | 137ms🥈 | 367MB🥈      |
| Rsbuild 2.0.0-beta.8    | 1367ms🥇           | 1056ms🥈             | 163ms🥉 | 341MB🥇      |
| Vite 8.0.0              | 6505ms🥉           | 3623ms🥉             | 129ms🥇 | 1214MB🥉     |
| webpack 5.105.4         | 21444ms            | 29732ms              | 2783ms  | 2064MB       |

Build metrics:

| Name                    | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-beta.6 | 3466ms🥉         | 2549ms🥈           | 1108MB🥇     | 5934.3kB🥉  | 1368.8kB🥉   |
| Rsbuild 2.0.0-beta.8    | 3353ms🥈         | 2791ms🥉           | 1110MB🥈     | 5984.7kB    | 1367.7kB🥇   |
| Vite 8.0.0              | 1986ms🥇         | 1609ms🥇           | 1227MB🥉     | 5465.0kB🥇  | 1416.9kB     |
| webpack 5.105.4         | 28138ms          | 5543ms             | 1862MB       | 5933.9kB🥈  | 1367.9kB🥈   |

---

### ui-components

A React app that imports UI components from several popular UI libraries.

Including [@mui/material](https://npmjs.com/package/@mui/material), [antd](https://npmjs.com/package/antd), [@chakra-ui/react](https://npmjs.com/package/@chakra-ui/react), [@fluentui/react](https://npmjs.com/package/@fluentui/react), [@headlessui/react](https://npmjs.com/package/@headlessui/react), [@mantine/core](https://npmjs.com/package/@mantine/core), [react-bootstrap](https://npmjs.com/package/react-bootstrap), [element-plus](https://npmjs.com/package/element-plus), [vant](https://npmjs.com/package/vant), and [vuetify](https://npmjs.com/package/vuetify).

```bash
CASE=ui-components pnpm benchmark
```

Build metrics:

| Name                    | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-beta.6 | 2869ms🥉         | 2118ms🥉           | 649MB🥇      | 2377.2kB    | 682.0kB🥉    |
| Rsbuild 2.0.0-beta.8    | 3288ms           | 2200ms             | 735MB🥈      | 2188.7kB🥈  | 676.4kB🥇    |
| Vite 8.0.0              | 2452ms🥈         | 2202ms             | 975MB🥉      | 2211.2kB🥉  | 684.5kB      |
| webpack 5.105.4         | 20617ms          | 10824ms            | 1707MB       | 2185.1kB🥇  | 676.7kB🥈    |
| esbuild 0.27.4          | 2442ms🥇         | 2243ms             | N/A          | 3245.4kB    | 964.1kB      |
| Farm 1.7.11             | 6921ms           | 2094ms🥈           | 1385MB       | 4126.4kB    | 1430.3kB     |
| Parcel 2.16.4           | 14170ms          | 1273ms🥇           | 2191MB       | 2225.6kB    | 683.9kB      |

---

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

Build metrics:

| Name                    | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 2.0.0-beta.6 | 662ms            | 464ms              | 236MB🥉      | 1007.8kB🥈  | 270.9kB🥈    |
| Rsbuild 2.0.0-beta.8    | 487ms🥉          | 294ms🥈            | 226MB🥈      | 2710.8kB    | 457.2kB      |
| Rolldown 1.0.0-rc.9     | 364ms🥈          | 297ms🥉            | 222MB🥇      | 1012.2kB🥉  | 271.8kB🥉    |
| webpack 5.105.4         | 3179ms           | 1005ms             | 625MB        | 1006.0kB🥇  | 270.6kB🥇    |
| esbuild 0.27.4          | 263ms🥇          | 218ms🥇            | N/A          | 1025.2kB    | 276.7kB      |

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
