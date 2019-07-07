const path = require('path');
const utils = require('./utils.js');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
const { VueLoaderPlugin } = require('vue-loader');

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [config.srcDir],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
});

let webpackBase = {
  cache: true, // 开启webpack的默认缓存
  entry: JSON.parse(process.env.WEBPACK_ENTRY),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets')
    }
  },
  plugins:[new VueLoaderPlugin()],
  module: {
    rules: [
      // ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: ['babel-loader?cacheDirectory=true'],
        include: [path.join(config.rootDir, 'src'), path.join(config.rootDir, 'node_modules/webpack-dev-server/client')],
        exclude: [path.join(config.rootDir, 'node_modules')]
      },
      {
        // 图片资源处理器
        // 10kb以下数据直接转为base64,否则置于img/文件夹中
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 10,
              name: utils.assetsPath('img/[path][name]_[hash:7].[ext]')
            }
          },
          {
            // https://github.com/tcoopman/image-webpack-loader
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: false,
              mozjpeg: {quality: 80},
              pngquant: {quality: "70-90", speed: 4},
            }
          },
        ]

      },
      {
        // 媒体资源处理器
        // 10kb以下数据直接转为base64,否则置于media/文件夹中
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1024 * 10,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        // 字体资源处理器
        // 10kb以下数据直接转为base64,否则置于fonts/文件夹中
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1024 * 10,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },

  // node: {
  //   // prevent webpack from injecting useless setImmediate polyfill because Vue
  //   // source contains it (although only uses it if it's native).
  //   setImmediate: false,
  //   // prevent webpack from injecting mocks to Node native modules
  //   // that does not make sense for the client
  //   dgram: 'empty',
  //   fs: 'empty',
  //   net: 'empty',
  //   tls: 'empty',
  //   child_process: 'empty'
  // }
};



module.exports = webpackBase;

