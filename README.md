**Forked from [farm-fe/performance-compare](https://github.com/farm-fe/performance-compare), thanks to the Farm team!**

Benchmarks for Rsbuild, Rspack, Webpack and Vite.

> Using Turbopack's bench cases (1000 React components), see https://turbo.build/pack/docs/benchmarks

<img width="1021" alt="Screenshot 2024-07-12 at 13 05 38" src="https://github.com/user-attachments/assets/21043e4d-44ae-4ee7-a5f7-e4f4bf53ce98">

> MacBook Pro / Apple M1 Pro / 32GB

Run benchmarks:

```bash
node benchmark.mjs
```

You will see something like:

```txt
bright@bright-MS-7D17:~/opensource/performance-compare$ node benchmark.mjs

Rspack  startup time: 417ms
Turbopack  startup time: 2440.673095703125ms
Webpack  startup time: 7968ms
Vite  startup time: 3712ms
Farm  startup time: 430ms
Turbopack  Root HMR time: 7ms
Farm  Root HMR time: 7ms
Vite  Root HMR time: 42ms
Rspack  Root HMR time: 298ms
Webpack  Root HMR time: 451ms
Farm  Leaf HMR time: 10ms
Turbopack  Leaf HMR time: 11ms
Vite  Leaf HMR time: 22ms
Webpack  Leaf HMR time: 284ms
Rspack  Leaf HMR time: 303ms
```

If you want to start the project with the specified tool, try:

```bash
pnpm i # install dependencies

npm run start # Start Farm
npm run start:vite # Start Vite
npm run start:webpack # Start Webpack
npm run start:rspack # Start Rspack
npm run start:rsbuild # Start Rsbuild
npm run start:turbopack # Start Turbopack
```
