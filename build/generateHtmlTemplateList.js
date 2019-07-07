let config = require('../config/index');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let path = require('path');

/**
 * 生成chunks配置
 * @param entry  入口文件
 * @param env 当前环境配置信息
 * @returns {*[]}
 */
function generateChunks(entry, env) {
  let chunks = [entry, 'manifest', 'vendor'];
  // 当环境不为production时 额外注入热加载代码 以实现文件的实时更新
  env.NODE_ENV !== 'production' && chunks.push('./build/dev-client');
  return chunks;
}

// 生成html模版配置
function generateHtmlTemplateList(env, entries) {
  const TEMPLATE_HTML_FILE = 'index.html';
  let templateList = [];
  for (let entry of Object.keys(entries)) {
    let htmlTemplateConfig = {
      filename: path.join(config.build.assetsSubDirectory, entry + '/index.html'),
      template: path.join(entries[entry], TEMPLATE_HTML_FILE),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      ...(config.build.inlineSource ? { inlineSource: '.(js|css)$' } : {}),
      // inlineSource: '.(js|css)$', // embed all javascript and css inline
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // 生成html的时候只需要引入项目js代码，公共js代码vendor即可，不需要再引入资源文件mainfest了
      chunks: generateChunks(entry, env),
      chunksSortMode: 'dependency'// 按照依赖关系注入script标签，否则【一定】会造成代码无法运行！
    };
    templateList.push(
      // generate dist index.html with correct asset hash for caching.
      // you can customize output by editing /index.html
      // see https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin(htmlTemplateConfig),
    );
  }
  return templateList;
}


module.exports = generateHtmlTemplateList;
