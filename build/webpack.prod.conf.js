const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
let generateHtmlTemplateList = require('./generateHtmlTemplateList.js');
const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
let HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const os = require('os');

// 添加'babel-polyfill', 兼容安卓4.4以下的版本
let entries = baseWebpackConfig.entry;
// baseWebpackConfig.entry = Object.keys(entries).reduce((pre, next) => {
//   pre[next] = ['babel-polyfill', entries[next]];
//   return pre;
// }, {});

baseWebpackConfig.entry = Object.keys(entries).reduce((pre, next) => {
  pre[next] = ['es6-promise/auto', entries[next]];
  return pre;
}, {});

const webpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('[name]/index_[chunkhash:7].js'), //
    chunkFilename: utils.assetsPath('[id].[chunkhash:7].js')
  },
  optimization: {
    ...(
      config.build.inlineSource
        ? {}
        : {
          // split vendor js into its own file
          // splitChunks: {
          //   // include all types of chunks
          //   chunks: 'all'
          // },
          // runtimeChunk: true
        }
    )

  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': config.build.env
    }),
    // 混淆，压缩代码
    new UglifyJsParallelPlugin({
      // 多进程压缩js，可以将编译速度提高三倍.
      // 需要注意的是多进程不利于查看bug日志，如果出现编译bug的话需要换成普通模式debug
      workers: os.cpus().length,
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //         warnings: false
    //     },
    //     sourceMap: true
    // }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('[name]/index_[contenthash:7].css'), //
      chunkFilename: utils.assetsPath('[id].[contenthash:7].css')
      // filename: 'css/app.[name].css',
      // chunkFilename: 'css/app.[contenthash:12].css'  // use contenthash *
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false }, autoprefixer: { remove: false } }
        : { safe: true, autoprefixer: { remove: false } },
    }),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),

    // https://webpack.docschina.org/plugins/ignore-plugin/
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    })

    // copy custom static assets
    // new CopyWebpackPlugin([
    //   {
    //     // 配置静态文件路径
    //     from: path.resolve(__dirname, '../static'),
    //     to: config.build.assetsSubDirectory + 'static',
    //     ignore: ['.*']
    //   }
    // ])
  ].concat(generateHtmlTemplateList(config.build.env, entries), config.build.inlineSource ? new HtmlWebpackInlineSourcePlugin() : [])
});

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin');
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
