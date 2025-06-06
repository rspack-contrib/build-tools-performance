import path from 'node:path';
import { defineConfig } from 'rolldown-vite';
import react from '@vitejs/plugin-react-oxc';

export default defineConfig({
  root: path.resolve(__dirname, 'src', process.env.CASE ?? 'medium'),
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
  },
  optimizeDeps: {
    // pre-bundle "@iconify-icons/material-symbols/*" is quite slow and should be excluded
    exclude: ['@iconify-icons/material-symbols'],
  },
  experimental: {
    enableNativePlugin: 'resolver',
  }
});
