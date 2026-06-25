import bunBuild from '../../shared/bun.mjs';

await bunBuild({
  entrypoints: ['./src/index.js'],
});
