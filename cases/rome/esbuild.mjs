import esbuild from '../../shared/esbuild.mjs';

await esbuild({
  entryPoints: ['./src/entry.ts'],
  platform: 'node',
});
