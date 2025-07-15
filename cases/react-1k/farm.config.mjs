// @ts-check
import { defineConfig } from '@farmfe/core';
import { isProd } from '../../shared/constants.mjs';

export default defineConfig({
  compilation: {
    sourcemap: !isProd,
    presetEnv: false,
    output: {
      // Farm does not support browser-es2022 yet
      targetEnv: `browser-es2017`,
    },
  },
  plugins: ['@farmfe/plugin-react'],
});
