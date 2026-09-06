// @ts-check
import { isProd, targetBrowser } from './constants.mjs';

export default {
  devtool: isProd ? false : undefined,
  target: ['web', `browserslist:${targetBrowser}`],
  resolve: {
    extensions: ['...', '.tsx', '.ts', '.jsx'],
  },
  cache: {
    type: 'filesystem',
    name: `webpack-web-${isProd ? 'prod' : 'dev'}`,
  },
  experiments: {
    css: true,
  },
};
