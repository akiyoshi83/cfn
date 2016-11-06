'use strict'

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const confPath = path.join(process.cwd(), 'cfn.json');

const Utils = require('./utils');
const Builder = require('./builder');

AWS.config.apiVersions = {
  cloudformation: '2010-05-15',
};

module.exports = class Cfn {
  constructor() {
    this.cfnConf = {};
    if (fs.existsSync(confPath)) {
      this.cfnConf = require(confPath);
    }
    this.region = this.cfnConf.region || '';
    this.templateName = this.cfnConf.templateName || '';
    this.stackName = this.cfnConf.stackName || '';
    this.s3 = this.cfnConf.s3 || {};
    this.s3.bucket = this.s3.bucket || '';
    this.s3.key = this.s3.key || this.templateName;
    this.src = this.cfnConf.src || '';
    this.dist = this.cfnConf.dist || '';
    this.tags = this.cfnConf.tags || [];
  }

  build() {
    let builder = new Builder(this.cfnConf);
    builder.build().then(fpath => {
      console.log(`[build] ${fpath}`);
    });
  }

  validate() {
    let cf = new AWS.CloudFormation({ region: this.region });
    let fpath = Utils.distPath(this.dist, this.templateName);
    fs.readFile(fpath, { encoding: 'utf8' }, function(err, data) {
      if (err) { console.log(err); process.exit(1); }
      cf.validateTemplate({ TemplateBody: data }, function(err, data) {
        if (err) { console.log(err); process.exit(1); }
        console.log(data);
      });
    });
  }

  upload() {
    let s3 = new AWS.S3();
    let fpath = Utils.distPath(this.dist, this.templateName);
    let tmplRs = fs.createReadStream(fpath);
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

  update() {
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
      cf.updateStack(params, function(err, data) {
        if (err) { console.log(err); process.exit(1); }
        console.log(data);
      });
    });
  }

  describe() {
    let cf = new AWS.CloudFormation({ region: this.region });
    var params = {
      StackName: this.stackName,
    };
    cf.describeStacks(params, function(err, data) {
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
