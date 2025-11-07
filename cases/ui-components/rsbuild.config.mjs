// @ts-check
import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  performance: {
    chunkSplit: {
      strategy: 'all-in-one',
    },
    buildCache: true,
  },
});
