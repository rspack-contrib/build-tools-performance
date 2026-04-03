// @ts-check
import alias from '@rollup/plugin-alias';
import config from '../../shared/rollup.config.mjs';

const reportEntry = process.env.POPULAR_LIBS_ENTRY;
const sharedPlugins = reportEntry
  ? config.plugins.filter((plugin) => plugin?.name !== 'html')
  : config.plugins;

export default {
  ...config,
  input: reportEntry ?? './src/index.js',
  plugins: [
    alias({
      entries: [{ find: 'axios', replacement: 'axios/dist/browser/axios.cjs' }],
    }),
    ...sharedPlugins,
  ],
};
