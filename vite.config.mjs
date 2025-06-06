import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  root: path.resolve(__dirname, 'src', process.env.CASE ?? 'medium'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
  },
  plugins: [react()],
  optimizeDeps: {
    // pre-bundle "@iconify-icons/material-symbols/*" is quite slow and should be excluded
    exclude: ['@iconify-icons/material-symbols'],
  },
});
