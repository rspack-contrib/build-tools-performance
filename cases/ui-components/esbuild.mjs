import esbuild from '../../shared/esbuild.mjs';

await esbuild({
  entryPoints: ['./src/index.js'],
});
