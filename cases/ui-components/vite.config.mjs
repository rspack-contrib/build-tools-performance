// @ts-check
import { defineConfig } from 'vite';
import { target } from '../../shared/constants.mjs';

export default defineConfig({
  build: {
    target,
    rollupOptions: {
      // https://github.com/vitejs/vite/issues/15012
      onLog() {},
    },
  },
});
