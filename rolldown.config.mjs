import { defineConfig } from 'rolldown';
import path from 'path';
import { caseName, target, isProd } from './shared.mjs';

export default defineConfig({
  input: {
    main: path.join(import.meta.dirname, './src', caseName, 'index.jsx'),
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  output: {
    minify: isProd,
  },
  transform: {
    target,
  },
});
