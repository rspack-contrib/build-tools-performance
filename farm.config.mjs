import path from 'node:path';
import { defineConfig } from '@farmfe/core';

const isProd = process.env.NODE_ENV === 'production';
const caseName = process.env.CASE ?? 'medium';

export default defineConfig({
  compilation: {
    sourcemap: !isProd,
    presetEnv: false,
    input: {
      index: path.resolve(__dirname, 'src', caseName, 'index.html'),
    },
    output: {
      targetEnv: 'browser-es2022',
    },
  },
  plugins: ['@farmfe/plugin-react'],
});
