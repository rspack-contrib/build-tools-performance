// @ts-check
import { defineConfig } from 'rolldown';
import path from 'node:path';
import config from '../../shared/rolldown.config.mjs';

export default defineConfig({
  ...config,
  cwd: import.meta.dirname,
  input: {
    main: './src/entry.ts',
  },
  platform: 'node',
  shimMissingExports: true,
  resolve: {
    tsconfigFilename: path.resolve(import.meta.dirname, 'src/tsconfig.json'),
  },
});
