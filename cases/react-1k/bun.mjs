import bunBuild from '../../shared/bun.mjs';

await bunBuild({
  entrypoints: ['./index.html'],
});
