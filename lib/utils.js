const AWS = require('aws-sdk');
const path = require('path');

var Utils = {

  distPath: function(dir, src) {
    let basename = path.basename(src);
    let exts = basename.split('.');
    let fname = exts.shift();
    if (exts.length) {
      fname = `${fname}.${exts[0]}`
    }
    return path.join(dir, fname);
  }
}

module.exports = Utils;
