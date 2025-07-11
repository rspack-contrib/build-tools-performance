// @ts-check
import { isProd, target } from './constants.mjs';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

export default {
  devtool: isProd ? false : undefined,
  target: ['web', target],
  resolve: {
    extensions: ['...', '.tsx', '.ts', '.jsx'],
  },
  optimization: {
    minimizer: isProd
      ? [
          new CssMinimizerPlugin({
            minify: CssMinimizerPlugin.swcMinify,
          }),
          new TerserPlugin({
            minify: TerserPlugin.swcMinify,
          }),
        ]
      : [],
  },
  experiments: {
    css: true,
  },
};
