// @ts-check
import { defineConfig } from 'rolldown-vite';
import { target } from '../../shared.mjs';

export default defineConfig({
  build: {
    target,
  },
  experimental: {
    enableNativePlugin: true,
  },
});
