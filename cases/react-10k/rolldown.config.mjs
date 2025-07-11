// @ts-check
import { defineConfig } from 'rolldown';
import path from 'node:path';
import { target, isProd } from '../../shared/constants.mjs';

export default defineConfig({
  input: path.join(import.meta.dirname, 'src', 'index.jsx'),
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
