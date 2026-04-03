// @ts-check
import { defineConfig } from 'rolldown';
import config from '../../shared/rolldown.config.mjs';

const reportEntry = process.env.POPULAR_LIBS_ENTRY;

export default defineConfig({
  ...config,
  input: {
    main: reportEntry ?? './src/index.js',
  },
});
