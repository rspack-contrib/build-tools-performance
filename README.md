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

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/16665265886 (2025-08-01)

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

| Name                         | Dev cold start | HMR     | Prod build | Total size | Gzipped size |
| ---------------------------- | -------------- | ------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.4.11            | 761ms          | 114ms   | 602ms      | 838.9kB🥉  | 218.5kB      |
| Rspack CLI (Lazy) 1.4.11     | 390ms🥇        | 102ms🥇 | 596ms      | 838.9kB    | 218.5kB      |
| Rsbuild 1.4.12               | 561ms🥉        | 106ms🥈 | 523ms🥈    | 870.6kB    | 212.3kB🥇    |
| Rsbuild (Lazy) 1.4.12        | 511ms🥈        | 106ms🥉 | 528ms🥉    | 870.6kB    | 212.3kB🥈    |
| Vite (Rolldown + Oxc) 7.0.12 | 3427ms         | 148ms   | 392ms🥇    | 839.6kB    | 230.7kB      |
| Vite (Rollup + SWC) 7.0.6    | 3442ms         | 131ms   | 1895ms     | 798.7kB🥇  | 215.7kB🥉    |
| webpack (SWC) 5.101.0        | 3047ms         | 307ms   | 2523ms     | 836.0kB🥈  | 224.2kB      |

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

| Name                         | Dev cold start | HMR     | Prod build | Total size | Gzipped size |
| ---------------------------- | -------------- | ------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.4.11            | 2700ms🥉       | 254ms   | 1967ms     | 2846.4kB   | 677.2kB🥇    |
| Rspack CLI (Lazy) 1.4.11     | 538ms🥇        | 68ms🥇  | 1870ms🥉   | 2846.4kB   | 677.2kB🥈    |
| Rsbuild 1.4.12               | 2831ms         | 229ms   | 1883ms     | 2877.3kB   | 678.4kB🥉    |
| Rsbuild (Lazy) 1.4.12        | 618ms🥈        | 68ms🥈  | 1864ms🥈   | 2877.3kB   | 678.4kB      |
| Vite (Rolldown + Oxc) 7.0.12 | 5243ms         | 106ms🥉 | 1499ms🥇   | 2718.0kB🥈 | 751.7kB      |
| Vite (Rollup + SWC) 7.0.6    | 5878ms         | 122ms   | 6673ms     | 2576.7kB🥇 | 687.7kB      |
| webpack (SWC) 5.101.0        | 10443ms        | 1774ms  | 9588ms     | 2824.7kB🥉 | 695.4kB      |

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

| Name                         | Dev cold start | HMR     | Prod build | Total size | Gzipped size |
| ---------------------------- | -------------- | ------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.4.11            | 6875ms🥉       | 924ms   | 6129ms     | 5996.3kB   | 1367.1kB🥇   |
| Rspack CLI (Lazy) 1.4.11     | 1548ms🥈       | 339ms   | 6042ms     | 5996.3kB   | 1367.1kB🥈   |
| Rsbuild 1.4.12               | 9176ms         | 702ms   | 5093ms🥈   | 6054.6kB   | 1367.3kB🥉   |
| Rsbuild (Lazy) 1.4.12        | 1517ms🥇       | 161ms🥉 | 6026ms🥉   | 6054.6kB   | 1367.3kB     |
| Vite (Rolldown + Oxc) 7.0.12 | 13444ms        | 130ms🥈 | 3299ms🥇   | 5675.7kB🥈 | 1546.6kB     |
| Vite (Rollup + SWC) 7.0.6    | 11575ms        | 122ms🥇 | 21748ms    | 5366.6kB🥇 | 1408.3kB     |
| webpack (SWC) 5.101.0        | 35630ms        | 9240ms  | 26044ms    | 5947.1kB🥉 | 1449.3kB     |

### ui-components

A React app that imports UI components from several popular UI libraries.
Including [@mui/material](https://npmjs.com/package/@mui/material), [antd](https://npmjs.com/package/antd), [@chakra-ui/react](https://npmjs.com/package/@chakra-ui/react), [@fluentui/react](https://npmjs.com/package/@fluentui/react), [@headlessui/react](https://npmjs.com/package/@headlessui/react), [@mantine/core](https://npmjs.com/package/@mantine/core), [react-bootstrap](https://npmjs.com/package/react-bootstrap), [element-plus](https://npmjs.com/package/element-plus), [vant](https://npmjs.com/package/vant), and [vuetify](https://npmjs.com/package/vuetify).

```bash
CASE=ui-components pnpm benchmark
```

| Name                         | Prod build | Total size | Gzipped size |
| ---------------------------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.4.11            | 4290ms     | 2027.9kB🥈 | 617.5kB🥈    |
| Rsbuild 1.4.12               | 4155ms     | 2025.9kB🥇 | 617.0kB🥇    |
| Vite (Rollup + SWC) 7.0.6    | 13491ms    | 2040.1kB   | 638.9kB      |
| Vite (Rolldown + Oxc) 7.0.12 | 1902ms🥈   | 2051.3kB   | 635.3kB      |
| Rolldown 1.0.0-beta.30       | 1609ms🥇   | 2065.8kB   | 635.9kB      |
| webpack (SWC) 5.101.0        | 16774ms    | 2028.0kB🥉 | 618.8kB🥉    |
| esbuild 0.25.8               | 2785ms🥉   | 2838.6kB   | 870.7kB      |
| Farm 1.7.10                  | 2940ms     | 3765.7kB   | 1312.6kB     |

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

| Name                   | Prod build | Total size | Gzipped size |
| ---------------------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.4.11      | 1640ms     | 1009.3kB🥈 | 270.9kB🥈    |
| Rsbuild 1.4.12         | 1389ms🥉   | 1009.3kB🥉 | 271.0kB🥉    |
| Rolldown 1.0.0-beta.30 | 550ms🥈    | 1016.3kB   | 273.6kB      |
| webpack (SWC) 5.101.0  | 5279ms     | 1007.4kB🥇 | 270.6kB🥇    |
| esbuild 0.25.8         | 398ms🥇    | 1025.3kB   | 276.7kB      |

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
