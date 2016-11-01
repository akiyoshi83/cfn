'use strict'

const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

class Builder {
  constructor(conf) {
    this.templatePath = conf.templatePath;
    this.dist = conf.dist;
    if (!this.templatePath) {
      console.error(`[Builder] template path required`);
      process.exit(1);
    }
    if (!this.dist) {
      console.error(`[Builder] dist path required`);
      process.exit(1);
    }
  }

  build() {
    let self = this;
    let cwd = process.cwd();
    let srcDir = path.dirname(this.templatePath);
    self.mkDistDir();

    return new Promise((resolve, reject) => {
      self.readSrc().then((src) => {
        // change current directory temporarily for `include` in template
        process.chdir(srcDir);
        let result = self.applyConvert(src);
        process.chdir(cwd);

        self.writeDist(result).then(resolve);
      });
    });
  }

  readSrc() {
    let self = this;
    return new Promise((resolve, reject) => {
      fs.readFile(self.templatePath, { encoding: 'utf8' }, function(err, data) {
        if (err) { reject(err); }
        resolve(data);
      });
    });
  }

  applyConvert(src) {
    let exts = this.extensions(this.templatePath).reverse();
    let result = exts.reduce((src, ext) => {
      let fn = Builder.converter[ext];
      if (typeof fn === 'function') {
        return fn(src);
      } else {
        return src;
      }
    }, src);

    let fmt = Builder.formatter[exts[exts.length - 1]];
    if (typeof fmt === 'function') {
      result = fmt(result);
    }
    return result;
  }

  writeDist(data) {
    let fpath = this.distPath(this.dist, this.templatePath);
    return new Promise((resolve, reject) => {
      fs.writeFile(fpath, data, { encoding: 'utf8' }, function(err, data) {
        if (err) { reject(err); }
        resolve(fpath);
      });
    });
  }

  extensions(src) {
    let basename = path.basename(src);
    return basename.split('.').slice(1);
  }

  distPath(dir, src) {
    let basename = path.basename(src);
    let exts = basename.split('.');
    let fname = exts.shift();
    if (exts.length) {
      fname = `${fname}.${exts[0]}`
    }
    return path.join(dir, fname);
  }

  mkDistDir() {
    if (!fs.existsSync(this.dist)) {
      fs.mkdirSync(this.dist);
    }
  }
}

Builder.converter = {
  ejs: function convert_ejs(src) {
    return ejs.render(src, {}, { filename: 'test' });
  }
}

Builder.formatter = {
  json: function format_json(src) {
    return JSON.stringify(JSON.parse(src), null, 2);;
  }
}

module.exports = Builder;
