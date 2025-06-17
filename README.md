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

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/15484991136

### Small app (2.5k modules)

1000 React components + 1500 modules in node_modules. (Most components are dynamic imported)

```bash
CASE=small pnpm benchmark
```

#### Build performance

| Name                        | Startup | Server start | Page load | Root HMR | Leaf HMR | Prod build |
| --------------------------- | ------- | ------------ | --------- | -------- | -------- | ---------- |
| Rspack CLI 1.3.15           | 2346ms  | 1835ms       | 511ms     | 230ms    | 167ms    | 1584ms     |
| Rspack CLI (Lazy) 1.3.15    | 764ms   | 657ms        | 106ms     | 165ms    | 136ms    | 1543ms     |
| Rsbuild 1.4.0-beta.2        | 1443ms  | 1060ms       | 383ms     | 192ms    | 156ms    | 1240ms     |
| Rsbuild (Lazy) 1.4.0-beta.2 | 567ms   | 456ms        | 110ms     | 346ms    | 138ms    | 1341ms     |
| Vite (SWC) 6.3.5            | 8627ms  | 348ms        | 8278ms    | 90ms     | 103ms    | 3862ms     |
| Vite (Rolldown) 6.3.18      | 9584ms  | 325ms        | 9259ms    | 160ms    | 147ms    | 1307ms     |
| webpack (SWC) 5.99.9        | 6796ms  | 5632ms       | 1164ms    | 674ms    | 486ms    | 6194ms     |

#### Bundle size

| Name                        | Total size | Gzipped size |
| --------------------------- | ---------- | ------------ |
| Rspack CLI 1.3.15           | 922.0kB    | 233.8kB      |
| Rspack CLI (Lazy) 1.3.15    | 922.0kB    | 233.8kB      |
| Rsbuild 1.4.0-beta.2        | 910.9kB    | 214.1kB      |
| Rsbuild (Lazy) 1.4.0-beta.2 | 910.9kB    | 214.1kB      |
| Vite (SWC) 6.3.5            | 837.9kB    | 216.9kB      |
| Vite (Rolldown) 6.3.18      | 915.3kB    | 246.4kB      |
| webpack (SWC) 5.99.9        | 918.5kB    | 237.8kB      |

### Medium app (10k modules)

5000 React components + 5000 modules in node_modules. (Most components are dynamic imported)

```bash
CASE=medium pnpm benchmark
```

#### Build performance

| Name                        | Startup | Server start | Page load | Root HMR | Leaf HMR | Prod build |
| --------------------------- | ------- | ------------ | --------- | -------- | -------- | ---------- |
| Rspack CLI 1.3.15           | 2444ms  | 2060ms       | 384ms     | 273ms    | 220ms    | 2233ms     |
| Rspack CLI (Lazy) 1.3.15    | 796ms   | 721ms        | 74ms      | 86ms     | 87ms     | 2411ms     |
| Rsbuild 1.4.0-beta.2        | 2009ms  | 1733ms       | 276ms     | 282ms    | 220ms    | 2095ms     |
| Rsbuild (Lazy) 1.4.0-beta.2 | 657ms   | 411ms        | 246ms     | 84ms     | 73ms     | 2088ms     |
| Vite (SWC) 6.3.5            | 5399ms  | 236ms        | 5163ms    | 124ms    | 102ms    | 7278ms     |
| Vite (Rolldown) 6.3.18      | 4512ms  | 311ms        | 4201ms    | 121ms    | 67ms     | 2042ms     |
| webpack (SWC) 5.99.9        | 10643ms | 9697ms       | 946ms     | 1890ms   | 1201ms   | 9794ms     |

#### Bundle size

| Name                        | Total size | Gzipped size |
| --------------------------- | ---------- | ------------ |
| Rspack CLI 1.3.15           | 2893.1kB   | 692.2kB      |
| Rspack CLI (Lazy) 1.3.15    | 2893.1kB   | 692.2kB      |
| Rsbuild 1.4.0-beta.2        | 2881.2kB   | 679.9kB      |
| Rsbuild (Lazy) 1.4.0-beta.2 | 2881.2kB   | 679.9kB      |
| Vite (SWC) 6.3.5            | 2579.4kB   | 688.7kB      |
| Vite (Rolldown) 6.3.18      | 2722.1kB   | 754.1kB      |
| webpack (SWC) 5.99.9        | 2871.0kB   | 711.3kB      |

### Large app (20k modules)

10000 React components + 10000 modules in node_modules. (Most components are dynamic imported)

```bash
CASE=large pnpm benchmark
```

#### Build performance

| Name                        | Startup | Server start | Page load | Root HMR | Leaf HMR | Prod build |
| --------------------------- | ------- | ------------ | --------- | -------- | -------- | ---------- |
| Rspack CLI 1.3.15           | 3044ms  | 2655ms       | 388ms     | 363ms    | 287ms    | 2975ms     |
| Rspack CLI (Lazy) 1.3.15    | 475ms   | 422ms        | 52ms      | 95ms     | 103ms    | 2743ms     |
| Rsbuild 1.4.0-beta.2        | 2773ms  | 2527ms       | 246ms     | 406ms    | 316ms    | 2963ms     |
| Rsbuild (Lazy) 1.4.0-beta.2 | 256ms   | 208ms        | 47ms      | 112ms    | 101ms    | 2987ms     |
| Vite (SWC) 6.3.5            | 5502ms  | 182ms        | 5320ms    | 168ms    | 143ms    | 9918ms     |
| Vite (Rolldown) 6.3.18      | 4799ms  | 165ms        | 4634ms    | 169ms    | 139ms    | 2868ms     |
| webpack (SWC) 5.99.9        | 13639ms | 12693ms      | 946ms     | 3528ms   | 2531ms   | 11443ms    |

#### Bundle size

| Name                        | Total size | Gzipped size |
| --------------------------- | ---------- | ------------ |
| Rspack CLI 1.3.15           | 6043.0kB   | 1381.9kB     |
| Rspack CLI (Lazy) 1.3.15    | 6043.0kB   | 1381.9kB     |
| Rsbuild 1.4.0-beta.2        | 6058.4kB   | 1368.6kB     |
| Rsbuild (Lazy) 1.4.0-beta.2 | 6058.4kB   | 1368.6kB     |
| Vite (SWC) 6.3.5            | 5369.2kB   | 1409.3kB     |
| Vite (Rolldown) 6.3.18      | 5679.8kB   | 1549.1kB     |
| webpack (SWC) 5.99.9        | 5993.3kB   | 1464.5kB     |

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
