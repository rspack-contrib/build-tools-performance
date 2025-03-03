// @ts-check
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import ReactRefreshPlugin from "@rspack/plugin-react-refresh";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  context: import.meta.dirname,
  devtool: isProduction ? false : undefined,
  entry: {
    main: "./src/index.tsx",
  },
  resolve: {
    extensions: ["...", ".tsx", ".ts", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: "asset",
      },
      {
        test: /\.(js|ts|tsx|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "builtin:swc-loader",
          /** @type {import('@rspack/core').SwcLoaderOptions} */
          options: {
            env: {
              targets: [
                "chrome >= 87",
                "edge >= 88",
                "firefox >= 78",
                "safari >= 14",
              ],
            },
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
              },
              transform: {
                react: {
                  runtime: "automatic",
                  development: !isProduction,
                  refresh: !isProduction,
                },
              },
            },
          },
        },
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({ template: "./index.rspack.html" }),
    !isProduction && new ReactRefreshPlugin(),
  ],
  experiments: {
    css: true,
    // lazyCompilation should only be enabled in development mode
    lazyCompilation: Boolean(process.env.LAZY) && !isProduction,
    incremental: !isProduction ? true : undefined,
    
  },
});
