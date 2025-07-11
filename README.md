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

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/16188557969 (2025-07-10)

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

#### Build performance

| Name                    | Dev cold start | Server start | Page load | Root HMR | Leaf HMR | Prod build |
| ----------------------- | -------------- | ------------ | --------- | -------- | -------- | ---------- |
| Rspack CLI 1.4.0        | 769ms          | 552ms        | 217ms     | 121ms    | 136ms    | 675ms      |
| Rspack CLI (Lazy) 1.4.0 | 351ms          | 309ms        | 42ms      | 112ms    | 108ms    | 702ms      |
| Rsbuild 1.4.0           | 667ms          | 483ms        | 184ms     | 116ms    | 112ms    | 577ms      |
| Rsbuild (Lazy) 1.4.0    | 572ms          | 397ms        | 175ms     | 107ms    | 115ms    | 598ms      |
| Vite (Rolldown) 7.0.2   | 3294ms         | 103ms        | 3191ms    | 172ms    | 148ms    | 528ms      |
| Vite (SWC) 7.0.0        | 4008ms         | 102ms        | 3905ms    | 166ms    | 139ms    | 1936ms     |
| webpack (SWC) 5.99.9    | 3334ms         | 2688ms       | 645ms     | 347ms    | 264ms    | 2910ms     |

#### Bundle size

| Name                    | Total size | Gzipped size |
| ----------------------- | ---------- | ------------ |
| Rspack CLI 1.4.0        | 839.1kB    | 218.5kB      |
| Rspack CLI (Lazy) 1.4.0 | 839.1kB    | 218.5kB      |
| Rsbuild 1.4.0           | 870.8kB    | 212.4kB      |
| Rsbuild (Lazy) 1.4.0    | 870.8kB    | 212.4kB      |
| Vite (Rolldown) 7.0.2   | 861.0kB    | 236.7kB      |
| Vite (SWC) 7.0.0        | 801.4kB    | 216.4kB      |
| webpack (SWC) 5.99.9    | 882.1kB    | 237.3kB      |

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

#### Build performance

| Name                    | Dev cold start | Server start | Page load | Root HMR | Leaf HMR | Prod build |
| ----------------------- | -------------- | ------------ | --------- | -------- | -------- | ---------- |
| Rspack CLI 1.4.0        | 2143ms         | 1841ms       | 302ms     | 285ms    | 178ms    | 2039ms     |
| Rspack CLI (Lazy) 1.4.0 | 744ms          | 658ms        | 85ms      | 77ms     | 75ms     | 2216ms     |
| Rsbuild 1.4.0           | 1925ms         | 1651ms       | 273ms     | 225ms    | 199ms    | 1908ms     |
| Rsbuild (Lazy) 1.4.0    | 731ms          | 522ms        | 208ms     | 87ms     | 72ms     | 1866ms     |
| Vite (Rolldown) 7.0.2   | 4739ms         | 307ms        | 4432ms    | 122ms    | 102ms    | 1799ms     |
| Vite (SWC) 7.0.0        | 5257ms         | 220ms        | 5037ms    | 139ms    | 110ms    | 7205ms     |
| webpack (SWC) 5.99.9    | 10072ms        | 9101ms       | 971ms     | 1825ms   | 1179ms   | 8634ms     |

#### Bundle size

| Name                    | Total size | Gzipped size |
| ----------------------- | ---------- | ------------ |
| Rspack CLI 1.4.0        | 2846.6kB   | 677.3kB      |
| Rspack CLI (Lazy) 1.4.0 | 2846.6kB   | 677.3kB      |
| Rsbuild 1.4.0           | 2877.6kB   | 678.7kB      |
| Rsbuild (Lazy) 1.4.0    | 2877.6kB   | 678.7kB      |
| Vite (Rolldown) 7.0.2   | 2719.2kB   | 752.5kB      |
| Vite (SWC) 7.0.0        | 2579.4kB   | 688.7kB      |
| webpack (SWC) 5.99.9    | 2871.1kB   | 711.4kB      |

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

#### Build performance

| Name                    | Dev cold start | Server start | Page load | Root HMR | Leaf HMR | Prod build |
| ----------------------- | -------------- | ------------ | --------- | -------- | -------- | ---------- |
| Rspack CLI 1.4.0        | 2906ms         | 2519ms       | 387ms     | 356ms    | 271ms    | 2861ms     |
| Rspack CLI (Lazy) 1.4.0 | 505ms          | 448ms        | 57ms      | 123ms    | 105ms    | 2959ms     |
| Rsbuild 1.4.0           | 3237ms         | 2873ms       | 364ms     | 402ms    | 297ms    | 3119ms     |
| Rsbuild (Lazy) 1.4.0    | 797ms          | 597ms        | 199ms     | 114ms    | 106ms    | 3182ms     |
| Vite (Rolldown) 7.0.2   | 4654ms         | 154ms        | 4500ms    | 175ms    | 141ms    | 2468ms     |
| Vite (SWC) 7.0.0        | 5348ms         | 160ms        | 5187ms    | 156ms    | 135ms    | 9776ms     |
| webpack (SWC) 5.99.9    | 14324ms        | 13262ms      | 1062ms    | 3513ms   | 2521ms   | 11724ms    |

#### Bundle size

| Name                    | Total size | Gzipped size |
| ----------------------- | ---------- | ------------ |
| Rspack CLI 1.4.0        | 5996.5kB   | 1367.1kB     |
| Rspack CLI (Lazy) 1.4.0 | 5996.5kB   | 1367.1kB     |
| Rsbuild 1.4.0           | 6054.8kB   | 1367.3kB     |
| Rsbuild (Lazy) 1.4.0    | 6054.8kB   | 1367.3kB     |
| Vite (Rolldown) 7.0.2   | 5676.8kB   | 1547.2kB     |
| Vite (SWC) 7.0.0        | 5369.2kB   | 1409.3kB     |
| webpack (SWC) 5.99.9    | 5993.4kB   | 1464.6kB     |

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
| Rspack CLI 1.4.6       | 742ms      |
| Rsbuild 1.4.6          | 787ms      |
| Rolldown 1.0.0-beta.25 | 272ms      |
| webpack (SWC) 5.100.0  | 5548ms     |

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
