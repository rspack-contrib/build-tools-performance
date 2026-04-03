// @ts-check
import { defineConfig } from 'vite';
import { target } from '../../shared/constants.mjs';

const reportEntry = process.env.POPULAR_LIBS_ENTRY;

export default defineConfig({
  build: {
    target,
    ...(reportEntry
      ? {
          rollupOptions: {
            input: reportEntry,
          },
        }
      : {}),
  },
});
