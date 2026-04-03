// @ts-check
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';

const reportEntry = process.env.POPULAR_LIBS_ENTRY;

export default defineConfig({
  extends: '../../shared/rspack.config.mjs',
  ...(reportEntry ? { entry: reportEntry } : {}),
  plugins: reportEntry
    ? []
    : [new rspack.HtmlRspackPlugin({ template: 'index-rspack.html' })],
});
