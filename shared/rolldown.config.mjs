// @ts-check
import { defineConfig } from 'rolldown';
import { isProd, target } from './constants.mjs';

export default defineConfig({
  transform: {
    target,
    define: {
      'process.env.NODE_ENV': JSON.stringify(
        isProd ? 'production' : 'development',
      ),
    },
  },
  output: {
    minify: isProd,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
});
