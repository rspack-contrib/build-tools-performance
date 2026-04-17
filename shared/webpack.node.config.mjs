// @ts-check
import { isProd, targetBrowser } from './constants.mjs';
import config from './webpack.config.mjs';

export default {
  ...config,
  target: ['node', `browserslist:${targetBrowser}`],
  cache: {
    ...config.cache,
    name: `webpack-node-${isProd ? 'prod' : 'dev'}`,
  },
};
