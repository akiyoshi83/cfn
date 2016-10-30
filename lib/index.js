'use strict'

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const confPath = path.join(process.cwd(), 'cfn.json');

AWS.config.apiVersions = {
  cloudformation: '2010-05-15',
};

module.exports = class Cfn {
  constructor() {
    let cfnConf = {};
    if (fs.existsSync(confPath)) {
      cfnConf = require(confPath);
    }
    this.region = cfnConf.region || '';
    this.templatePath = cfnConf.templatePath || '';
    this.stackName = cfnConf.stackName || '';
    this.s3 = cfnConf.s3 || {};
    this.s3.bucket = this.s3.bucket || '';
    this.s3.key = this.s3.key || this.templatePath;
    this.tags = cfnConf.tags || [];
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

  create() {
    let self = this;
    let cf = new AWS.CloudFormation({ region: this.region });
    let parametersPath = path.join(process.cwd(), 'parameters.json');
    let parameters = [];
    if (fs.existsSync(parametersPath)) {
      parameters = require(parametersPath);
    }
    this.getS3Url().then(function(s3url) {
      var params = {
        StackName: self.stackName,
        Parameters: parameters,
        Tags: self.tags,
        TemplateURL: s3url
      };
      cf.createStack(params, function(err, data) {
        if (err) { console.log(err); process.exit(1); }
        console.log(data);
      });
    });
  }

  delete() {
    let cf = new AWS.CloudFormation({ region: this.region });
    var params = {
      StackName: this.stackName,
    };
    cf.deleteStack(params, function(err, data) {
      if (err) { console.log(err); process.exit(1); }
      console.log(data);
    });
  }

  getS3Url() {
    let self = this;
    let s3 = new AWS.S3();
    return new Promise(function(resolve, reject) {
      s3.getBucketLocation({ Bucket: self.s3.bucket }, function(err, data) {
        if (err) { reject(err); }
        let region = data.LocationConstraint;
        let s3url = [ `https://s3-${region}.amazonaws.com`, self.s3.bucket, self.s3.key ].join('/');
        resolve(s3url);
      });
    });
  }
}
