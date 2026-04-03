// @ts-check
import { isProd, target } from './constants.mjs';
import config from './webpack.config.mjs';

export default {
  ...config,
  target: ['node', target],
  cache: {
    ...config.cache,
    name: `webpack-node-${isProd ? 'prod' : 'dev'}`,
  },
};
