# Build Tools Performance Compare

Benchmarks for Rspack, Rsbuild, Webpack, Vite and Farm.

## Result

![image](https://github.com/user-attachments/assets/9d8518b7-0745-4b52-b8ef-b7770351c8ca)

Info:

- MacBook Pro / Apple M1 Pro / 32GB
- startup = serverStart + onLoad
- 5000 components + 5000 modules in node_modules

## Run

Run benchmarks (node >= 22):

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

Forked from [farm-fe/performance-compare](https://github.com/farm-fe/performance-compare), thanks to the Farm team!

