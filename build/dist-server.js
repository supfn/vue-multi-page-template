let opn = require('opn');
let address = require('address');

const { DIST_DIR } = require("../config/path-const.js");
const PORT = 8000;
let listenCallBack = () => {
  console.log(`server listen in ${PORT}`);
  opn(`http://${address.ip()}:${PORT}`);
};


// let express = require('express');
// let app = express();
// app.use(express.static(DIST_DIR));
// app.listen(PORT, listenCallBack);


let http = require("http");
let url = require("url");
let path = require("path");
let fs = require("fs");

http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname;
  let fullPath = path.join(DIST_DIR, pathname);
  if (!fs.existsSync(fullPath)) {
    res.writeHead(404);
    res.end('404 Not Found');
  } else {
    let stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      viewFolder(req, res, fullPath, pathname);
    } else if (stat.isFile()) {
      fs.createReadStream(fullPath).pipe(res);
    } else {
      res.end(path + ' must be dir or file!');
    }
  }
}).listen(PORT, listenCallBack);


function readdir(fullPath) {
  return fs.readdirSync(fullPath).map(item => path.join(fullPath, item));
}

function viewFolder(req, res, fullPath, pathname) {
  let list = [];
  readdir(fullPath).forEach(item => {
    let name = path.basename(item);
    let stat = fs.statSync(item);
    list.push(`<a href="${path.join(pathname, name)}" style="line-height:20px;${(!stat.isFile() ? 'font-weight:bold;font-size: 18px;' : 'color:blue;font-size: 16px;')}">${name}</a>`);
  });
  res.end(`
            <!DOCTYPE html>
            <html>
            <head>
            <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
            <title>${pathname}</title>
            </head>
            <body>
            <div style="font-size: 20px;padding-bottom:20px;">${(pathname !== '/' ? '<a href="/">Index</a> ' : '') + pathname}</div>
            ${list.join('<br/>')}
            </body>
            </html>`);
}




