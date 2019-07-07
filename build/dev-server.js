require('./check-versions')();

const config = require('../config');
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

const opn = require('opn');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
// const proxyMiddleware = require('http-proxy-middleware');

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port;
// automatically open browser, if not set will be false
const autoOpenBrowser = config.dev.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
// const proxyTable = config.dev.proxyTable

const app = express();


let getEntries = require('./entry/getEntries.js');

// getEntries().then(entries => {
//
// });

let entries = getEntries();

process.env.WEBPACK_ENTRY = JSON.stringify(entries);

const webpackConfig = require('./webpack.dev.conf');
const compiler = webpack(webpackConfig);
// https://github.com/webpack/webpack-dev-middleware
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: false,
  stats: {
    colors: true,
    chunks: false,
    modules: false, // 不显示那一串涉及到的module列表，https://webpack.js.org/configuration/stats/
    inline: true // 当源代码改变时，自动刷新页面，通过强制刷新来避免代码修改后页面没跟着热加载的情况
  },
  progress: true
});

// https://github.com/webpack-contrib/webpack-hot-middleware
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
});
// force page reload when html-webpack-plugin template changes
// currently disabled until this is resolved:
// https://github.com/jantimon/html-webpack-plugin/issues/680
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// proxy api requests
// Object.keys(proxyTable).forEach(function (context) {
//   let options = proxyTable[context]
//   if (typeof options === 'string') {
//     options = {target: options}
//   }
//   app.use(proxyMiddleware(options.filter || context, options))
// })

// app.use(proxyMiddleware(config.dev.proxyTable.filter, config.dev.proxyTable.config));

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./'));

const uri = 'http://localhost:' + port;
// 直接打开最新添加的项目,方便调试
let lastedProjectIndex = Object.keys(entries).length - 1;
let lastedProjectUri = uri + `/` + Object.keys(entries)[lastedProjectIndex] + '/index.html';
console.log(`lasted_project_uri => ${lastedProjectUri}`);


let server;
let portfinder = require('portfinder');
portfinder.basePort = port;

console.log('> Starting dev server...');
let readyPromise = new Promise((resolve, reject) => {
  devMiddleware.waitUntilValid(() => {
    portfinder.getPort((err, port) => {
      if (err) {
        reject(err);
      }
      process.env.PORT = port;
      console.log('> Listening at ' + uri + '\n');
      // when env is testing, don't need open it
      if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(lastedProjectUri);
      }
      server = app.listen(port);
      resolve();
    });
  });
});

// module.exports = {
//     ready: readyPromise,
//     close: () => {
//         server.close()
//     }
// };
