// @ts-check
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { targetBrowser } from '../../shared/constants.mjs';

export default defineConfig({
  plugins: [pluginReact()],
  dev: {
    lazyCompilation: Boolean(process.env.LAZY),
  },
  output: {
    overrideBrowserslist: [targetBrowser],
  },
});
