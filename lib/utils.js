const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

var Utils = {

  mkdir: function(dirpath) {
    if (!fs.existsSync(dirpath)) {
      fs.mkdirSync(dirpath);
    }
  },

  extensions: function(src) {
    let basename = path.basename(src);
    return basename.split('.').slice(1);
  },

  distPath: function(dir, src) {
    let basename = path.basename(src);
    let exts = basename.split('.');
    let fname = exts.shift();
    if (exts.length) {
      fname = `${fname}.${exts[0]}`
    }
    return path.join(dir, fname);
  },

  describeRegions: function() {
    var ec2 = new AWS.EC2({ region: 'us-east-1' });
    return new Promise((resolve, reject) => {
      ec2.describeRegions({}, (err, data) => {
        if (err) { reject(err); }
        resolve(data.Regions);
      });
    });
  }
}

module.exports = Utils;
