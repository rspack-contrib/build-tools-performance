
Benchmarks for Rspack, Rsbuild, Webpack, Vite and Farm.

## Result

<img width="974" alt="Screenshot 2024-07-15 at 14 32 07" src="https://github.com/user-attachments/assets/db10a317-c65d-4bba-932e-9f446765846d">

Info:

- MacBook Pro / Apple M1 Pro / 32GB
- startup = serverStart + onLoad

## Run

Run benchmarks:

```bash
node benchmark.mjs
```

If you want to start the project with the specified tool, try:

```bash
pnpm i # install dependencies

npm run start:farm # Start Farm
npm run start:rspack # Start Rspack
npm run start:rsbuild # Start Rsbuild
npm run start:vite # Start Vite
npm run start:webpack # Start Webpack
npm run start:turbopack # Start Turbopack
```

## Credits

- Forked from [farm-fe/performance-compare](https://github.com/farm-fe/performance-compare), thanks to the Farm team!
- Using Turbopack's bench cases (1000 React components), see https://turbo.build/pack/docs/benchmarks
