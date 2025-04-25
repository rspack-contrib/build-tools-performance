# Build Tools Comparison

Benchmark comparing JavaScript bundlers and build tools (Rspack, Rsbuild, webpack, Vite and Farm)
for dev server startup time, build performance and bundle size for applications with different module sizes.

## Result

### 2.5k modules

1000 components + 1500 modules in node_modules.

```bash
pnpm benchmark small
```

![image](https://github.com/user-attachments/assets/87798e21-e344-477b-acf5-ce6e4a6490eb)

### 10k modules

5000 components + 5000 modules in node_modules.

```bash
pnpm benchmark medium
```

![image](https://github.com/user-attachments/assets/22428a44-3572-4ddb-9161-66899be33dd8)

## Run locally

Run the `benchmark.mjs` script to get the results (requires Node.js >= 22):

```bash
node benchmark.mjs
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

## Credits

Forked from [farm-fe/performance-compare](https://github.com/farm-fe/performance-compare), thanks to the Farm team!
