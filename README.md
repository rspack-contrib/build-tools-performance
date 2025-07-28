# Build Tools Comparison

Benchmark comparing JavaScript bundlers and build tools ([Rspack](https://github.com/web-infra-dev/rspack), [Rsbuild](https://github.com/web-infra-dev/rsbuild), [webpack](https://github.com/webpack/webpack), [Vite](https://github.com/vitejs/vite), [rolldown-vite](https://github.com/vitejs/rolldown-vite), [esbuild](https://github.com/evanw/esbuild), and [Farm](https://github.com/farm-fe/farm)) for dev server startup time, build performance and bundle size for applications with different module sizes.

## Metrics

| Name               | Description                                      | Notes                                   |
| ------------------ | ------------------------------------------------ | --------------------------------------- |
| **Dev cold start** | Time from starting the dev server to page loaded | -                                       |
| **HMR**            | Time to HMR after changing a module              | -                                       |
| **Prod build**     | Time taken to build the production bundles       |                                         |
| **Total size**     | Total size of the bundle                         | Minified by the default minifier        |
| **Gzipped size**   | Gzipped size of the bundle                       | Represents actual network transfer size |

## Notes

- Build target is set to `es2022` (`Chrome >= 93`) for all tools.
- Minification is enabled in production for all tools.
- Source map is enabled in development and disabled in production for all tools.

## Results

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/16540342624 (2025-07-26)

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

#### Build performance

| Name                         | Dev cold start | HMR    | Prod build |
| ---------------------------- | -------------- | ------ | ---------- |
| Rspack CLI 1.4.10            | 831ms          | 109ms  | 621ms      |
| Rspack CLI (Lazy) 1.4.10     | 386ms🥇        | 78ms🥇 | 708ms      |
| Rsbuild 1.4.11               | 711ms🥉        | 89ms🥉 | 543ms🥈    |
| Rsbuild (Lazy) 1.4.11        | 575ms🥈        | 78ms🥈 | 587ms🥉    |
| Vite (Rolldown + Oxc) 7.0.11 | 4313ms         | 129ms  | 367ms🥇    |
| Vite (Rollup + SWC) 7.0.6    | 3907ms         | 126ms  | 2369ms     |
| webpack (SWC) 5.100.2        | 3663ms         | 341ms  | 3844ms     |

#### Bundle sizes

| Name                         |
| ---------------------------- | ---------- | ------------ |
| Rspack CLI 1.4.10            | 838.9kB🥉  | 218.5kB      |
| Rspack CLI (Lazy) 1.4.10     | 838.9kB    | 218.5kB      |
| Rsbuild 1.4.11               | 870.6kB    | 212.3kB🥇    |
| Rsbuild (Lazy) 1.4.11        | 870.6kB    | 212.3kB🥈    |
| Vite (Rolldown + Oxc) 7.0.11 | 839.6kB    | 230.7kB      |
| Vite (Rollup + SWC) 7.0.6    | 798.7kB🥇  | 215.7kB🥉    |
| webpack (SWC) 5.100.2        | 836.0kB🥈  | 223.8kB      |

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

#### Build performance

| Name                         | Dev cold start | HMR    | Prod build |
| ---------------------------- | -------------- | ------ | ---------- |
| Rspack CLI 1.4.10            | 1580ms         | 159ms  | 1212ms🥈   |
| Rspack CLI (Lazy) 1.4.10     | 352ms🥇        | 79ms🥈 | 1375ms     |
| Rsbuild 1.4.11               | 1383ms🥉       | 148ms  | 1533ms     |
| Rsbuild (Lazy) 1.4.11        | 439ms🥈        | 66ms🥇 | 1303ms🥉   |
| Vite (Rolldown + Oxc) 7.0.11 | 2820ms         | 99ms🥉 | 748ms🥇    |
| Vite (Rollup + SWC) 7.0.6    | 2893ms         | 111ms  | 5287ms     |
| webpack (SWC) 5.100.2        | 7354ms         | 759ms  | 8844ms     |

#### Bundle sizes

| Name                         | Total size | Gzipped size |
| ---------------------------- | ---------- | ------------ |
| Rspack CLI 1.4.10            | 2846.4kB   | 677.2kB🥇    |
| Rspack CLI (Lazy) 1.4.10     | 2846.4kB   | 677.2kB🥈    |
| Rsbuild 1.4.11               | 2877.3kB   | 678.4kB🥉    |
| Rsbuild (Lazy) 1.4.11        | 2877.3kB   | 678.4kB      |
| Vite (Rolldown + Oxc) 7.0.11 | 2718.0kB🥈 | 751.7kB      |
| Vite (Rollup + SWC) 7.0.6    | 2576.7kB🥇 | 687.7kB      |
| webpack (SWC) 5.100.2        | 2824.8kB🥉 | 695.7kB      |

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

| Name                         | Dev cold start | HMR     | Prod build |
| ---------------------------- | -------------- | ------- | ---------- |
| Rspack CLI 1.4.10            | 2689ms🥉       | 272ms   | 2597ms🥉   |
| Rspack CLI (Lazy) 1.4.10     | 448ms🥇        | 89ms🥇  | 2446ms🥈   |
| Rsbuild 1.4.11               | 3038ms         | 301ms   | 2876ms     |
| Rsbuild (Lazy) 1.4.11        | 544ms🥈        | 89ms🥈  | 3318ms     |
| Vite (Rolldown + Oxc) 7.0.11 | 4483ms         | 129ms   | 1562ms🥇   |
| Vite (Rollup + SWC) 7.0.6    | 5281ms         | 112ms🥉 | 9913ms     |
| webpack (SWC) 5.100.2        | 14464ms        | 3046ms  | 17570ms    |

#### Bundle sizes

| Name                         | Total size | Gzipped size |
| ---------------------------- | ---------- | ------------ |
| Rspack CLI 1.4.10            | 5996.3kB   | 1367.1kB🥇   |
| Rspack CLI (Lazy) 1.4.10     | 5996.3kB   | 1367.1kB🥈   |
| Rsbuild 1.4.11               | 6054.6kB   | 1367.3kB🥉   |
| Rsbuild (Lazy) 1.4.11        | 6054.6kB   | 1367.3kB     |
| Vite (Rolldown + Oxc) 7.0.11 | 5675.7kB🥈 | 1546.6kB     |
| Vite (Rollup + SWC) 7.0.6    | 5366.6kB🥇 | 1408.3kB     |
| webpack (SWC) 5.100.2        | 5947.1kB🥉 | 1449.1kB     |

### ui-components

A React app that imports UI components from several popular UI libraries.

```bash
CASE=ui-components pnpm benchmark
```

#### Build performance

| Name                         | Prod build |
| ---------------------------- | ---------- |
| Rspack CLI 1.4.10            | 2183ms     |
| Rsbuild 1.4.11               | 2948ms     |
| Vite (Rollup + SWC) 7.0.6    | 11889ms    |
| Vite (Rolldown + Oxc) 7.0.11 | 1542ms🥇   |
| Rolldown 1.0.0-beta.29       | 1627ms🥈   |
| webpack (SWC) 5.100.2        | 13854ms    |
| esbuild 0.25.8               | 1725ms🥉   |
| Farm 1.7.10                  | 2038ms     |

#### Bundle sizes

| Name                         | Total size | Gzipped size |
| ---------------------------- | ---------- | ------------ |
| Rspack CLI 1.4.10            | 2027.1kB🥈 | 617.1kB🥈    |
| Rsbuild 1.4.11               | 2025.0kB🥇 | 616.6kB🥇    |
| Vite (Rollup + SWC) 7.0.6    | 2039.2kB   | 638.5kB      |
| Vite (Rolldown + Oxc) 7.0.11 | 2050.4kB   | 635.0kB      |
| Rolldown 1.0.0-beta.29       | 2064.9kB   | 635.5kB      |
| webpack (SWC) 5.100.2        | 2027.1kB🥉 | 618.4kB🥉    |
| esbuild 0.25.8               | 2837.7kB   | 870.3kB      |
| Farm 1.7.10                  | 3764.5kB   | 1309.0kB     |

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

#### Build performance

| Name                   | Prod build |
| ---------------------- | ---------- |
| Rspack CLI 1.4.10      | 1327ms🥉   |
| Rsbuild 1.4.11         | 1577ms     |
| Rolldown 1.0.0-beta.29 | 813ms🥈    |
| webpack (SWC) 5.100.2  | 5594ms     |
| esbuild 0.25.8         | 781ms🥇    |

#### Bundle sizes

| Name                   | Total size | Gzipped size |
| ---------------------- | ---------- | ------------ |
| Rspack CLI 1.4.10      | 1009.3kB🥈 | 270.9kB🥈    |
| Rsbuild 1.4.11         | 1009.3kB🥉 | 271.0kB🥉    |
| Rolldown 1.0.0-beta.29 | 1016.3kB   | 273.6kB      |
| webpack (SWC) 5.100.2  | 1007.4kB🥇 | 270.6kB🥇    |
| esbuild 0.25.8         | 1025.3kB   | 276.7kB      |

## Run locally

Run the `benchmark.mjs` script to get the results (requires Node.js >= 22):

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
