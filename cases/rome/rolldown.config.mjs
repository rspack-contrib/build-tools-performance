// @ts-check
import { defineConfig } from 'rolldown';
import path from 'node:path';

export default defineConfig({
  cwd: import.meta.dirname,
  input: {
    main: path.join(import.meta.dirname, 'src', 'entry.ts'),
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  platform: 'node',
  shimMissingExports: true,
  resolve: {
    extensions: ['.ts', '.js'],
    tsconfigFilename: path.resolve(import.meta.dirname, 'src/tsconfig.json'),
  },
  output: {
    minify: true,
  },
});
