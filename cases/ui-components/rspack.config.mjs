// @ts-check
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';

export default defineConfig({
  extends: '../../shared/rspack.config.mjs',
  plugins: [new rspack.HtmlRspackPlugin({ template: 'index-rspack.html' })],
});
