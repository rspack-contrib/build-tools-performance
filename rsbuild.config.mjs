// @ts-check
import path from 'node:path';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const isProduction = process.env.NODE_ENV === 'production';
const caseName = process.env.CASE ?? 'medium';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: path.join(import.meta.dirname, 'src', caseName, 'index.jsx'),
    },
  },
  dev: {
    lazyCompilation: Boolean(process.env.LAZY),
  },
  tools: {
    rspack: {
      experiments: {
        incremental: !isProduction ? true : undefined,
      },
    },
  },
});
