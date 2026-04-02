// @ts-check
import { defineConfig } from 'vite';
import { target } from '../../shared/constants.mjs';

export default defineConfig({
  build: {
    target,
  },
  experimental: {
    enableNativePlugin: true,
  },
});
