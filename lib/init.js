'use strict'

const fs = require('fs');
const path = require('path');

const template = `{
    "AWSTemplateFormatVersion": "2010-09-09",
    "Description": "CloudFormation template",
    "Parameters": {},
    "Resources": {},
    "Mappings": {},
    "Outputs": {}
}
`

const config = `{
  "region": "us-east-1",
  "templatePath": "./template.json",
  "stackName": "YOUR_STACK_NAME",
  "s3": {
    "bucket": "YOUR_BUCKET_NAME",
    "key": "path/to/template.json"
  }
}
`

module.exports = function init(dir) {
  fs.writeFileSync(path.join(dir, 'template.json'), template, { encoding: 'utf8' });
  console.log("create template.json");
  fs.writeFileSync(path.join(dir, 'cfn.json'), config, { encoding: 'utf8' });
  console.log("create cfn.json");
}
