const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PAGES_DIR = path.join(SRC_DIR, 'pages');


module.exports = {
  ROOT_DIR,
  SRC_DIR,
  PAGES_DIR,
  DIST_DIR,
};


