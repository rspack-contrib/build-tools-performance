// @ts-check
import { defineConfig } from '@rspack/cli';
import { config } from '../../shared/rspack.config.mjs';
import { rspack } from '@rspack/core';

export default defineConfig({
  ...config,
  plugins: [new rspack.HtmlRspackPlugin({ template: 'index-rspack.html' })],
});
