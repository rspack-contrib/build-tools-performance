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

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/17240447887 (2025-08-26)

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

| Name                        | Dev cold start | HMR     | Prod build | Total size | Gzipped size |
| --------------------------- | -------------- | ------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0            | 497ms🥇        | 86ms🥇  | 649ms🥉    | 839.1kB🥉  | 218.6kB🥉    |
| Rsbuild 1.5.0               | 616ms🥈        | 100ms🥈 | 565ms🥈    | 870.8kB    | 212.5kB🥇    |
| Vite (Rolldown + Oxc) 7.1.5 | 4023ms         | 135ms🥉 | 434ms🥇    | 839.6kB    | 230.7kB      |
| Vite (Rollup + SWC) 7.1.3   | 4615ms         | 141ms   | 2354ms     | 799.0kB🥇  | 215.8kB🥈    |
| webpack (SWC) 5.101.3       | 3356ms         | 308ms   | 2676ms     | 836.2kB🥈  | 223.4kB      |
| Farm 1.7.11                 | 1220ms🥉       | 163ms   | 1610ms     | 1077.9kB   | 256.1kB      |
| Parcel 2.15.4               | 2947ms         | 147ms   | 3435ms     | 954.8kB    | 228.1kB      |

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

| Name                        | Dev cold start | HMR    | Prod build | Total size | Gzipped size |
| --------------------------- | -------------- | ------ | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0            | 609ms🥇        | 90ms🥉 | 1467ms🥈   | 2846.6kB   | 677.2kB🥇    |
| Rsbuild 1.5.0               | 724ms🥈        | 94ms   | 1672ms🥉   | 2877.6kB   | 678.5kB🥈    |
| Vite (Rolldown + Oxc) 7.1.5 | 4124ms         | 74ms🥇 | 1149ms🥇   | 2717.9kB🥈 | 751.7kB      |
| Vite (Rollup + SWC) 7.1.3   | 3496ms         | 80ms🥈 | 5243ms     | 2577.0kB🥇 | 687.8kB🥉    |
| webpack (SWC) 5.101.3       | 9624ms         | 1018ms | 7952ms     | 2825.0kB🥉 | 695.1kB      |
| Farm 1.7.11                 | 1085ms🥉       | 159ms  | 4996ms     | 3533.3kB   | 806.2kB      |
| Parcel 2.15.4               | 9627ms         | 223ms  | 10141ms    | 3478.2kB   | 762.9kB      |

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

| Name                        | Dev cold start | HMR     | Prod build | Total size | Gzipped size |
| --------------------------- | -------------- | ------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0            | 1038ms🥇       | 130ms   | 4045ms🥈   | 5996.4kB   | 1367.1kB🥇   |
| Rsbuild 1.5.0               | 1158ms🥈       | 124ms🥉 | 4178ms🥉   | 6054.7kB   | 1367.3kB🥈   |
| Vite (Rolldown + Oxc) 7.1.5 | 8787ms🥉       | 113ms🥈 | 2670ms🥇   | 5675.6kB🥈 | 1546.6kB     |
| Vite (Rollup + SWC) 7.1.3   | 9094ms         | 81ms🥇  | 14022ms    | 5366.8kB🥇 | 1408.4kB🥉   |
| webpack (SWC) 5.101.3       | 24739ms        | 6180ms  | 20450ms    | 5947.3kB🥉 | 1450.1kB     |

### ui-components

A React app that imports UI components from several popular UI libraries.

Including [@mui/material](https://npmjs.com/package/@mui/material), [antd](https://npmjs.com/package/antd), [@chakra-ui/react](https://npmjs.com/package/@chakra-ui/react), [@fluentui/react](https://npmjs.com/package/@fluentui/react), [@headlessui/react](https://npmjs.com/package/@headlessui/react), [@mantine/core](https://npmjs.com/package/@mantine/core), [react-bootstrap](https://npmjs.com/package/react-bootstrap), [element-plus](https://npmjs.com/package/element-plus), [vant](https://npmjs.com/package/vant), and [vuetify](https://npmjs.com/package/vuetify).

```bash
CASE=ui-components pnpm benchmark
```

| Name                        | Prod build | Total size | Gzipped size |
| --------------------------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0            | 2871ms     | 2048.0kB🥈 | 624.8kB🥈    |
| Rsbuild 1.5.0               | 4221ms     | 2045.9kB🥇 | 624.3kB🥇    |
| Vite (Rollup + SWC) 7.1.3   | 11703ms    | 2061.9kB   | 646.9kB      |
| Vite (Rolldown + Oxc) 7.1.5 | 1474ms🥈   | 2067.4kB   | 640.9kB      |
| Rolldown 1.0.0-beta.34      | 1371ms🥇   | 2082.1kB   | 641.4kB      |
| webpack (SWC) 5.101.3       | 13167ms    | 2048.0kB🥉 | 625.9kB🥉    |
| esbuild 0.25.9              | 2010ms🥉   | 2875.7kB   | 882.6kB      |
| Farm 1.7.11                 | 6613ms     | 3790.2kB   | 1317.9kB     |
| Parcel 2.15.4               | 13263ms    | 2083.9kB   | 633.2kB      |

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
