const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
let generateHtmlTemplateList = require('./generateHtmlTemplateList.js');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
// const { VueLoaderPlugin } = require('vue-loader');

// add hot-reload related code to entry chunks
let entries = baseWebpackConfig.entry;
baseWebpackConfig.entry = Object.keys(entries).reduce((pre, next) => {
  pre[next] = ['./build/dev-client', entries[next]];
  return pre;
}, {});

module.exports = merge(baseWebpackConfig, {
  mode: "development",
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool, // eval-source-map只能看，不能调试，得不偿失
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // new VueLoaderPlugin(),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
    // https://github.com/ampedandwired/html-webpack-plugin
  ].concat(generateHtmlTemplateList(config.dev.env, entries))
    .concat([new FriendlyErrorsPlugin()])
});
