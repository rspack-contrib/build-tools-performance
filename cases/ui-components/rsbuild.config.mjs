// @ts-check
import { defineConfig } from '@rsbuild/core';
import { targetBrowser } from '../../shared/constants.mjs';

export default defineConfig({
  output: {
    overrideBrowserslist: [targetBrowser],
  },
  performance: {
    chunkSplit: {
      strategy: 'all-in-one',
    },
  },
});
