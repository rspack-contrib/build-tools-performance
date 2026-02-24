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

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/20501686802 (2025-12-25)

---

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

Development metrics:

| Name                    | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ----------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 1.7.0-beta.1 | 968ms🥈            | 881ms                | 132ms🥈 | 372MB🥈      |
| Rsbuild 1.7.0-beta.1    | 913ms🥇            | 725ms🥈              | 125ms🥇 | 316MB🥇      |
| Vite 8.0.0-beta.5       | 4169ms             | 3007ms               | 136ms🥉 | 413MB🥉      |
| webpack 5.103.0         | 3519ms             | 2372ms               | 406ms   | 823MB        |
| Farm 1.7.11             | 1114ms🥉           | 686ms🥇              | 146ms   | 542MB        |
| Parcel 2.16.3           | 3175ms             | 814ms🥉              | 221ms   | 1144MB       |

Build metrics:

| Name                    | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.7.0-beta.1 | 635ms🥉          | 494ms🥉            | 280MB🥉      | 843.5kB🥈   | 221.2kB🥈    |
| Rsbuild 1.7.0-beta.1    | 595ms🥈          | 427ms🥈            | 273MB🥈      | 870.8kB     | 214.6kB🥇    |
| Vite 8.0.0-beta.5       | 420ms🥇          | 413ms🥇            | 272MB🥇      | 837.4kB🥇   | 226.5kB      |
| webpack 5.103.0         | 3694ms           | 1124ms             | 676MB        | 844.3kB🥉   | 225.6kB🥉    |
| Farm 1.7.11             | 1426ms           | 751ms              | 384MB        | 1086.1kB    | 255.9kB      |
| Parcel 2.16.3           | 3589ms           | 763ms              | 1086MB       | 962.8kB     | 230.1kB      |

---

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

Development metrics:

| Name                    | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ----------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 1.7.0-beta.1 | 1066ms🥈           | 793ms🥉              | 89ms🥇  | 336MB🥈      |
| Rsbuild 1.7.0-beta.1    | 773ms🥇            | 570ms🥇              | 96ms🥈  | 256MB🥇      |
| Vite 8.0.0-beta.5       | 3961ms             | 2078ms               | 138ms🥉 | 560MB        |
| webpack 5.103.0         | 8543ms             | 5732ms               | 1190ms  | 1528MB       |
| Farm 1.7.11             | 1141ms🥉           | 585ms🥈              | 144ms   | 518MB🥉      |
| Parcel 2.16.3           | 9763ms             | 1048ms               | 440ms   | 1809MB       |

Build metrics:

| Name                    | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.7.0-beta.1 | 1606ms🥈         | 1077ms🥈           | 575MB🥉      | 2822.9kB🥈  | 678.7kB🥇    |
| Rsbuild 1.7.0-beta.1    | 1795ms🥉         | 1117ms🥉           | 571MB🥈      | 2849.5kB    | 679.6kB🥈    |
| Vite 8.0.0-beta.5       | 876ms🥇          | 995ms🥇            | 502MB🥇      | 2681.1kB🥇  | 726.1kB      |
| webpack 5.103.0         | 10896ms          | 2769ms             | 1251MB       | 2833.2kB🥉  | 699.1kB🥉    |
| Farm 1.7.11             | 4248ms           | 1632ms             | 609MB        | 3541.6kB    | 796.0kB      |
| Parcel 2.16.3           | 9922ms           | 1297ms             | 2009MB       | 3486.2kB    | 765.7kB      |

---

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

Development metrics:

| Name                    | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ----------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 1.7.0-beta.1 | 1666ms🥈           | 1018ms🥈             | 149ms🥈 | 377MB🥈      |
| Rsbuild 1.7.0-beta.1    | 1248ms🥇           | 830ms🥇              | 153ms🥉 | 318MB🥇      |
| Vite 8.0.0-beta.5       | 7353ms🥉           | 4063ms🥉             | 131ms🥇 | 894MB🥉      |
| webpack 5.103.0         | 16008ms            | 22212ms              | 2821ms  | 2141MB       |

Build metrics:

| Name                    | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.7.0-beta.1 | 4501ms🥉         | 2660ms🥈           | 1034MB🥈     | 5931.4kB🥈  | 1367.2kB🥈   |
| Rsbuild 1.7.0-beta.1    | 3895ms🥈         | 2976ms🥉           | 1037MB🥉     | 5981.8kB    | 1366.9kB🥇   |
| Vite 8.0.0-beta.5       | 1823ms🥇         | 2406ms🥇           | 873MB🥇      | 5569.9kB🥇  | 1484.9kB     |
| webpack 5.103.0         | 28938ms          | 5297ms             | 1887MB       | 5955.4kB🥉  | 1450.2kB🥉   |

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
| Rspack CLI 1.7.0-beta.1 | 3526ms🥉         | 2851ms🥉           | 620MB🥇      | 2173.7kB🥈  | 671.0kB🥈    |
| Rsbuild 1.7.0-beta.1    | 4738ms           | 2919ms             | 663MB🥈      | 2173.2kB🥇  | 670.8kB🥇    |
| Vite 8.0.0-beta.5       | 3937ms           | 3144ms             | 949MB        | 2188.8kB    | 678.2kB      |
| Rolldown 1.0.0-beta.53  | 2787ms🥇         | 3089ms             | 913MB🥉      | 2206.1kB    | 680.0kB      |
| webpack 5.103.0         | 28497ms          | 14850ms            | 1677MB       | 2176.6kB🥉  | 672.5kB🥉    |
| esbuild 0.27.1          | 3472ms🥈         | 2561ms🥈           | N/A          | 3053.5kB    | 935.2kB      |
| Farm 1.7.11             | 15462ms          | 3502ms             | 1381MB       | 3988.0kB    | 1384.0kB     |
| Parcel 2.16.3           | 20646ms          | 1716ms🥇           | 2168MB       | 2216.1kB    | 678.8kB      |

---

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

Build metrics:

| Name                    | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ----------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.7.0-beta.1 | 1022ms🥉         | 745ms🥉            | 259MB🥉      | 1008.0kB🥉  | 270.9kB🥈    |
| Rsbuild 1.7.0-beta.1    | 1097ms           | 972ms              | 246MB🥈      | 1007.9kB🥈  | 270.9kB🥉    |
| Rolldown 1.0.0-beta.53  | 556ms🥈          | 490ms🥈            | 217MB🥇      | 1012.2kB    | 271.8kB      |
| webpack 5.103.0         | 5100ms           | 1768ms             | 623MB        | 1006.2kB🥇  | 270.5kB🥇    |
| esbuild 0.27.1          | 303ms🥇          | 369ms🥇            | N/A          | 1025.2kB    | 276.7kB      |

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
