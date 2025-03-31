# Build Tools Performance Compare

Benchmarks for Rspack, Rsbuild, webpack, Vite and Farm.

## Result

### 2.5k modules

1000 components + 1500 modules in node_modules.

```bash
pnpm run benchmark small
```

![image](https://github.com/user-attachments/assets/b7e5bc2a-d9d8-41de-bf19-ffd6c6ac6def)


### 10k modules

5000 components + 5000 modules in node_modules.

```bash
pnpm run benchmark medium
```

![image](https://github.com/user-attachments/assets/e80ed3a7-35e0-4240-9f93-d467bad90f49)

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
