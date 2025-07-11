// @ts-check
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { target } from '../../shared/constants.mjs';

export default defineConfig({
  build: {
    target,
  },
  plugins: [react()],
  optimizeDeps: {
    // pre-bundle "@iconify-icons/material-symbols/*" is quite slow and should be excluded
    exclude: ['@iconify-icons/material-symbols'],
  },
});
