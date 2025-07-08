// @ts-check
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { caseName, target } from './shared.mjs';

export default defineConfig({
  root: path.resolve(__dirname, 'src', caseName),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    target,
  },
  plugins: [react()],
  optimizeDeps: {
    // pre-bundle "@iconify-icons/material-symbols/*" is quite slow and should be excluded
    exclude: ['@iconify-icons/material-symbols'],
  },
});
