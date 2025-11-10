// @ts-check
import { defineConfig } from '@rsbuild/core';
import { targetBrowser } from '../../shared/constants.mjs';
import path from 'node:path';

export default defineConfig({
  source: {
    entry: {
      main: './src/entry.ts',
    },
    tsconfigPath: path.resolve(import.meta.dirname, 'src/tsconfig.json'),
  },
  output: {
    target: 'node',
    overrideBrowserslist: [targetBrowser],
  },
  tools: {
    rspack: {
      module: {
        parser: {
          javascript: {
            exportsPresence: false,
          },
        },
      },
    },
  },
  performance: {
    buildCache: true,
  },
});
