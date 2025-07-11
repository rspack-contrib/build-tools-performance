// @ts-check
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  extends: '../../shared/webpack.config.mjs',
  plugins: [new HtmlWebpackPlugin({ template: 'index-rspack.html' })],
};
