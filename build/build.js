process.env.NODE_ENV = 'production';
require('./check-versions')();
let shell = require('shelljs');
let ora = require('ora');
let path = require('path');
let chalk = require('chalk');
let webpack = require('webpack');
let fs = require('fs');
const gzipSize = require('gzip-size');

let getEntries = require('./entry/getEntries.js');


getEntries().then(entries => {
  process.env.WEBPACK_ENTRY = JSON.stringify(entries);
  let webpackConfig = require('./webpack.prod.conf');
  let spinner = ora('building for production...');
  let { DIST_DIR, ROOT_DIR } = require('../config/path-const.js');
  let FileSignature = require('./FileSignature.js');

  console.log(chalk.blue('\nentries:', JSON.stringify(entries, null, 2)));

  console.log('\n');
  Object.keys(entries).forEach(key => {
    let rmDir = path.join(DIST_DIR, key);
    console.log(chalk.red(`rm ${rmDir}`));
    shell.rm('-rf', rmDir);
    const middlePath = 'img/src/pages';
    let rmDirImg = path.join(DIST_DIR, middlePath, key);
    console.log(chalk.yellow(`rm ${rmDirImg}`));
    shell.rm('-rf', rmDirImg);
  });
  console.log('\n');

  spinner.start();

  webpack(webpackConfig, (err, stats) => {
    spinner.stop();
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n');

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
    }


    // md5 build html & output gzip size
    Object.keys(entries).forEach(key => {
      let fromFile = path.join(DIST_DIR, key + '/index.html');
      FileSignature.signMD5(fromFile, fromFile + '.md5');
      let gzipFileSize = gzipSize.sync(fs.readFileSync(fromFile, 'utf8')) / 1024;
      console.log(chalk.blueBright(`${key + '/index.html'} gzip后的大小为： ${gzipFileSize} kb`));
    });

    // require('child_process').execFile('node', ['build/distServer.js'], {cwd: ROOT_DIR}, (error, stdout, stderr) => {
    //   if (error) {
    //     throw error;
    //   }
    // });

    console.log(chalk.cyan('\n\n  Build complete.\n'));

  });

});
