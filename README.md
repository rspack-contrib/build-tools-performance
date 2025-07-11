# Build Tools Comparison

Benchmark comparing JavaScript bundlers and build tools ([Rspack](https://github.com/web-infra-dev/rspack), [Rsbuild](https://github.com/web-infra-dev/rsbuild), [webpack](https://github.com/webpack/webpack), [Vite](https://github.com/vitejs/vite), [rolldown-vite](https://github.com/vitejs/rolldown-vite) and [Farm](https://github.com/farm-fe/farm)) for dev server startup time, build performance and bundle size for applications with different module sizes.

## Metrics

| Name               | Description                                     | Notes                                     |
| ------------------ | ----------------------------------------------- | ----------------------------------------- |
| **Dev cold start** | Total time from dev server start to page loaded | Equals to `server start` + `page load`    |
| **Server start**   | Time taken for the dev server to start          | Includes initial build for loaded modules |
| **Page load**      | Time to load the page after server is ready     |                                           |
| **Root HMR**       | Time to HMR after changing a root module        |                                           |
| **Leaf HMR**       | Time to HMR after changing a leaf module        |                                           |
| **Prod build**     | Time taken to build the production bundles      |                                           |
| **Total size**     | Total size of the bundle                        | Minified by the default minifier          |
| **Gzipped size**   | Gzipped size of the bundle                      | Represents actual network transfer size   |

## Notes

- Build target is set to `es2022` (`Chrome >= 93`) for all tools.
- Minification is enabled in production for all tools.
- Source map is enabled in development and disabled in production for all tools.

## Bench cases

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/16198040814 (2025-07-10)

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

#### Build performance

| Name                        | Dev cold start           | Root HMR | Leaf HMR | Prod build |
| --------------------------- | ------------------------ | -------- | -------- | ---------- |
| Rspack CLI 1.4.6            | 1662ms (1253ms + 408ms)  | 193ms    | 163ms    | 1255ms     |
| Rspack CLI (Lazy) 1.4.6     | 792ms (677ms + 114ms)    | 203ms    | 146ms    | 1387ms     |
| Rsbuild 1.4.6               | 1267ms (932ms + 334ms)   | 154ms    | 123ms    | 1156ms     |
| Rsbuild (Lazy) 1.4.6        | 1312ms (942ms + 369ms)   | 203ms    | 124ms    | 1061ms     |
| Vite (Rolldown + Oxc) 7.0.7 | 6604ms (200ms + 6403ms)  | 173ms    | 67ms     | 738ms      |
| Vite (Rollup + SWC) 7.0.4   | 7309ms (254ms + 7055ms)  | 146ms    | 141ms    | 4130ms     |
| webpack (SWC) 5.100.0       | 6323ms (5205ms + 1117ms) | 681ms    | 419ms    | 6208ms     |

#### Bundle size

| Name                        | Total size | Gzipped size |
| --------------------------- | ---------- | ------------ |
| Rspack CLI 1.4.6            | 839.0kB    | 218.6kB      |
| Rspack CLI (Lazy) 1.4.6     | 839.0kB    | 218.6kB      |
| Rsbuild 1.4.6               | 870.7kB    | 212.4kB      |
| Rsbuild (Lazy) 1.4.6        | 870.7kB    | 212.4kB      |
| Vite (Rolldown + Oxc) 7.0.7 | 839.8kB    | 230.8kB      |
| Vite (Rollup + SWC) 7.0.4   | 801.1kB    | 216.3kB      |
| webpack (SWC) 5.100.0       | 883.4kB    | 238.1kB      |

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

#### Build performance

| Name                        | Dev cold start          | Root HMR | Leaf HMR | Prod build |
| --------------------------- | ----------------------- | -------- | -------- | ---------- |
| Rspack CLI 1.4.6            | 1339ms (1109ms + 229ms) | 196ms    | 140ms    | 1185ms     |
| Rspack CLI (Lazy) 1.4.6     | 318ms (279ms + 39ms)    | 101ms    | 87ms     | 1177ms     |
| Rsbuild 1.4.6               | 1278ms (1114ms + 164ms) | 196ms    | 162ms    | 1246ms     |
| Rsbuild (Lazy) 1.4.6        | 431ms (311ms + 120ms)   | 99ms     | 84ms     | 1243ms     |
| Vite (Rolldown + Oxc) 7.0.7 | 2327ms (104ms + 2223ms) | 122ms    | 100ms    | 746ms      |
| Vite (Rollup + SWC) 7.0.4   | 2723ms (107ms + 2616ms) | 125ms    | 101ms    | 4566ms     |
| webpack (SWC) 5.100.0       | 7285ms (6635ms + 650ms) | 779ms    | 657ms    | 8858ms     |

#### Bundle size

| Name                        | Total size | Gzipped size |
| --------------------------- | ---------- | ------------ |
| Rspack CLI 1.4.6            | 2846.4kB   | 677.2kB      |
| Rspack CLI (Lazy) 1.4.6     | 2846.4kB   | 677.2kB      |
| Rsbuild 1.4.6               | 2877.4kB   | 678.5kB      |
| Rsbuild (Lazy) 1.4.6        | 2877.4kB   | 678.5kB      |
| Vite (Rolldown + Oxc) 7.0.7 | 2718.1kB   | 751.9kB      |
| Vite (Rollup + SWC) 7.0.4   | 2579.1kB   | 688.5kB      |
| webpack (SWC) 5.100.0       | 2872.1kB   | 710.2kB      |

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

#### Build performance

| Name                        | Dev cold start             | Root HMR | Leaf HMR | Prod build |
| --------------------------- | -------------------------- | -------- | -------- | ---------- |
| Rspack CLI 1.4.6            | 3709ms (3270ms + 439ms)    | 440ms    | 295ms    | 3198ms     |
| Rspack CLI (Lazy) 1.4.6     | 584ms (511ms + 72ms)       | 104ms    | 107ms    | 2884ms     |
| Rsbuild 1.4.6               | 2872ms (2569ms + 303ms)    | 356ms    | 274ms    | 2629ms     |
| Rsbuild (Lazy) 1.4.6        | 798ms (572ms + 226ms)      | 97ms     | 95ms     | 3095ms     |
| Vite (Rolldown + Oxc) 7.0.7 | 5255ms (186ms + 5069ms)    | 171ms    | 125ms    | 1920ms     |
| Vite (Rollup + SWC) 7.0.4   | 5836ms (205ms + 5630ms)    | 174ms    | 126ms    | 10125ms    |
| webpack (SWC) 5.100.0       | 14110ms (13101ms + 1009ms) | 3770ms   | 2774ms   | 17626ms    |

#### Bundle size

| Name                        | Total size | Gzipped size |
| --------------------------- | ---------- | ------------ |
| Rspack CLI 1.4.6            | 5996.4kB   | 1367.2kB     |
| Rspack CLI (Lazy) 1.4.6     | 5996.4kB   | 1367.2kB     |
| Rsbuild 1.4.6               | 6054.6kB   | 1367.4kB     |
| Rsbuild (Lazy) 1.4.6        | 6054.6kB   | 1367.4kB     |
| Vite (Rolldown + Oxc) 7.0.7 | 5675.8kB   | 1546.6kB     |
| Vite (Rollup + SWC) 7.0.4   | 5369.0kB   | 1409.2kB     |
| webpack (SWC) 5.100.0       | 5994.5kB   | 1464.3kB     |

### ui-components

A React app that imports UI components from several popular UI libraries.

```bash
CASE=ui-components pnpm benchmark
```

#### Build performance

| Name                        | Prod build |
| --------------------------- | ---------- |
| Rspack CLI 1.4.6            | 1640ms     |
| Rsbuild 1.4.6               | 1536ms     |
| Vite (Rollup + SWC) 7.0.4   | 6286ms     |
| Vite (Rolldown + Oxc) 7.0.7 | 672ms      |
| Rolldown 1.0.0-beta.25      | 567ms      |
| webpack (SWC) 5.100.0       | 15943ms    |

#### Bundle size

| Name                        | Total size | Gzipped size |
| --------------------------- | ---------- | ------------ |
| Rspack CLI 1.4.6            | 2210.3kB   | 621.7kB      |
| Rsbuild 1.4.6               | 2021.9kB   | 615.9kB      |
| Vite (Rollup + SWC) 7.0.4   | 2037.5kB   | 638.2kB      |
| Vite (Rolldown + Oxc) 7.0.7 | 2054.4kB   | 636.3kB      |
| Rolldown 1.0.0-beta.25      | 2071.2kB   | 637.3kB      |
| webpack (SWC) 5.100.0       | 2072.9kB   | 624.9kB      |

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

#### Build performance

| Name                   | Prod build |
| ---------------------- | ---------- |
| Rspack CLI 1.4.6       | 1535ms     |
| Rsbuild 1.4.6          | 1293ms     |
| Rolldown 1.0.0-beta.25 | 456ms      |
| webpack (SWC) 5.100.0  | 13517ms    |

#### Bundle size

| Name                   | Total size | Gzipped size |
| ---------------------- | ---------- | ------------ |
| Rspack CLI 1.4.6       | 1009.3kB   | 270.9kB      |
| Rsbuild 1.4.6          | 1009.3kB   | 270.9kB      |
| Rolldown 1.0.0-beta.25 | 1016.4kB   | 273.6kB      |
| webpack (SWC) 5.100.0  | 1023.3kB   | 272.0kB      |

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
