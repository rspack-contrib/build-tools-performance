# Build Tools Comparison

Benchmark comparing JavaScript bundlers and build tools ([Rspack](https://github.com/web-infra-dev/rspack), [Rsbuild](https://github.com/web-infra-dev/rsbuild), [webpack](https://github.com/webpack/webpack), [Vite](https://github.com/vitejs/vite), [rolldown-vite](https://github.com/vitejs/rolldown-vite), [esbuild](https://github.com/evanw/esbuild), and [Farm](https://github.com/farm-fe/farm)) for dev server startup time, build performance and bundle size for applications with different module sizes.

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

## Results

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/16933081512 (2025-08-13)

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

| Name                        | Dev cold start | HMR     | Prod build | Total size | Gzipped size |
| --------------------------- | -------------- | ------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0-beta.0     | 466ms🥇        | 106ms🥈 | 598ms🥈    | 838.9kB🥉  | 218.5kB🥉    |
| Rsbuild 1.5.0-beta.1        | 714ms🥈        | 91ms🥇  | 726ms🥉    | 870.6kB    | 212.4kB🥇    |
| Vite (Rolldown + Oxc) 7.1.0 | 5057ms         | 133ms   | 503ms🥇    | 839.7kB    | 230.8kB      |
| Vite (Rollup + SWC) 7.1.1   | 3958ms         | 129ms🥉 | 2076ms     | 798.8kB🥇  | 215.7kB🥈    |
| webpack (SWC) 5.101.0       | 3506ms🥉       | 356ms   | 2867ms     | 836.0kB🥈  | 223.6kB      |

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

| Name                        | Dev cold start | HMR     | Prod build | Total size | Gzipped size |
| --------------------------- | -------------- | ------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0-beta.0     | 745ms🥇        | 84ms🥇  | 2230ms🥈   | 2846.4kB   | 677.1kB🥇    |
| Rsbuild 1.5.0-beta.1        | 1033ms🥈       | 101ms🥈 | 2370ms🥉   | 2877.4kB   | 678.4kB🥈    |
| Vite (Rolldown + Oxc) 7.1.0 | 5745ms         | 143ms   | 1821ms🥇   | 2718.0kB🥈 | 751.7kB      |
| Vite (Rollup + SWC) 7.1.1   | 5234ms🥉       | 102ms🥉 | 8645ms     | 2576.7kB🥇 | 687.7kB🥉    |
| webpack (SWC) 5.101.0       | 15324ms        | 2158ms  | 10635ms    | 2824.8kB🥉 | 695.8kB      |

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

| Name                        | Dev cold start | HMR     | Prod build | Total size | Gzipped size |
| --------------------------- | -------------- | ------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0-beta.0     | 632ms🥇        | 109ms🥈 | 2568ms🥈   | 5996.2kB   | 1367.0kB🥇   |
| Rsbuild 1.5.0-beta.1        | 717ms🥈        | 100ms🥇 | 3091ms🥉   | 6054.4kB   | 1367.2kB🥈   |
| Vite (Rolldown + Oxc) 7.1.0 | 5212ms🥉       | 148ms   | 1853ms🥇   | 5675.7kB🥈 | 1546.6kB     |
| Vite (Rollup + SWC) 7.1.1   | 5314ms         | 144ms🥉 | 10248ms    | 5366.6kB🥇 | 1408.3kB🥉   |
| webpack (SWC) 5.101.0       | 14392ms        | 3222ms  | 12003ms    | 5947.1kB🥉 | 1450.0kB     |

### ui-components

A React app that imports UI components from several popular UI libraries.

Including [@mui/material](https://npmjs.com/package/@mui/material), [antd](https://npmjs.com/package/antd), [@chakra-ui/react](https://npmjs.com/package/@chakra-ui/react), [@fluentui/react](https://npmjs.com/package/@fluentui/react), [@headlessui/react](https://npmjs.com/package/@headlessui/react), [@mantine/core](https://npmjs.com/package/@mantine/core), [react-bootstrap](https://npmjs.com/package/react-bootstrap), [element-plus](https://npmjs.com/package/element-plus), [vant](https://npmjs.com/package/vant), and [vuetify](https://npmjs.com/package/vuetify).

```bash
CASE=ui-components pnpm benchmark
```

| Name                        | Prod build | Total size | Gzipped size |
| --------------------------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0-beta.0     | 2541ms     | 2030.6kB🥈 | 618.3kB🥈    |
| Rsbuild 1.5.0-beta.1        | 2915ms     | 2028.5kB🥇 | 617.8kB🥇    |
| Vite (Rollup + SWC) 7.1.1   | 10602ms    | 2043.5kB   | 640.3kB      |
| Vite (Rolldown + Oxc) 7.1.0 | 1270ms🥈   | 2053.0kB   | 635.6kB      |
| Rolldown 1.0.0-beta.32      | 1187ms🥇   | 2067.6kB   | 636.1kB      |
| webpack (SWC) 5.101.0       | 12034ms    | 2030.6kB🥉 | 619.5kB🥉    |
| esbuild 0.25.8              | 1647ms🥉   | 2846.5kB   | 873.4kB      |
| Farm 1.7.11                 | 2313ms     | 3768.8kB   | 1312.5kB     |

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

| Name                    | Prod build | Total size | Gzipped size |
| ----------------------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0-beta.0 | 711ms      | 1009.3kB🥈 | 270.9kB🥈    |
| Rsbuild 1.5.0-beta.1    | 652ms🥉    | 1009.3kB🥉 | 271.0kB🥉    |
| Rolldown 1.0.0-beta.32  | 315ms🥈    | 1015.2kB   | 272.8kB      |
| webpack (SWC) 5.101.0   | 3142ms     | 1007.4kB🥇 | 270.6kB🥇    |
| esbuild 0.25.8          | 278ms🥇    | 1025.3kB   | 276.7kB      |

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
