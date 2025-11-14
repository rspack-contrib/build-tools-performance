# Build Tools Comparison

Benchmark comparing JavaScript bundlers and build tools ([Rspack](https://github.com/web-infra-dev/rspack), [Rsbuild](https://github.com/web-infra-dev/rsbuild), [webpack](https://github.com/webpack/webpack), [Vite](https://github.com/vitejs/vite), [rolldown-vite](https://github.com/vitejs/rolldown-vite), [esbuild](https://github.com/evanw/esbuild), [Parcel](https://github.com/parcel-bundler/parcel) and [Farm](https://github.com/farm-fe/farm)) for dev server startup time, build performance and bundle size for applications with different module sizes.

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

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/19323852850 (2025-11-13)

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

Development metrics:

| Name                  | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| --------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 1.6.1      | 2130ms🥉           | 906ms🥉              | 107ms🥇 | 351MB🥉      |
| Rsbuild 1.6.3         | 1529ms🥇           | 801ms🥈              | 114ms🥈 | 315MB🥇      |
| Vite (Rolldown) 7.2.2 | 6408ms             | 5185ms               | 138ms   | 401MB        |
| Vite (Rollup) 7.2.2   | 7116ms             | 5714ms               | 122ms🥉 | 323MB🥈      |
| webpack (SWC) 5.102.1 | 5150ms             | 3905ms               | 811ms   | 814MB        |
| Farm 1.7.11           | 2018ms🥈           | 733ms🥇              | 140ms   | 554MB        |
| Parcel 2.16.1         | 3727ms             | 1054ms               | 151ms   | 1170MB       |

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.6.1      | 843ms🥈          | 893ms              | 285MB🥉      | 846.2kB     | 220.8kB🥉    |
| Rsbuild 1.6.3         | 965ms🥉          | 721ms🥈            | 271MB🥈      | 877.9kB     | 214.5kB🥇    |
| Vite (Rolldown) 7.2.2 | 628ms🥇          | 461ms🥇            | 242MB🥇      | 830.5kB🥈   | 226.1kB      |
| Vite (Rollup) 7.2.2   | 2917ms           | 2073ms             | 502MB        | 805.0kB🥇   | 217.1kB🥈    |
| webpack (SWC) 5.102.1 | 4704ms           | 1674ms             | 638MB        | 843.2kB🥉   | 226.4kB      |
| Farm 1.7.11           | 1986ms           | 1059ms             | 384MB        | 1085.3kB    | 258.3kB      |
| Parcel 2.16.1         | 3784ms           | 868ms🥉            | 1118MB       | 962.0kB     | 229.8kB      |

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

Development metrics:

| Name                  | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| --------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 1.6.1      | 2097ms🥉           | 1403ms🥉             | 209ms   | 292MB🥈      |
| Rsbuild 1.6.3         | 1346ms🥇           | 1286ms🥈             | 107ms   | 265MB🥇      |
| Vite (Rolldown) 7.2.2 | 5138ms             | 3454ms               | 103ms🥉 | 519MB        |
| Vite (Rollup) 7.2.2   | 7294ms             | 5337ms               | 98ms🥈  | 302MB🥉      |
| webpack (SWC) 5.102.1 | 19040ms            | 19575ms              | 2865ms  | 1401MB       |
| Farm 1.7.11           | 1662ms🥈           | 901ms🥇              | 85ms🥇  | 500MB        |
| Parcel 2.16.1         | 16033ms            | 3693ms               | 519ms   | 1833MB       |

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.6.1      | 5260ms🥈         | 2859ms             | 564MB🥈      | 2853.6kB    | 679.6kB🥇    |
| Rsbuild 1.6.3         | 5279ms🥉         | 2777ms🥉           | 568MB🥉      | 2884.7kB    | 680.5kB🥈    |
| Vite (Rolldown) 7.2.2 | 1921ms🥇         | 1998ms🥇           | 511MB🥇      | 2660.3kB🥈  | 725.4kB      |
| Vite (Rollup) 7.2.2   | 8884ms           | 8005ms             | 943MB        | 2582.9kB🥇  | 689.5kB🥉    |
| webpack (SWC) 5.102.1 | 18581ms          | 4341ms             | 1231MB       | 2832.0kB🥉  | 697.9kB      |
| Farm 1.7.11           | 5871ms           | 2420ms🥈           | 606MB        | 3540.7kB    | 806.8kB      |
| Parcel 2.16.1         | 16973ms          | 2925ms             | 1965MB       | 3485.4kB    | 765.3kB      |

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

Development metrics:

| Name                  | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| --------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 1.6.1      | 1852ms🥈           | 1833ms🥈             | 117ms🥉 | 356MB🥈      |
| Rsbuild 1.6.3         | 1188ms🥇           | 908ms🥇              | 106ms🥈 | 315MB🥇      |
| Vite (Rolldown) 7.2.2 | 11122ms            | 7281ms               | 94ms🥇  | 854MB        |
| Vite (Rollup) 7.2.2   | 9225ms🥉           | 5551ms🥉             | 126ms   | 360MB🥉      |
| webpack (SWC) 5.102.1 | 19251ms            | 21307ms              | 4925ms  | 2088MB       |

Build metrics:

| Name                  | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| --------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.6.1      | 5604ms🥉         | 2589ms🥇           | 1014MB🥈     | 6003.5kB    | 1369.5kB🥈   |
| Rsbuild 1.6.3         | 3619ms🥈         | 3262ms🥉           | 1021MB🥉     | 6061.8kB    | 1369.4kB🥇   |
| Vite (Rolldown) 7.2.2 | 3283ms🥇         | 2987ms🥈           | 827MB🥇      | 5529.1kB🥈  | 1483.5kB     |
| Vite (Rollup) 7.2.2   | 12025ms          | 14190ms            | 1425MB       | 5372.8kB🥇  | 1410.1kB🥉   |
| webpack (SWC) 5.102.1 | 39479ms          | 5798ms             | 1854MB       | 5954.4kB🥉  | 1450.3kB     |

### ui-components

A React app that imports UI components from several popular UI libraries.

Including [@mui/material](https://npmjs.com/package/@mui/material), [antd](https://npmjs.com/package/antd), [@chakra-ui/react](https://npmjs.com/package/@chakra-ui/react), [@fluentui/react](https://npmjs.com/package/@fluentui/react), [@headlessui/react](https://npmjs.com/package/@headlessui/react), [@mantine/core](https://npmjs.com/package/@mantine/core), [react-bootstrap](https://npmjs.com/package/react-bootstrap), [element-plus](https://npmjs.com/package/element-plus), [vant](https://npmjs.com/package/vant), and [vuetify](https://npmjs.com/package/vuetify).

```bash
CASE=ui-components pnpm benchmark
```

Build metrics:

| Name                   | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.6.1       | 2607ms           | 1678ms             | 605MB🥈      | 2056.8kB🥉  | 629.6kB🥈    |
| Rsbuild 1.6.3          | 3655ms           | 2395ms             | 637MB🥉      | 2054.8kB🥇  | 629.1kB🥇    |
| Vite (Rollup) 7.2.2    | 9055ms           | 9101ms             | 1508MB       | 2073.6kB    | 650.6kB      |
| Vite (Rolldown) 7.2.2  | 1893ms🥉         | 1724ms             | 905MB        | 2056.6kB🥈  | 633.1kB      |
| Rolldown 1.0.0-beta.47 | 1198ms🥇         | 1323ms🥈           | 862MB        | 2074.1kB    | 635.1kB      |
| webpack (SWC) 5.102.1  | 15453ms          | 8506ms             | 1730MB       | 2056.9kB    | 630.9kB🥉    |
| esbuild 0.27.0         | 1746ms🥈         | 1643ms🥉           | N/A          | 2896.9kB    | 888.7kB      |
| Farm 1.7.11            | 6571ms           | 1923ms             | 1305MB       | 3822.7kB    | 1330.7kB     |
| Parcel 2.16.1          | 11718ms          | 981ms🥇            | 2028MB       | 2095.4kB    | 637.6kB      |

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

Build metrics:

| Name                   | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.6.1       | 591ms🥉          | 490ms🥉            | 260MB        | 1008.1kB🥉  | 270.9kB🥈    |
| Rsbuild 1.6.3          | 616ms            | 522ms              | 245MB🥉      | 1008.0kB🥈  | 270.9kB🥉    |
| Rolldown 1.0.0-beta.47 | 298ms🥈          | 301ms🥈            | 220MB🥈      | 1012.2kB    | 271.8kB      |
| webpack (SWC) 5.102.1  | 3168ms           | 905ms              | 678MB        | 1006.2kB🥇  | 270.5kB🥇    |
| esbuild 0.27.0         | 266ms🥇          | 256ms🥇            | N/A          | 1025.3kB    | 276.7kB      |

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
pnpm start:rolldown-vite # Start Vite (Rolldown)
pnpm start:farm # Start Farm

# Build
pnpm build:rspack # Build Rspack
pnpm build:rsbuild # Build Rsbuild
pnpm build:webpack # Build webpack
pnpm build:vite # Build Vite
pnpm build:rolldown-vite # Build Vite (Rolldown)
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
