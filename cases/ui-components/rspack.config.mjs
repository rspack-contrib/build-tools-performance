// @ts-check
import { defineConfig } from '@rspack/cli';
import { target } from '../../shared.mjs';
import { rspack } from '@rspack/core';

export default defineConfig({
  devtool: false,
  target: ['web', target],
  experiments: {
    css: true,
  },
  plugins: [new rspack.HtmlRspackPlugin({ template: 'index-rspack.html' })],
});
