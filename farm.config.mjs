import path from 'node:path';
import { defineConfig } from '@farmfe/core';
import { caseName, target, isProd } from './shared.mjs';

export default defineConfig({
  compilation: {
    sourcemap: !isProd,
    presetEnv: false,
    input: {
      index: path.resolve(__dirname, 'src', caseName, 'index.html'),
    },
    output: {
      targetEnv: `browser-${target}`,
    },
  },
  plugins: ['@farmfe/plugin-react'],
});
