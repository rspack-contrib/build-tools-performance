# Build Tools Comparison

Benchmark comparing JavaScript bundlers and build tools ([Rspack](https://github.com/web-infra-dev/rspack), [Rsbuild](https://github.com/web-infra-dev/rsbuild), [webpack](https://github.com/webpack/webpack), [Vite](https://github.com/vitejs/vite) and [Farm](https://github.com/farm-fe/farm)) for dev server startup time, build performance and bundle size for applications with different module sizes.

## Bench cases

### 2.5k modules

1000 React components + 1500 modules in node_modules.

```bash
pnpm benchmark small
```

![image](https://github.com/user-attachments/assets/87798e21-e344-477b-acf5-ce6e4a6490eb)

### 10k modules

5000 React components + 5000 modules in node_modules.

```bash
pnpm benchmark medium
```

![image](https://github.com/user-attachments/assets/22428a44-3572-4ddb-9161-66899be33dd8)

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

Use `RUN_TIMES` to specify the number of runs (defaults to `5`):

```bash
RUN_TIMES=3 pnpm benchmark
```

Use `WARMUP_TIMES` to specify the number of warmup runs (defaults to `1`):

```bash
WARMUP_TIMES=2 pnpm benchmark
```

Use `FARM=true` to run Farm:

```bash
FARM=true pnpm benchmark
```

## Credits

Forked from [farm-fe/performance-compare](https://github.com/farm-fe/performance-compare), thanks to the Farm team!
