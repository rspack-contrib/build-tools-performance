# Build Tools Comparison

Benchmark comparing JavaScript bundlers and build tools ([Rspack](https://github.com/web-infra-dev/rspack), [Rsbuild](https://github.com/web-infra-dev/rsbuild), [webpack](https://github.com/webpack/webpack), [Vite](https://github.com/vitejs/vite), [rolldown-vite](https://github.com/vitejs/rolldown-vite), [esbuild](https://github.com/evanw/esbuild), [Parcel](https://github.com/parcel-bundler/parcel) and [Farm](https://github.com/farm-fe/farm)) for dev server startup time, build performance and bundle size for applications with different module sizes.

## Metrics

| Name                     | Description                                                 | Notes                                   |
| ------------------------ | ----------------------------------------------------------- | --------------------------------------- |
| **Startup (no cache)**   | Time from starting the dev server to page loaded            | -                                       |
| **Startup (with cache)** | Time from starting the dev server to page loaded with cache | -                                       |
| **HMR**                  | Time to HMR after changing a module                         | -                                       |
| **Build (no cache)**     | Time taken to build the production bundles                  |                                         |
| **Build (with cache)**   | Time taken to build the production bundles with cache       |                                         |
| **Memory (RSS)**         | Memory usage at the end of a cold start or production build |                                         |
| **Output size**          | Total size of the output bundle                             | Minified by the default minifier        |
| **Gzipped size**         | Gzipped size of the output bundle                           | Represents actual network transfer size |

## Notes

- Build target is set to `es2022` (`Chrome >= 93`) for all tools.
- Minification is enabled in production for all tools.
- Source map is enabled in development and disabled in production for all tools.
- Benchmarks run on GitHub Actions with variable hardware, which may cause inconsistent results.

## Results

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/19229393801 (2025-11-10)

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

Development metrics:

| Name                   | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ---------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 1.6.0       | 1717ms🥈           | 918ms🥈              | 107ms🥈 | 154MB🥉      |
| Rsbuild 1.6.0          | 1276ms🥇           | 999ms🥉              | 158ms   | 311MB        |
| Vite (Rolldown) 7.1.20 | 5460ms             | 5153ms               | 78ms🥇  | 94MB🥇       |
| Vite (Rollup) 7.1.12   | 4449ms             | 3513ms               | 136ms   | 94MB🥈       |
| webpack (SWC) 5.102.1  | 5108ms             | 2455ms               | 467ms   | 589MB        |
| Farm 1.7.11            | 1822ms🥉           | 733ms🥇              | 150ms   | 479MB        |
| Parcel 2.16.0          | 3728ms             | 1279ms               | 107ms🥉 | 959MB        |

Build metrics:

| Name                   | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.6.0       | 1170ms🥉         | 1019ms             | 284MB🥉      | 846.1kB     | 220.7kB🥉    |
| Rsbuild 1.6.0          | 1161ms🥈         | 601ms🥇            | 271MB🥈      | 877.9kB     | 214.5kB🥇    |
| Vite (Rolldown) 7.1.20 | 714ms🥇          | 662ms🥈            | 258MB🥇      | 830.5kB🥈   | 226.1kB      |
| Vite (Rollup) 7.1.12   | 2214ms           | 2134ms             | 508MB        | 806.4kB🥇   | 217.5kB🥈    |
| webpack (SWC) 5.102.1  | 4299ms           | 1669ms             | 645MB        | 843.2kB🥉   | 225.3kB      |
| Farm 1.7.11            | 1978ms           | 1026ms             | 395MB        | 1085.3kB    | 258.3kB      |
| Parcel 2.16.0          | 4190ms           | 811ms🥉            | 1117MB       | 962.0kB     | 229.8kB      |

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

Development metrics:

| Name                   | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ---------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 1.6.0       | 2157ms🥉           | 1677ms🥉             | 109ms🥉 | 149MB🥉      |
| Rsbuild 1.6.0          | 1800ms🥇           | 1322ms🥈             | 160ms   | 258MB        |
| Vite (Rolldown) 7.1.20 | 5825ms             | 4816ms               | 118ms   | 95MB🥇       |
| Vite (Rollup) 7.1.12   | 7386ms             | 4562ms               | 89ms🥇  | 95MB🥈       |
| webpack (SWC) 5.102.1  | 15844ms            | 17299ms              | 2728ms  | 1263MB       |
| Farm 1.7.11            | 2022ms🥈           | 943ms🥇              | 96ms🥈  | 452MB        |
| Parcel 2.16.0          | 15764ms            | 1998ms               | 440ms   | 1838MB       |

Build metrics:

| Name                   | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.6.0       | 3799ms🥈         | 2398ms🥈           | 571MB🥈      | 2853.6kB    | 679.6kB🥇    |
| Rsbuild 1.6.0          | 4394ms🥉         | 2992ms             | 573MB🥉      | 2884.7kB    | 680.5kB🥈    |
| Vite (Rolldown) 7.1.20 | 1907ms🥇         | 1713ms🥇           | 501MB🥇      | 2660.3kB🥈  | 725.4kB      |
| Vite (Rollup) 7.1.12   | 9383ms           | 8392ms             | 944MB        | 2584.4kB🥇  | 689.8kB🥉    |
| webpack (SWC) 5.102.1  | 23244ms          | 5042ms             | 1240MB       | 2832.1kB🥉  | 697.4kB      |
| Farm 1.7.11            | 8991ms           | 3070ms             | 613MB        | 3540.7kB    | 806.8kB      |
| Parcel 2.16.0          | 17872ms          | 2876ms🥉           | 1968MB       | 3485.4kB    | 765.3kB      |

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

Development metrics:

| Name                   | Startup (no cache) | Startup (with cache) | HMR     | Memory (RSS) |
| ---------------------- | ------------------ | -------------------- | ------- | ------------ |
| Rspack CLI 1.6.0       | 2883ms🥈           | 1626ms🥈             | 162ms🥉 | 152MB🥉      |
| Rsbuild 1.6.0          | 1911ms🥇           | 1357ms🥇             | 234ms   | 314MB        |
| Vite (Rolldown) 7.1.20 | 14150ms            | 6389ms               | 160ms🥈 | 96MB🥇       |
| Vite (Rollup) 7.1.12   | 12429ms🥉          | 5184ms🥉             | 119ms🥇 | 99MB🥈       |
| webpack (SWC) 5.102.1  | 29669ms            | 54666ms              | 9560ms  | 1898MB       |

Build metrics:

| Name                   | Build (no cache) | Build (with cache) | Memory (RSS) | Output size | Gzipped size |
| ---------------------- | ---------------- | ------------------ | ------------ | ----------- | ------------ |
| Rspack CLI 1.6.0       | 9388ms🥉         | 5400ms🥈           | 1017MB🥈     | 6003.5kB    | 1369.4kB🥇   |
| Rsbuild 1.6.0          | 8312ms🥈         | 5544ms🥉           | 1032MB🥉     | 6061.8kB    | 1369.4kB🥈   |
| Vite (Rolldown) 7.1.20 | 4309ms🥇         | 3270ms🥇           | 814MB🥇      | 5529.1kB🥈  | 1483.5kB     |
| Vite (Rollup) 7.1.12   | 15898ms          | 13957ms            | 1406MB       | 5374.2kB🥇  | 1410.5kB🥉   |
| webpack (SWC) 5.102.1  | 59453ms          | 9748ms             | 1839MB       | 5954.1kB🥉  | 1452.2kB     |

### ui-components

A React app that imports UI components from several popular UI libraries.

Including [@mui/material](https://npmjs.com/package/@mui/material), [antd](https://npmjs.com/package/antd), [@chakra-ui/react](https://npmjs.com/package/@chakra-ui/react), [@fluentui/react](https://npmjs.com/package/@fluentui/react), [@headlessui/react](https://npmjs.com/package/@headlessui/react), [@mantine/core](https://npmjs.com/package/@mantine/core), [react-bootstrap](https://npmjs.com/package/react-bootstrap), [element-plus](https://npmjs.com/package/element-plus), [vant](https://npmjs.com/package/vant), and [vuetify](https://npmjs.com/package/vuetify).

```bash
CASE=ui-components pnpm benchmark
```

Build metrics:

| Name                   | Build (no cache) | Build (with cache) | Output size | Gzipped size |
| ---------------------- | ---------------- | ------------------ | ----------- | ------------ |
| Rspack CLI 1.6.0       | 4730ms           | 3078ms             | 2051.2kB🥈  | 627.8kB🥈    |
| Rsbuild 1.6.0          | 5841ms           | 4064ms             | 2049.2kB🥇  | 627.2kB🥇    |
| Vite (Rollup) 7.1.12   | 13281ms          | 12912ms            | 2071.0kB    | 649.9kB      |
| Vite (Rolldown) 7.1.20 | 2367ms🥈         | 2203ms🥈           | 2051.5kB    | 631.6kB      |
| Rolldown 1.0.0-beta.45 | 1799ms🥇         | 2273ms🥉           | 2066.7kB    | 632.3kB      |
| webpack (SWC) 5.102.1  | 20945ms          | 12951ms            | 2051.3kB🥉  | 629.0kB🥉    |
| esbuild 0.25.11        | 2772ms🥉         | 2510ms             | 2886.4kB    | 885.2kB      |
| Farm 1.7.11            | 9643ms           | 2634ms             | 3812.5kB    | 1326.7kB     |
| Parcel 2.16.0          | 16964ms          | 1707ms🥇           | 2090.0kB    | 635.8kB      |

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

Build metrics:

| Name                   | Build (no cache) | Build (with cache) | Output size | Gzipped size |
| ---------------------- | ---------------- | ------------------ | ----------- | ------------ |
| Rspack CLI 1.6.0       | 3435ms           | 2141ms🥉           | 1008.1kB🥉  | 270.9kB🥈    |
| Rsbuild 1.6.0          | 2550ms🥉         | 2666ms             | 1008.0kB🥈  | 270.9kB🥉    |
| Rolldown 1.0.0-beta.45 | 966ms🥈          | 890ms🥈            | 1012.2kB    | 271.8kB      |
| webpack (SWC) 5.102.1  | 8767ms           | 2712ms             | 1006.2kB🥇  | 270.5kB🥇    |
| esbuild 0.25.11        | 685ms🥇          | 686ms🥇            | 1025.3kB    | 276.7kB      |

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
