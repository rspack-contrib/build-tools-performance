// @ts-check
import { defineConfig } from 'rolldown';
import config from '../../shared/rolldown.config.mjs';

export default defineConfig({
  ...config,
  input: './src/index.jsx',
});
