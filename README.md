# Build Tools Comparison

Benchmark comparing JavaScript bundlers and build tools ([Rspack](https://github.com/web-infra-dev/rspack), [Rsbuild](https://github.com/web-infra-dev/rsbuild), [webpack](https://github.com/webpack/webpack), [Vite](https://github.com/vitejs/vite), [rolldown-vite](https://github.com/vitejs/rolldown-vite), [esbuild](https://github.com/evanw/esbuild), and [Farm](https://github.com/farm-fe/farm)) for dev server startup time, build performance and bundle size for applications with different module sizes.

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

## Results

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/16210846550 (2025-07-10)

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

#### Build performance

| Name                        | Dev cold start      | Root HMR | Leaf HMR | Prod build |
| --------------------------- | ------------------- | -------- | -------- | ---------- |
| Rspack CLI 1.4.6            | 715ms (517 + 198)   | 132ms    | 128ms    | 592ms      |
| Rspack CLI (Lazy) 1.4.6     | 323ms🥇 (283 + 40)  | 110ms🥉  | 108ms🥉  | 590ms      |
| Rsbuild 1.4.6               | 595ms🥉 (438 + 157) | 104ms🥈  | 104ms🥈  | 526ms🥉    |
| Rsbuild (Lazy) 1.4.6        | 519ms🥈 (369 + 149) | 96ms🥇   | 101ms🥇  | 524ms🥈    |
| Vite (Rolldown + Oxc) 7.0.7 | 3298ms (93 + 3204)  | 150ms    | 145ms    | 353ms🥇    |
| Vite (Rollup + SWC) 7.0.4   | 3379ms (110 + 3269) | 161ms    | 140ms    | 1858ms     |
| webpack (SWC) 5.100.0       | 3091ms (2494 + 597) | 327ms    | 260ms    | 3272ms     |

#### Bundle sizes

| Name                        | Total size | Gzipped size |
| --------------------------- | ---------- | ------------ |
| Rspack CLI 1.4.6            | 839.0kB🥈  | 218.6kB      |
| Rspack CLI (Lazy) 1.4.6     | 839.0kB🥉  | 218.6kB      |
| Rsbuild 1.4.6               | 870.7kB    | 212.4kB🥇    |
| Rsbuild (Lazy) 1.4.6        | 870.7kB    | 212.4kB🥈    |
| Vite (Rolldown + Oxc) 7.0.7 | 839.8kB    | 230.8kB      |
| Vite (Rollup + SWC) 7.0.4   | 801.1kB🥇  | 216.3kB🥉    |
| webpack (SWC) 5.100.0       | 883.4kB    | 238.1kB      |

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

#### Build performance

| Name                        | Dev cold start        | Root HMR | Leaf HMR | Prod build |
| --------------------------- | --------------------- | -------- | -------- | ---------- |
| Rspack CLI 1.4.6            | 1450ms🥉 (1207 + 243) | 222ms    | 149ms    | 1285ms🥈   |
| Rspack CLI (Lazy) 1.4.6     | 401ms🥇 (346 + 55)    | 90ms🥇   | 92ms🥈   | 1353ms🥉   |
| Rsbuild 1.4.6               | 1479ms (1251 + 228)   | 206ms    | 156ms    | 1383ms     |
| Rsbuild (Lazy) 1.4.6        | 506ms🥈 (369 + 137)   | 100ms🥈  | 66ms🥇   | 1386ms     |
| Vite (Rolldown + Oxc) 7.0.7 | 2664ms (120 + 2543)   | 134ms🥉  | 109ms    | 842ms🥇    |
| Vite (Rollup + SWC) 7.0.4   | 2778ms (116 + 2661)   | 134ms    | 106ms🥉  | 4709ms     |
| webpack (SWC) 5.100.0       | 7461ms (6839 + 622)   | 763ms    | 730ms    | 8901ms     |

#### Bundle sizes

| Name                        | Total size | Gzipped size |
| --------------------------- | ---------- | ------------ |
| Rspack CLI 1.4.6            | 2846.4kB🥉 | 677.2kB🥇    |
| Rspack CLI (Lazy) 1.4.6     | 2846.4kB   | 677.2kB🥈    |
| Rsbuild 1.4.6               | 2877.4kB   | 678.5kB🥉    |
| Rsbuild (Lazy) 1.4.6        | 2877.4kB   | 678.5kB      |
| Vite (Rolldown + Oxc) 7.0.7 | 2718.1kB🥈 | 751.9kB      |
| Vite (Rollup + SWC) 7.0.4   | 2579.1kB🥇 | 688.5kB      |
| webpack (SWC) 5.100.0       | 2872.1kB   | 710.2kB      |

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

#### Build performance

| Name                        | Dev cold start         | Root HMR | Leaf HMR | Prod build |
| --------------------------- | ---------------------- | -------- | -------- | ---------- |
| Rspack CLI 1.4.6            | 2922ms🥉 (2608 + 313)  | 355ms    | 275ms    | 2554ms🥈   |
| Rspack CLI (Lazy) 1.4.6     | 398ms🥇 (346 + 52)     | 120ms🥈  | 103ms🥇  | 2577ms🥉   |
| Rsbuild 1.4.6               | 2979ms (2702 + 277)    | 360ms    | 258ms    | 2934ms     |
| Rsbuild (Lazy) 1.4.6        | 695ms🥈 (516 + 178)    | 113ms🥇  | 109ms🥈  | 2915ms     |
| Vite (Rolldown + Oxc) 7.0.7 | 4363ms (161 + 4202)    | 171ms🥉  | 141ms    | 1606ms🥇   |
| Vite (Rollup + SWC) 7.0.4   | 4773ms (167 + 4606)    | 174ms    | 135ms🥉  | 9433ms     |
| webpack (SWC) 5.100.0       | 13868ms (12842 + 1026) | 3321ms   | 2326ms   | 17815ms    |

#### Bundle sizes

| Name                        | Total size | Gzipped size |
| --------------------------- | ---------- | ------------ |
| Rspack CLI 1.4.6            | 5996.4kB   | 1367.2kB🥇   |
| Rspack CLI (Lazy) 1.4.6     | 5996.4kB   | 1367.2kB🥈   |
| Rsbuild 1.4.6               | 6054.6kB   | 1367.4kB🥉   |
| Rsbuild (Lazy) 1.4.6        | 6054.6kB   | 1367.4kB     |
| Vite (Rolldown + Oxc) 7.0.7 | 5675.8kB🥈 | 1546.6kB     |
| Vite (Rollup + SWC) 7.0.4   | 5369.0kB🥇 | 1409.2kB     |
| webpack (SWC) 5.100.0       | 5994.5kB🥉 | 1464.3kB     |

### ui-components

A React app that imports UI components from several popular UI libraries.

```bash
CASE=ui-components pnpm benchmark
```

#### Build performance

| Name                        | Prod build |
| --------------------------- | ---------- |
| Rspack CLI 1.4.6            | 2619ms🥉   |
| Rsbuild 1.4.6               | 2907ms     |
| Vite (Rollup + SWC) 7.0.4   | 9571ms     |
| Vite (Rolldown + Oxc) 7.0.7 | 1284ms🥈   |
| Rolldown 1.0.0-beta.25      | 1200ms🥇   |
| webpack (SWC) 5.100.0       | 21616ms    |

#### Bundle sizes

| Name                        | Total size | Gzipped size |
| --------------------------- | ---------- | ------------ |
| Rspack CLI 1.4.6            | 2210.3kB   | 621.7kB🥈    |
| Rsbuild 1.4.6               | 2021.9kB🥇 | 615.9kB🥇    |
| Vite (Rollup + SWC) 7.0.4   | 2037.5kB🥈 | 638.2kB      |
| Vite (Rolldown + Oxc) 7.0.7 | 2054.4kB🥉 | 636.3kB      |
| Rolldown 1.0.0-beta.25      | 2071.2kB   | 637.3kB      |
| webpack (SWC) 5.100.0       | 2072.9kB   | 624.9kB🥉    |

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

#### Build performance

| Name                   | Prod build |
| ---------------------- | ---------- |
| Rspack CLI 1.4.6       | 1848ms🥉   |
| Rsbuild 1.4.6          | 1777ms🥈   |
| Rolldown 1.0.0-beta.25 | 383ms🥇    |
| webpack (SWC) 5.100.0  | 11715ms    |

#### Bundle sizes

| Name                   | Total size | Gzipped size |
| ---------------------- | ---------- | ------------ |
| Rspack CLI 1.4.6       | 1009.3kB🥇 | 270.9kB🥇    |
| Rsbuild 1.4.6          | 1009.3kB🥈 | 270.9kB🥈    |
| Rolldown 1.0.0-beta.25 | 1016.4kB🥉 | 273.6kB      |
| webpack (SWC) 5.100.0  | 1023.3kB   | 272.0kB🥉    |

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
