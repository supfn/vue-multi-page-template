const crypto = require('crypto');
const fs = require('fs');

class FileSignature {

  static md5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
  }

  static signMD5(fromFile, toFile) {
    let encoding = 'utf8';
    fs.writeFileSync(toFile, this.md5(fs.readFileSync(fromFile, encoding)), encoding);
  }

}

module.exports = FileSignature;
