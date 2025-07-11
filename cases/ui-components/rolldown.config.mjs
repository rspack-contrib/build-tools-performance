// @ts-check
import { defineConfig } from 'rolldown';
import path from 'node:path';
import config from '../../shared/rolldown.config.mjs';

export default defineConfig({
  ...config,
  input: {
    main: path.join(import.meta.dirname, 'src', 'index.js'),
  },
});
