// Template version: 1.1.3
// see http://vuejs-templates.github.io/webpack for documentation.
const path = require("path");
const {ROOT_DIR, DIST_DIR, PAGES_DIR, SRC_DIR} = require('./path-const.js');

module.exports = {
  build: {
    env: require("./prod.env"),
    index: path.join(DIST_DIR, "home.html"),

    assetsRoot: DIST_DIR,
    assetsSubDirectory: '',
    assetsPublicPath: "../../",

    productionSourceMap: false, // 设成true会生成map文件方便前端调试，但为了防止反爬虫代码被破解，这里用了false
    devtool: '#source-map', //false,

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ["js", "css", "html"],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,

    inlineSource: true, // 是否内联编译js,css到html中
  },

  dev: {
    env: require("./dev.env"),

    assetsSubDirectory: '',
    assetsPublicPath: '/',

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 9800, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    proxyTable: {
      filter: function (pathname, req) {
        return (pathname.match('^/api') && req.method === 'GET'); //命中规则就自动转发到target地址上去
      },
      config: {
        target: 'http://api.example.cn/', // 本地mock服务器地址
        changeOrigin: true, // needed for virtual hosted sites
        ws: true // proxy websockets
      }
    },

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: false
  },

  rootDir: ROOT_DIR,
  pagesDir: PAGES_DIR,
  distDir: DIST_DIR,
  srcDir: SRC_DIR,

};
