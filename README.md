# Build Tools Performance Compare

Benchmarks for Rspack, Rsbuild, webpack, Vite and Farm.

## Result

![image](https://github.com/user-attachments/assets/178448c9-d2d9-4b38-b7a4-5b27d6e89c0c)

Info:

- Run in GitHub Actions (macos 15)
- startup = serverStart + onLoad

## Cases

- small: 1000 components + 1500 modules in node_modules
- medium: 5000 components + 5000 modules in node_modules

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
