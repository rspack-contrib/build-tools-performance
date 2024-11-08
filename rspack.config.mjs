// @ts-check
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import ReactRefreshPlugin from "@rspack/plugin-react-refresh";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
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
          options: {
            jsc: {
              target: ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"],
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
    new rspack.HtmlRspackPlugin({ template: "./index.webpack.html" }),
    !isProduction && new ReactRefreshPlugin(),
  ].filter(Boolean),
  experiments: {
    css: true,
    lazyCompilation: !isProduction // lazyCompilation should only be enabled in development mode
  },
});
