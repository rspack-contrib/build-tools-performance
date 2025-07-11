// @ts-check
import { target } from './constants.mjs';
import config from './webpack.config.mjs';

export default {
  ...config,
  target: ['node', target],
};
