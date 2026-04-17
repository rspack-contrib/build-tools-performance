// @ts-check
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { targetVite } from '../../shared/constants.mjs';

export default defineConfig({
  plugins: [react()],
  build: {
    target: targetVite,
  },
  optimizeDeps: {
    // pre-bundle "@iconify-icons/material-symbols/*" is quite slow and should be excluded
    exclude: ['@iconify-icons/material-symbols'],
  },
});
