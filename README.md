# Build Tools Comparison

Benchmark comparing JavaScript bundlers and build tools ([Rspack](https://github.com/web-infra-dev/rspack), [Rsbuild](https://github.com/web-infra-dev/rsbuild), [webpack](https://github.com/webpack/webpack), [Vite](https://github.com/vitejs/vite), [rolldown-vite](https://github.com/vitejs/rolldown-vite) and [Farm](https://github.com/farm-fe/farm)) for dev server startup time, build performance and bundle size for applications with different module sizes.

## Metrics

| Name             | Description                                     | Notes                                   |
| ---------------- | ----------------------------------------------- | --------------------------------------- |
| **Startup**      | Total time from dev server start to page loaded | Equals to server start + page load      |
| **Server start** | Time taken for the dev server to start          | Include initial build (except for Vite) |
| **Page load**    | Time to load the page after server is ready     |                                         |
| **Root HMR**     | Time to HMR after changing a root module        |                                         |
| **Leaf HMR**     | Time to HMR after changing a leaf module        |                                         |
| **Prod build**   | Time taken to build the production bundles      |                                         |
| **Total size**   | Total size of the bundle                        | Minified by the default minifier        |
| **Gzipped size** | Gzipped size of the bundle                      | Represents actual network transfer size |

## Bench cases

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/15697679057 (2025-06-17)

### Small app (2.5k modules)

1000 React components + 1500 modules in node_modules. (Most components are dynamic imported)

```bash
CASE=small pnpm benchmark
```

#### Build performance

| Name                           | Startup | Server start | Page load | Root HMR | Leaf HMR | Prod build |
| ------------------------------ | ------- | ------------ | --------- | -------- | -------- | ---------- |
| Rspack CLI 1.4.0-beta.1        | 811ms   | 606ms        | 205ms     | 129ms    | 123ms    | 678ms      |
| Rspack CLI (Lazy) 1.4.0-beta.1 | 345ms   | 302ms        | 43ms      | 115ms    | 108ms    | 679ms      |
| Rsbuild 1.4.0-beta.4           | 648ms   | 499ms        | 149ms     | 101ms    | 111ms    | 613ms      |
| Rsbuild (Lazy) 1.4.0-beta.4    | 704ms   | 231ms        | 473ms     | 110ms    | 94ms     | 616ms      |
| Vite (Rolldown) 6.3.18         | 3578ms  | 130ms        | 3447ms    | 169ms    | 138ms    | 598ms      |
| Vite (SWC) 6.3.5               | 3652ms  | 126ms        | 3526ms    | 177ms    | 140ms    | 2069ms     |
| webpack (SWC) 5.99.9           | 3169ms  | 2491ms       | 678ms     | 374ms    | 278ms    | 2784ms     |

#### Bundle size

| Name                           | Total size | Gzipped size |
| ------------------------------ | ---------- | ------------ |
| Rspack CLI 1.4.0-beta.1        | 839.1kB    | 218.5kB      |
| Rspack CLI (Lazy) 1.4.0-beta.1 | 839.1kB    | 218.5kB      |
| Rsbuild 1.4.0-beta.4           | 870.8kB    | 212.4kB      |
| Rsbuild (Lazy) 1.4.0-beta.4    | 870.8kB    | 212.4kB      |
| Vite (Rolldown) 6.3.18         | 878.8kB    | 245.9kB      |
| Vite (SWC) 6.3.5               | 801.4kB    | 216.4kB      |
| webpack (SWC) 5.99.9           | 882.1kB    | 237.3kB      |

### Medium app (10k modules)

5000 React components + 5000 modules in node_modules. (Most components are dynamic imported)

```bash
CASE=medium pnpm benchmark
```

#### Build performance

| Name                           | Startup | Server start | Page load | Root HMR | Leaf HMR | Prod build |
| ------------------------------ | ------- | ------------ | --------- | -------- | -------- | ---------- |
| Rspack CLI 1.4.0-beta.1        | 1507ms  | 1273ms       | 233ms     | 200ms    | 173ms    | 1338ms     |
| Rspack CLI (Lazy) 1.4.0-beta.1 | 374ms   | 336ms        | 38ms      | 87ms     | 87ms     | 1362ms     |
| Rsbuild 1.4.0-beta.4           | 1962ms  | 1718ms       | 244ms     | 210ms    | 167ms    | 1708ms     |
| Rsbuild (Lazy) 1.4.0-beta.4    | 337ms   | 178ms        | 158ms     | 93ms     | 91ms     | 1406ms     |
| Vite (Rolldown) 6.3.18         | 3080ms  | 172ms        | 2908ms    | 152ms    | 140ms    | 1345ms     |
| Vite (SWC) 6.3.5               | 3062ms  | 138ms        | 2924ms    | 123ms    | 63ms     | 5084ms     |
| webpack (SWC) 5.99.9           | 7642ms  | 6934ms       | 708ms     | 826ms    | 774ms    | 7289ms     |

#### Bundle size

| Name                           | Total size | Gzipped size |
| ------------------------------ | ---------- | ------------ |
| Rspack CLI 1.4.0-beta.1        | 2846.7kB   | 677.3kB      |
| Rspack CLI (Lazy) 1.4.0-beta.1 | 2846.7kB   | 677.3kB      |
| Rsbuild 1.4.0-beta.4           | 2877.7kB   | 678.7kB      |
| Rsbuild (Lazy) 1.4.0-beta.4    | 2877.7kB   | 678.7kB      |
| Vite (Rolldown) 6.3.18         | 2722.1kB   | 754.1kB      |
| Vite (SWC) 6.3.5               | 2579.4kB   | 688.7kB      |
| webpack (SWC) 5.99.9           | 2871.1kB   | 711.4kB      |

### Large app (20k modules)

10000 React components + 10000 modules in node_modules. (Most components are dynamic imported)

```bash
CASE=large pnpm benchmark
```

#### Build performance

| Name                           | Startup | Server start | Page load | Root HMR | Leaf HMR | Prod build |
| ------------------------------ | ------- | ------------ | --------- | -------- | -------- | ---------- |
| Rspack CLI 1.4.0-beta.1        | 2890ms  | 2556ms       | 333ms     | 363ms    | 272ms    | 2795ms     |
| Rspack CLI (Lazy) 1.4.0-beta.1 | 613ms   | 552ms        | 61ms      | 111ms    | 112ms    | 3950ms     |
| Rsbuild 1.4.0-beta.4           | 3407ms  | 3077ms       | 330ms     | 376ms    | 299ms    | 3044ms     |
| Rsbuild (Lazy) 1.4.0-beta.4    | 484ms   | 229ms        | 254ms     | 122ms    | 107ms    | 3247ms     |
| Vite (Rolldown) 6.3.18         | 4472ms  | 140ms        | 4332ms    | 166ms    | 142ms    | 2647ms     |
| Vite (SWC) 6.3.5               | 7824ms  | 247ms        | 7576ms    | 122ms    | 138ms    | 10801ms    |
| webpack (SWC) 5.99.9           | 16518ms | 15262ms      | 1256ms    | 4498ms   | 3506ms   | 13340ms    |

#### Bundle size

| Name                           | Total size | Gzipped size |
| ------------------------------ | ---------- | ------------ |
| Rspack CLI 1.4.0-beta.1        | 5996.5kB   | 1367.1kB     |
| Rspack CLI (Lazy) 1.4.0-beta.1 | 5996.5kB   | 1367.1kB     |
| Rsbuild 1.4.0-beta.4           | 6054.9kB   | 1367.4kB     |
| Rsbuild (Lazy) 1.4.0-beta.4    | 6054.9kB   | 1367.4kB     |
| Vite (Rolldown) 6.3.18         | 5679.8kB   | 1549.1kB     |
| Vite (SWC) 6.3.5               | 5369.2kB   | 1409.3kB     |
| webpack (SWC) 5.99.9           | 5993.4kB   | 1464.6kB     |

## Run locally

Run the `benchmark.mjs` script to get the results (requires Node.js >= 22):

```bash
# Run the benchmark for the medium case
pnpm benchmark

# Run the benchmark for the small case
CASE=small pnpm benchmark
```

If you want to start the project with the specified tool, try:

```bash
pnpm i # install dependencies

# Dev server
pnpm start:farm # Start Farm
pnpm start:rspack # Start Rspack
pnpm start:rsbuild # Start Rsbuild
pnpm start:vite # Start Vite
pnpm start:webpack # Start webpack

# Build
pnpm build:farm # Build Farm
pnpm build:rspack # Build Rspack
pnpm build:rsbuild # Build Rsbuild
pnpm build:vite # Build Vite
pnpm build:webpack # Build webpack
```

### Options

Use `CASE` to switch the benchmark case:

```bash
CASE=small pnpm benchmark
CASE=medium pnpm benchmark
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
