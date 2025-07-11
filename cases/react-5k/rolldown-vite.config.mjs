// @ts-check
import { defineConfig } from 'rolldown-vite';
import react from '@vitejs/plugin-react-oxc';
import { target } from '../../shared/constants.mjs';

export default defineConfig({
  plugins: [react()],
  build: {
    target,
  },
  optimizeDeps: {
    // pre-bundle "@iconify-icons/material-symbols/*" is quite slow and should be excluded
    exclude: ['@iconify-icons/material-symbols'],
  },
  experimental: {
    enableNativePlugin: true,
  },
});
