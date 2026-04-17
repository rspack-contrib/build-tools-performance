// @ts-check
import { isProd, targetBrowser } from './constants.mjs';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';

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
  optimization: {
    minimizer: isProd
      ? [
          new CssMinimizerPlugin({
            minify: CssMinimizerPlugin.lightningCssMinify,
            minimizerOptions: {
              // @ts-ignore
              targets: browserslistToTargets(browserslist(targetBrowser)),
            },
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
