const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      popup: './extension/src/popup/index.tsx',
      options: './extension/src/options/index.tsx',
      content: './extension/src/content/index.tsx',
      background: './extension/src/background/index.ts',
    },
    output: {
      path: path.resolve(__dirname, 'extension/dist'),
      filename: '[name].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(__dirname, 'extension/tsconfig.json'),
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('tailwindcss'),
                    require('autoprefixer'),
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'images/[hash][ext][query]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[hash][ext][query]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src/app'),
        'public': path.resolve(__dirname, 'public'),
      },
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: 'extension/public',
            to: '.',
            globOptions: {
              ignore: ['**/*.html'],
            },
          },
          {
            from: 'extension/src/content/content.css',
            to: 'content.css',
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: 'extension/public/popup.html',
        filename: 'popup.html',
        chunks: ['popup'],
      }),
      new HtmlWebpackPlugin({
        template: 'extension/public/options.html',
        filename: 'options.html',
        chunks: ['options'],
      }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: '[name].css',
            }),
          ]
        : []),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    devtool: isProduction ? false : 'cheap-module-source-map',
    watchOptions: {
      ignored: /node_modules/,
    },
  };
}; 