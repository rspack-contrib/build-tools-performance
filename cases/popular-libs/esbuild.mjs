import esbuild from '../../shared/esbuild.mjs';

const reportEntry = process.env.POPULAR_LIBS_ENTRY;

await esbuild({
  entryPoints: [reportEntry ?? './src/index.js'],
});
