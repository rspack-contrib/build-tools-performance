// @ts-check
import { defineConfig } from 'rolldown';
import path from 'node:path';

export default defineConfig({
  input: {
    main: path.join(import.meta.dirname, 'src', 'index.js'),
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  output: {
    minify: true,
  },
});
