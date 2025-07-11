// @ts-check
import { defineConfig } from 'rolldown-vite';
import { target } from '../../shared/constants.mjs';

export default defineConfig({
  build: {
    target,
  },
  experimental: {
    enableNativePlugin: true,
  },
});
