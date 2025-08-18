# Build Tools Comparison

Benchmark comparing JavaScript bundlers and build tools ([Rspack](https://github.com/web-infra-dev/rspack), [Rsbuild](https://github.com/web-infra-dev/rsbuild), [webpack](https://github.com/webpack/webpack), [Vite](https://github.com/vitejs/vite), [rolldown-vite](https://github.com/vitejs/rolldown-vite), [esbuild](https://github.com/evanw/esbuild), [Parcel](https://github.com/parcel-bundler/parcel) and [Farm](https://github.com/farm-fe/farm)) for dev server startup time, build performance and bundle size for applications with different module sizes.

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
- Benchmarks run on GitHub Actions with variable hardware, which may cause inconsistent results.

## Results

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/17037012122 (2025-08-18)

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

| Name                        | Dev cold start | HMR     | Prod build | Total size | Gzipped size |
| --------------------------- | -------------- | ------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0-beta.0     | 944ms🥈        | 136ms   | 1059ms🥉   | 839.0kB    | 218.6kB      |
| Rsbuild 1.5.0-beta.3        | 833ms🥇        | 88ms🥈  | 812ms🥈    | 870.7kB    | 212.4kB🥇    |
| Vite (Rolldown + Oxc) 7.1.3 | 7150ms         | 100ms🥉 | 798ms🥇    | 814.5kB🥈  | 215.1kB🥈    |
| Vite (Rollup + SWC) 7.1.2   | 7643ms         | 45ms🥇  | 2638ms     | 798.9kB🥇  | 215.8kB🥉    |
| webpack (SWC) 5.101.2       | 5983ms         | 420ms   | 4027ms     | 836.1kB🥉  | 223.4kB      |
| Farm 1.7.11                 | 1498ms🥉       | 133ms   | 2405ms     | 1077.8kB   | 256.1kB      |
| Parcel 2.15.4               | 5183ms         | 138ms   | 4668ms     | 954.7kB    | 228.1kB      |

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

| Name                        | Dev cold start | HMR     | Prod build | Total size | Gzipped size |
| --------------------------- | -------------- | ------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0-beta.0     | 350ms🥇        | 72ms🥇  | 1167ms🥉   | 2846.5kB   | 677.2kB🥇    |
| Rsbuild 1.5.0-beta.3        | 402ms🥈        | 90ms🥈  | 1139ms🥈   | 2877.5kB   | 678.5kB🥈    |
| Vite (Rolldown + Oxc) 7.1.3 | 2550ms         | 128ms🥉 | 670ms🥇    | 2627.8kB🥈 | 690.3kB      |
| Vite (Rollup + SWC) 7.1.2   | 3101ms         | 144ms   | 4605ms     | 2576.8kB🥇 | 687.8kB🥉    |
| webpack (SWC) 5.101.2       | 7506ms         | 702ms   | 5577ms     | 2824.9kB🥉 | 695.8kB      |
| Farm 1.7.11                 | 769ms🥉        | 157ms   | 3639ms     | 3533.2kB   | 806.1kB      |
| Parcel 2.15.4               | 8122ms         | 209ms   | 8367ms     | 3478.1kB   | 762.9kB      |

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

| Name                        | Dev cold start | HMR     | Prod build | Total size | Gzipped size |
| --------------------------- | -------------- | ------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0-beta.0     | 1066ms🥇       | 284ms   | 8290ms🥉   | 5996.3kB   | 1367.0kB🥇   |
| Rsbuild 1.5.0-beta.3        | 1297ms🥈       | 147ms🥉 | 7423ms🥈   | 6054.6kB   | 1367.3kB🥈   |
| Vite (Rolldown + Oxc) 7.1.3 | 10060ms🥉      | 73ms🥈  | 2978ms🥇   | 5472.6kB🥈 | 1415.1kB     |
| Vite (Rollup + SWC) 7.1.2   | 11283ms        | 70ms🥇  | 17572ms    | 5366.7kB🥇 | 1408.4kB🥉   |
| webpack (SWC) 5.101.2       | 29268ms        | 7307ms  | 23157ms    | 5947.2kB🥉 | 1449.4kB     |

### ui-components

A React app that imports UI components from several popular UI libraries.

Including [@mui/material](https://npmjs.com/package/@mui/material), [antd](https://npmjs.com/package/antd), [@chakra-ui/react](https://npmjs.com/package/@chakra-ui/react), [@fluentui/react](https://npmjs.com/package/@fluentui/react), [@headlessui/react](https://npmjs.com/package/@headlessui/react), [@mantine/core](https://npmjs.com/package/@mantine/core), [react-bootstrap](https://npmjs.com/package/react-bootstrap), [element-plus](https://npmjs.com/package/element-plus), [vant](https://npmjs.com/package/vant), and [vuetify](https://npmjs.com/package/vuetify).

```bash
CASE=ui-components pnpm benchmark
```

| Name                        | Prod build | Total size | Gzipped size |
| --------------------------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0-beta.0     | 2164ms     | 2035.6kB🥈 | 620.1kB🥈    |
| Rsbuild 1.5.0-beta.3        | 2158ms     | 2033.5kB🥇 | 619.5kB🥇    |
| Vite (Rollup + SWC) 7.1.2   | 10373ms    | 2048.8kB   | 641.9kB      |
| Vite (Rolldown + Oxc) 7.1.3 | 1556ms🥈   | 2047.6kB   | 631.6kB      |
| Rolldown 1.0.0-beta.33      | 1278ms🥇   | 2062.1kB   | 632.1kB      |
| webpack (SWC) 5.101.2       | 12257ms    | 2035.6kB🥉 | 621.3kB🥉    |
| esbuild 0.25.9              | 1712ms🥉   | 2852.7kB   | 875.3kB      |
| Farm 1.7.11                 | 6773ms     | 3776.2kB   | 1314.3kB     |
| Parcel 2.15.4               | 11868ms    | 2071.4kB   | 628.4kB      |

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

| Name                    | Prod build | Total size | Gzipped size |
| ----------------------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0-beta.0 | 877ms      | 1009.3kB🥈 | 270.9kB🥈    |
| Rsbuild 1.5.0-beta.3    | 768ms🥉    | 1009.3kB🥉 | 271.0kB🥉    |
| Rolldown 1.0.0-beta.33  | 340ms🥈    | 1015.1kB   | 272.7kB      |
| webpack (SWC) 5.101.2   | 2949ms     | 1007.4kB🥇 | 270.6kB🥇    |
| esbuild 0.25.9          | 226ms🥇    | 1025.3kB   | 276.7kB      |

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
