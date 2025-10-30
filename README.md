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

> Data from GitHub Actions: https://github.com/rspack-contrib/build-tools-performance/actions/runs/18938818240 (2025-10-30)

### react-1k

A React app with 1,000 components and 1,500 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-1k pnpm benchmark
```

| Name                         | Dev cold start | HMR     | Prod build | Total size | Gzipped size |
| ---------------------------- | -------------- | ------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.6.0             | 920ms🥇        | 173ms   | 910ms🥉    | 846.2kB    | 220.8kB🥉    |
| Rsbuild 1.6.0                | 1414ms🥈       | 154ms   | 848ms🥈    | 877.9kB    | 214.5kB🥇    |
| Vite (Rolldown + Oxc) 7.1.20 | 4995ms         | 127ms🥈 | 750ms🥇    | 830.5kB🥈  | 226.1kB      |
| Vite (Rollup + SWC) 7.1.12   | 7571ms         | 101ms🥇 | 2517ms     | 806.4kB🥇  | 217.5kB🥈    |
| webpack (SWC) 5.102.1        | 5541ms         | 427ms   | 4281ms     | 843.3kB🥉  | 226.2kB      |
| Farm 1.7.11                  | 1452ms🥉       | 146ms   | 2035ms     | 1085.3kB   | 258.3kB      |
| Parcel 2.16.0                | 4409ms         | 130ms🥉 | 4316ms     | 962.0kB    | 229.8kB      |

### react-5k

A React app with 5,000 components and 5,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-5k pnpm benchmark
```

| Name                         | Dev cold start | HMR    | Prod build | Total size | Gzipped size |
| ---------------------------- | -------------- | ------ | ---------- | ---------- | ------------ |
| Rspack CLI 1.6.0             | 447ms🥇        | 75ms🥇 | 1182ms🥈   | 2853.7kB   | 679.5kB🥇    |
| Rsbuild 1.6.0                | 468ms🥈        | 94ms🥈 | 1503ms🥉   | 2884.7kB   | 680.5kB🥈    |
| Vite (Rolldown + Oxc) 7.1.20 | 3017ms         | 115ms  | 981ms🥇    | 2660.3kB🥈 | 725.4kB      |
| Vite (Rollup + SWC) 7.1.12   | 3816ms         | 99ms🥉 | 5591ms     | 2584.4kB🥇 | 689.8kB🥉    |
| webpack (SWC) 5.102.1        | 8492ms         | 748ms  | 6762ms     | 2832.1kB🥉 | 696.9kB      |
| Farm 1.7.11                  | 892ms🥉        | 142ms  | 4954ms     | 3540.7kB   | 806.8kB      |
| Parcel 2.16.0                | 9458ms         | 205ms  | 10991ms    | 3485.4kB   | 765.3kB      |

### react-10k

A React app with 10,000 components and 10,000 modules from node_modules, using dynamic imports to simulate SPA.

```bash
CASE=react-10k pnpm benchmark
```

| Name                         | Dev cold start | HMR    | Prod build | Total size | Gzipped size |
| ---------------------------- | -------------- | ------ | ---------- | ---------- | ------------ |
| Rspack CLI 1.6.0             | 397ms🥇        | 82ms🥉 | 2629ms🥈   | 6003.5kB   | 1369.4kB🥇   |
| Rsbuild 1.6.0                | 688ms🥈        | 110ms  | 3373ms🥉   | 6061.8kB   | 1369.4kB🥈   |
| Vite (Rolldown + Oxc) 7.1.20 | 5488ms🥉       | 35ms🥇 | 1362ms🥇   | 5529.1kB🥈 | 1483.5kB     |
| Vite (Rollup + SWC) 7.1.12   | 5491ms         | 71ms🥈 | 10306ms    | 5374.2kB🥇 | 1410.5kB🥉   |
| webpack (SWC) 5.102.1        | 16019ms        | 3201ms | 12902ms    | 5954.4kB🥉 | 1451.9kB     |

### ui-components

A React app that imports UI components from several popular UI libraries.

Including [@mui/material](https://npmjs.com/package/@mui/material), [antd](https://npmjs.com/package/antd), [@chakra-ui/react](https://npmjs.com/package/@chakra-ui/react), [@fluentui/react](https://npmjs.com/package/@fluentui/react), [@headlessui/react](https://npmjs.com/package/@headlessui/react), [@mantine/core](https://npmjs.com/package/@mantine/core), [react-bootstrap](https://npmjs.com/package/react-bootstrap), [element-plus](https://npmjs.com/package/element-plus), [vant](https://npmjs.com/package/vant), and [vuetify](https://npmjs.com/package/vuetify).

```bash
CASE=ui-components pnpm benchmark
```

| Name                         | Prod build | Total size | Gzipped size |
| ---------------------------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.6.0             | 2032ms🥉   | 2051.2kB🥈 | 627.8kB🥈    |
| Rsbuild 1.6.0                | 3583ms     | 2049.2kB🥇 | 627.2kB🥇    |
| Vite (Rollup + SWC) 7.1.12   | 10170ms    | 2071.0kB   | 649.9kB      |
| Vite (Rolldown + Oxc) 7.1.20 | 1704ms🥇   | 2051.5kB   | 631.6kB      |
| Rolldown 1.0.0-beta.45       | 2035ms     | 2066.7kB   | 632.3kB      |
| webpack (SWC) 5.102.1        | 13139ms    | 2051.3kB🥉 | 629.0kB🥉    |
| esbuild 0.25.11              | 1817ms🥈   | 2886.4kB   | 885.2kB      |
| Farm 1.7.11                  | 6862ms     | 3812.5kB   | 1326.7kB     |
| Parcel 2.16.0                | 12624ms    | 2090.0kB   | 635.8kB      |

### rome

A complex TypeScript Node.js project that includes multiple packages from the [rome](https://github.com/rome/tools) toolchain.

```bash
CASE=rome pnpm benchmark
```

| Name                   | Prod build | Total size | Gzipped size |
| ---------------------- | ---------- | ---------- | ------------ |
| Rspack CLI 1.6.0       | 699ms🥉    | 1008.1kB🥉 | 270.9kB🥈    |
| Rsbuild 1.6.0          | 1390ms     | 1008.0kB🥈 | 270.9kB🥉    |
| Rolldown 1.0.0-beta.45 | 569ms🥈    | 1012.2kB   | 271.8kB      |
| webpack (SWC) 5.102.1  | 3276ms     | 1006.2kB🥇 | 270.5kB🥇    |
| esbuild 0.25.11        | 292ms🥇    | 1025.3kB   | 276.7kB      |

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
