// @ts-check
import { target } from './constants.mjs';
import config from './rspack.config.mjs';

export default {
  ...config,
  target: ['node', target],
};
