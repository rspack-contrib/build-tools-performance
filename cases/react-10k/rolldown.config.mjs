// @ts-check
import { defineConfig } from 'rolldown';
import path from 'path';
import { target, isProd } from '../../shared.mjs';

export default defineConfig({
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
