# Build Tools Comparison

Benchmark comparing JavaScript bundlers and build tools ([Rspack](https://github.com/web-infra-dev/rspack), [Rsbuild](https://github.com/web-infra-dev/rsbuild), [webpack](https://github.com/webpack/webpack), [Vite](https://github.com/vitejs/vite) and [Farm](https://github.com/farm-fe/farm)) for dev server startup time, build performance and bundle size for applications with different module sizes.

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

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/14692853785

### Small app (2.5k modules)

1000 React components + 1500 modules in node_modules. (Most components are dynamic imported)

```bash
pnpm benchmark small
```

#### Build performance

| Name                    | Startup | Server start | Page load | Root HMR | Leaf HMR | Prod build |
| ----------------------- | ------- | ------------ | --------- | -------- | -------- | ---------- |
| Rspack CLI 1.3.6        | 759ms   | 554ms        | 205ms     | 122ms    | 110ms    | 727ms      |
| Rspack CLI (Lazy) 1.3.6 | 353ms   | 304ms        | 48ms      | 106ms    | 103ms    | 848ms      |
| Rsbuild 1.3.11          | 623ms   | 472ms        | 151ms     | 114ms    | 109ms    | 580ms      |
| Rsbuild (Lazy) 1.3.11   | 217ms   | 179ms        | 38ms      | 112ms    | 113ms    | 585ms      |
| Vite (SWC) 6.3.3        | 3533ms  | 95ms         | 3438ms    | 176ms    | 140ms    | 1925ms     |
| webpack (SWC) 5.99.6    | 3176ms  | 2585ms       | 591ms     | 352ms    | 272ms    | 2802ms     |

#### Bundle size

| Name                    | Total size | Gzipped size |
| ----------------------- | ---------- | ------------ |
| Rspack CLI 1.3.6        | 913.8kB    | 231.3kB      |
| Rspack CLI (Lazy) 1.3.6 | 913.8kB    | 231.3kB      |
| Rsbuild 1.3.11          | 910.7kB    | 214.0kB      |
| Rsbuild (Lazy) 1.3.11   | 910.7kB    | 214.0kB      |
| Vite (SWC) 6.3.3        | 837.8kB    | 216.9kB      |
| webpack (SWC) 5.99.6    | 910.4kB    | 234.9kB      |

### Medium app (10k modules)

5000 React components + 5000 modules in node_modules. (Most components are dynamic imported)

```bash
pnpm benchmark medium
```

#### Build performance

| Name                    | Startup | Server start | Page load | Root HMR | Leaf HMR | Prod build |
| ----------------------- | ------- | ------------ | --------- | -------- | -------- | ---------- |
| Rspack CLI 1.3.6        | 1460ms  | 1188ms       | 271ms     | 200ms    | 152ms    | 1323ms     |
| Rspack CLI (Lazy) 1.3.6 | 367ms   | 329ms        | 38ms      | 89ms     | 86ms     | 1305ms     |
| Rsbuild 1.3.11          | 1460ms  | 1251ms       | 208ms     | 183ms    | 171ms    | 1389ms     |
| Rsbuild (Lazy) 1.3.11   | 333ms   | 173ms        | 160ms     | 86ms     | 90ms     | 1306ms     |
| Vite (SWC) 6.3.3        | 2983ms  | 138ms        | 2845ms    | 136ms    | 146ms    | 4977ms     |
| webpack (SWC) 5.99.6    | 7291ms  | 6646ms       | 645ms     | 772ms    | 679ms    | 5773ms     |

#### Bundle size

| Name                    | Total size | Gzipped size |
| ----------------------- | ---------- | ------------ |
| Rspack CLI 1.3.6        | 2884.9kB   | 689.6kB      |
| Rspack CLI (Lazy) 1.3.6 | 2884.9kB   | 689.6kB      |
| Rsbuild 1.3.11          | 2881.0kB   | 679.8kB      |
| Rsbuild (Lazy) 1.3.11   | 2881.0kB   | 679.8kB      |
| Vite (SWC) 6.3.3        | 2579.3kB   | 688.6kB      |
| webpack (SWC) 5.99.6    | 2862.9kB   | 708.8kB      |

### Large app (20k modules)

10000 React components + 10000 modules in node_modules. (Most components are dynamic imported)

```bash
pnpm benchmark large
```

#### Build performance

| Name                    | Startup | Server start | Page load | Root HMR | Leaf HMR | Prod build |
| ----------------------- | ------- | ------------ | --------- | -------- | -------- | ---------- |
| Rspack CLI 1.3.6        | 2865ms  | 2417ms       | 447ms     | 319ms    | 271ms    | 2737ms     |
| Rspack CLI (Lazy) 1.3.6 | 481ms   | 426ms        | 55ms      | 92ms     | 98ms     | 2666ms     |
| Rsbuild 1.3.11          | 2883ms  | 2506ms       | 377ms     | 334ms    | 301ms    | 2946ms     |
| Rsbuild (Lazy) 1.3.11   | 500ms   | 257ms        | 243ms     | 127ms    | 107ms    | 2987ms     |
| Vite (SWC) 6.3.3        | 5077ms  | 177ms        | 4900ms    | 172ms    | 142ms    | 9653ms     |
| webpack (SWC) 5.99.6    | 13344ms | 12380ms      | 964ms     | 3449ms   | 2452ms   | 11438ms    |

#### Bundle size

| Name                    | Total size | Gzipped size |
| ----------------------- | ---------- | ------------ |
| Rspack CLI 1.3.6        | 6034.7kB   | 1379.4kB     |
| Rspack CLI (Lazy) 1.3.6 | 6034.7kB   | 1379.4kB     |
| Rsbuild 1.3.11          | 6058.2kB   | 1368.5kB     |
| Rsbuild (Lazy) 1.3.11   | 6058.2kB   | 1368.5kB     |
| Vite (SWC) 6.3.3        | 5369.1kB   | 1409.2kB     |
| webpack (SWC) 5.99.6    | 5985.2kB   | 1462.0kB     |

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
