'use strict'

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const cfnConf = require(path.join(process.cwd(), 'cfn.json'));

AWS.config.apiVersions = {
  cloudformation: '2010-05-15',
};

module.exports = class Cfn {
  constructor() {
    this.region = cfnConf.region || '';
    this.templatePath = cfnConf.templatePath || '';
    this.s3 = cfnConf.s3 || {};
    this.s3.bucket = this.s3.bucket || '';
    this.s3.key = this.s3.key || this.templatePath;
  }

  build() {
    console.log('TODO implement build');
  }

  validate() {
    let cf = new AWS.CloudFormation({ region: this.region });
    fs.readFile(this.templatePath, { encoding: 'utf8' }, function(err, data) {
      if (err) { console.log(err); process.exit(1); }
      cf.validateTemplate({ TemplateBody: data }, function(err, data) {
        if (err) { console.log(err); process.exit(1); }
        console.log(data);
      });
    });
  }

  upload() {
    let s3 = new AWS.S3();
    let tmplRs = fs.createReadStream(this.templatePath);
    s3.upload({ Bucket: this.s3.bucket, Key: this.s3.key, Body: tmplRs}, (err, data) => {
      if (err) { console.log(err); process.exit(1); }
      console.log(data);
    });
  }
}
