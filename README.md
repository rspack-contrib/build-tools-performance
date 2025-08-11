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

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/16882999686 (2025-08-11)

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

| Name                           | Dev cold start | HMR     | Prod build | Total size | Gzipped size |
| ------------------------------ | -------------- | ------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0-beta.0        | 793ms          | 123ms   | 591ms      | 838.9kB🥉  | 218.5kB      |
| Rspack CLI (Lazy) 1.5.0-beta.0 | 435ms🥇        | 89ms🥇  | 573ms      | 838.9kB    | 218.5kB      |
| Rsbuild 1.5.0-beta.0           | 552ms🥈        | 102ms🥉 | 464ms🥈    | 870.6kB    | 212.4kB🥇    |
| Rsbuild (Lazy) 1.5.0-beta.0    | 599ms🥉        | 95ms🥈  | 472ms🥉    | 870.6kB    | 212.4kB🥈    |
| Vite (Rolldown + Oxc) 7.1.0    | 4123ms         | 158ms   | 385ms🥇    | 839.7kB    | 230.8kB      |
| Vite (Rollup + SWC) 7.1.1      | 3532ms         | 152ms   | 1842ms     | 798.8kB🥇  | 215.7kB🥉    |
| webpack (SWC) 5.101.0          | 3107ms         | 303ms   | 2467ms     | 836.0kB🥈  | 223.6kB      |

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

| Name                           | Dev cold start | HMR     | Prod build | Total size | Gzipped size |
| ------------------------------ | -------------- | ------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0-beta.0        | 1881ms🥉       | 202ms   | 1465ms🥈   | 2846.4kB   | 677.1kB🥇    |
| Rspack CLI (Lazy) 1.5.0-beta.0 | 721ms🥇        | 93ms🥇  | 1622ms     | 2846.4kB   | 677.1kB🥈    |
| Rsbuild 1.5.0-beta.0           | 1948ms         | 199ms   | 1638ms     | 2877.4kB   | 678.4kB🥉    |
| Rsbuild (Lazy) 1.5.0-beta.0    | 773ms🥈        | 101ms🥉 | 1534ms🥉   | 2877.4kB   | 678.4kB      |
| Vite (Rolldown + Oxc) 7.1.0    | 4227ms         | 120ms   | 1105ms🥇   | 2718.0kB🥈 | 751.7kB      |
| Vite (Rollup + SWC) 7.1.1      | 4041ms         | 99ms🥈  | 5972ms     | 2576.7kB🥇 | 687.7kB      |
| webpack (SWC) 5.101.0          | 11502ms        | 1067ms  | 7268ms     | 2824.8kB🥉 | 695.8kB      |

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

| Name                           | Dev cold start | HMR     | Prod build | Total size | Gzipped size |
| ------------------------------ | -------------- | ------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0-beta.0        | 4401ms         | 432ms   | 2971ms🥉   | 5996.2kB   | 1367.0kB🥇   |
| Rspack CLI (Lazy) 1.5.0-beta.0 | 524ms🥇        | 103ms🥈 | 2734ms🥈   | 5996.2kB   | 1367.0kB🥈   |
| Rsbuild 1.5.0-beta.0           | 3792ms🥉       | 417ms   | 3603ms     | 6054.4kB   | 1367.2kB🥉   |
| Rsbuild (Lazy) 1.5.0-beta.0    | 741ms🥈        | 98ms🥇  | 3389ms     | 6054.4kB   | 1367.2kB     |
| Vite (Rolldown + Oxc) 7.1.0    | 6101ms         | 148ms   | 2117ms🥇   | 5675.7kB🥈 | 1546.6kB     |
| Vite (Rollup + SWC) 7.1.1      | 4828ms         | 140ms🥉 | 9669ms     | 5366.6kB🥇 | 1408.3kB     |
| webpack (SWC) 5.101.0          | 16865ms        | 3651ms  | 13413ms    | 5947.1kB🥉 | 1450.0kB     |

### ui-components

A React app that imports UI components from several popular UI libraries.

Including [@mui/material](https://npmjs.com/package/@mui/material), [antd](https://npmjs.com/package/antd), [@chakra-ui/react](https://npmjs.com/package/@chakra-ui/react), [@fluentui/react](https://npmjs.com/package/@fluentui/react), [@headlessui/react](https://npmjs.com/package/@headlessui/react), [@mantine/core](https://npmjs.com/package/@mantine/core), [react-bootstrap](https://npmjs.com/package/react-bootstrap), [element-plus](https://npmjs.com/package/element-plus), [vant](https://npmjs.com/package/vant), and [vuetify](https://npmjs.com/package/vuetify).

```bash
CASE=ui-components pnpm benchmark
```

| Name                        | Prod build | Total size | Gzipped size |
| --------------------------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0-beta.0     | 4871ms     | 2030.6kB🥈 | 618.3kB🥈    |
| Rsbuild 1.5.0-beta.0        | 5450ms     | 2028.5kB🥇 | 617.8kB🥇    |
| Vite (Rollup + SWC) 7.1.1   | 19229ms    | 2043.5kB   | 640.3kB      |
| Vite (Rolldown + Oxc) 7.1.0 | 2668ms🥇   | 2053.0kB   | 635.6kB      |
| Rolldown 1.0.0-beta.32      | 2885ms🥈   | 2067.6kB   | 636.1kB      |
| webpack (SWC) 5.101.0       | 20034ms    | 2030.6kB🥉 | 619.5kB🥉    |
| esbuild 0.25.8              | 3159ms🥉   | 2846.5kB   | 873.4kB      |
| Farm 1.7.11                 | 3711ms     | 3768.8kB   | 1312.5kB     |

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

| Name                    | Prod build | Total size | Gzipped size |
| ----------------------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.5.0-beta.0 | 1156ms     | 1009.3kB🥈 | 270.9kB🥈    |
| Rsbuild 1.5.0-beta.0    | 1048ms🥉   | 1009.3kB🥉 | 271.0kB🥉    |
| Rolldown 1.0.0-beta.32  | 580ms🥈    | 1015.2kB   | 272.8kB      |
| webpack (SWC) 5.101.0   | 4332ms     | 1007.4kB🥇 | 270.6kB🥇    |
| esbuild 0.25.8          | 340ms🥇    | 1025.3kB   | 276.7kB      |

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
