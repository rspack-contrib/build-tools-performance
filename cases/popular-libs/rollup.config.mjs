// @ts-check
import alias from '@rollup/plugin-alias';
import config from '../../shared/rollup.config.mjs';

export default {
  ...config,
  input: './src/index.js',
  plugins: [
    alias({
      entries: [{ find: 'axios', replacement: 'axios/dist/browser/axios.cjs' }],
    }),
    ...config.plugins,
  ],
};
