// @ts-check
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { targetBrowser } from '../../shared/constants.mjs';

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    overrideBrowserslist: [targetBrowser],
  },
});
