// @ts-check
import { targetBrowser } from './constants.mjs';
import config from './rspack.config.mjs';

export default {
  ...config,
  target: ['node', `browserslist:${targetBrowser}`],
};
