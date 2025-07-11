// @ts-check
import { target } from '../../shared/constants.mjs';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  devtool: false,
  target: ['web', target],
  experiments: {
    css: true,
  },
  plugins: [new HtmlWebpackPlugin({ template: 'index-rspack.html' })],
};
