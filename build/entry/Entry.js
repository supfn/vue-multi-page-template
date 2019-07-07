const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const { ROOT_DIR, PAGES_DIR } = require('../../config/path-const.js');

class Entry {

  constructor() {
    this._all = this._getAllDeep();
    this._changeFiles = null;
    this._effectiveFiles = null;
  }

  _getAll() {
    return fs.readdirSync(PAGES_DIR).reduce((pre, next) => {
      pre[next] = path.relative(ROOT_DIR, path.join(PAGES_DIR, next));
      return pre;
    }, {});
  }

  _getAllDeep() {
    const ENTRY_JS_FILE = "index.js";
    return require('glob').sync(`${PAGES_DIR}/**/${ENTRY_JS_FILE}`)
      .map(p => p.split(ENTRY_JS_FILE)[0])
      .reduce((pre, next) => {
        let key = path.relative(PAGES_DIR, next).split(path.sep).join('/');
        pre[key] = path.relative(ROOT_DIR, next).split(path.sep).join('/');
        return pre;
      }, {});
  }

  get changeFiles() {
    if (this._changeFiles) {
      return this._changeFiles;
    }

    childProcess.execSync(`cd ${ROOT_DIR} && git add . `);
    let lines = childProcess.execSync(`git status --porcelain`, 'utf8').toString().split('\n');
    return (this._changeFiles = lines.filter(line => line.length).reduce((pre, next) => {
      let line = next.match(/(..?)\s+(.*)/);
      if (line[1].trim() === 'R') {
        let renamed = /^(.+) \-> (.+)$/.exec(line[2]);
        return pre.concat(renamed[1], renamed[2]);
      } else {
        return pre.concat(line[2]);
      }
    }, []));
  }

  get effectiveFiles() {
    return this._effectiveFiles || (this._effectiveFiles = this.changeFiles.filter(file => file.startsWith('src/')));
  }

  get hasCommonChange() {
    return this.effectiveFiles.find(file => !file.startsWith('src/pages/'));
  }

  getAllEntries() {
    return this._all;
  }

  getChangedEntries() {
    if (this.hasCommonChange) {
      return this._all;
    } else {
      let changedEntries = {};
      Object.keys(this._all).forEach(key => {
        for (let l = this.effectiveFiles.length, i = 0; i < l; i++) {
          if (this.effectiveFiles[i].startsWith(this._all[key] + '/')) {
            changedEntries[key] = this._all[key];
            break;
          }
        }
      });
      return changedEntries;
    }
  }

  getSingleEntry(dir) {
    return { [dir]: this._all[dir] };
  }
}

module.exports = Entry;





