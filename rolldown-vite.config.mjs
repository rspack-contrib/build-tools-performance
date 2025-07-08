import path from 'node:path';
import { defineConfig } from 'rolldown-vite';
import react from '@vitejs/plugin-react-oxc';
import { caseName, target, isProd } from './shared.mjs';

export default defineConfig({
  root: path.resolve(__dirname, 'src', caseName),
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    target,
  },
  optimizeDeps: {
    // pre-bundle "@iconify-icons/material-symbols/*" is quite slow and should be excluded
    exclude: ['@iconify-icons/material-symbols'],
  },
  experimental: {
    enableNativePlugin: 'resolver',
  }
});
