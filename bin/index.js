#!/usr/bin/env node

const argv = require('argv');
const Cfn = require('../lib/index.js');

argv.mod({
  mod: 'build',
  description: 'build template',
  options: [
    { name: 'help', short: 'h', type: 'boolean', description: '', example: '' }
  ]
});

argv.mod({
  mod: 'validate',
  description: 'validate template',
  options: [
    { name: 'help', short: 'h', type: 'boolean', description: '', example: '' }
  ]
});

argv.mod({
  mod: 'upload',
  description: 'upload CloudFormation Template to S3 bucket',
  options: [
    { name: 'help', short: 'h', type: 'boolean', description: '', example: '' }
  ]
});

const args = argv.run();

if (args.options.help) {
  argv.help();
  process.exit(0);
}

let cfn = new Cfn();

switch (args.mod) {
  case 'build': { cfn.build(); break; }
  case 'validate': { cfn.validate(); break; }
  case 'upload': { cfn.upload(); break; }
  default: { argv.help(); break; }
}

