// @ts-check
import { isProd, targetBrowser } from './constants.mjs';

const defaultExtensions = ['.ts', '.tsx', '.js', '.jsx'];

const reactOptions = {
  runtime: 'automatic',
  importSource: 'react',
};

/**
 * @param {Record<string, any>} config
 */
export const createUtooConfig = (config) => {
  const { output, resolve, optimization, ...rest } = config;

  return {
    mode: isProd ? 'production' : 'development',
    sourceMaps: !isProd,
    tracing: false,
    persistentCaching: true,
    stats: false,
    ...rest,
    output: {
      path: './dist',
      clean: true,
      ...output,
    },
    resolve: {
      extensions: defaultExtensions,
      ...resolve,
    },
    optimization: {
      minify: isProd,
      ...optimization,
    },
  };
};

/**
 * @param {{ entry: string, htmlTemplate?: string, react?: boolean } & Record<string, any>} config
 */
export const createBrowserUtooConfig = ({
  entry,
  htmlTemplate = './index-rspack.html',
  react = false,
  ...config
}) =>
  createUtooConfig({
    target: targetBrowser,
    entry: [
      {
        import: entry,
        html: {
          template: htmlTemplate,
        },
      },
    ],
    devServer: {
      port: 3000,
      hot: true,
    },
    ...(react ? { react: reactOptions } : {}),
    ...config,
  });
