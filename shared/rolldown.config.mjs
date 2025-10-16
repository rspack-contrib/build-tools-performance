// @ts-check
import { defineConfig } from 'rolldown';
import { isProd, target } from './constants.mjs';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      isProd ? 'production' : 'development',
    ),
  },
  transform: {
    target,
  },
  output: {
    minify: isProd,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
});
