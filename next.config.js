/** @type {import('next').NextConfig} */

const createMDXPlugin = require("@next/mdx");

const nextConfig = {
  // Nextjs has an issue with pdfjs-dist which optionally uses the canvas package
  // for Node.js compatibility. This causes a "Module parse failed" error when
  // building the app. Since pdfjs-dist is only used on client side, we disable
  // the canvas package for webpack
  // https://github.com/mozilla/pdf.js/issues/16214
  output: "standalone",

  serverExternalPackages: ["drizzle-orm", "@libsql/client"],
  webpack: (config) => {
    // Setting resolve.alias to false tells webpack to ignore a module
    // https://webpack.js.org/configuration/resolve/#resolvealias
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    // Enable top-level await for resumed library
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    //config.module.rules.push({
    //  test: /\.node$/,
    //  loader: "node-loader",
    //});
    //config.module.rules.push({
    //  test: /\.d\.ts$/,
    //  use: "null-loader",
    //});
    //config.module.rules.push({
    //  test: /^(?!.*\..*)/,
    //  use: "raw-loader",
    //});
    //config.module.rules.push({
    //  test: /\.js$/,
    //  enforce: "pre",
    //  use: "source-map-loader",
    //});

    return config;
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  //transpilePackages: ["@libsql/client", "@libsql/core", "@libsql/hrana-client"],
};
const withMDX = createMDXPlugin({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [], // Add any remark plugins here
    rehypePlugins: [], // Add any rehype plugins here
  },
});

module.exports = withMDX(nextConfig);
