const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const Dotenv = require('dotenv-webpack');


module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: {
      popup: "./extension/src/popup/index.tsx",
      options: "./extension/src/options/index.tsx",
      content: "./extension/src/content/index.tsx",
      background: "./extension/src/background/index.ts",
    },
    output: {
      path: path.resolve(__dirname, "extension/dist"),
      filename: "[name].js",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: path.resolve(__dirname, "extension/tsconfig.json"),
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    require("tailwindcss")("./tailwind.config.ts"),
                    require("autoprefixer"),
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: "asset/resource",
          generator: {
            filename: "images/[hash][ext][query]",
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: "asset/resource",
          generator: {
            filename: "fonts/[hash][ext][query]",
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
      alias: {
        //'@': path.resolve(__dirname, 'src/app'),
        //'@lib': path.resolve(__dirname, 'src/app/lib'),
        //'@database': path.resolve(__dirname, 'src/app/database'),
        //'@components': path.resolve(__dirname, 'src/app/components'),
        public: path.resolve(__dirname, "public"),
        assets: path.resolve(__dirname, "extension/dist/assets"),
      },
      fallback: {
        //crypto: false,
        //os: false,
        //path: false,
      },
      plugins: [
        new TsconfigPathsPlugin({
          extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
          configFile: path.resolve(__dirname, "extension/tsconfig.json"),
        }),
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "extension/public",
            to: ".",
            globOptions: {
              ignore: ["**/*.html"],
            },
          },
          {
            from: "extension/src/content/content.css",
            to: "content.css",
          },
          {
            from: "public/assets",
            to: "assets",
            globOptions: {
              ignore: ["**/*.md"],
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: "extension/public/popup.html",
        filename: "popup.html",
        chunks: ["popup"],
      }),
      new HtmlWebpackPlugin({
        template: "extension/public/options.html",
        filename: "options.html",
        chunks: ["options"],
      }),
      new NodePolyfillPlugin({
        additionalAliases: ["process","path","crypto","os","tty"],
      }),
      new Dotenv(),

      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "[name].css",
            }),
          ]
        : []),
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },
    devtool: isProduction ? false : "cheap-module-source-map",
    watchOptions: {
      ignored: /node_modules/,
    },
  };
};
