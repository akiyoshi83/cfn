#!/usr/bin/env node

const argv = require('argv');
const Cfn = require('../lib/index.js');
const init = require('../lib/init.js');

argv.mod({
  mod: 'init',
  description: 'initialize cfn',
  options: [
    { name: 'help', short: 'h', type: 'boolean', description: '', example: '' }
  ]
});

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

argv.mod({
  mod: 'create',
  description: 'create stack from template at S3',
  options: [
    { name: 'help', short: 'h', type: 'boolean', description: '', example: '' }
  ]
});

argv.mod({
  mod: 'delete',
  description: 'delete stack',
  options: [
    { name: 'help', short: 'h', type: 'boolean', description: '', example: '' }
  ]
});

argv.mod({
  mod: 'update',
  description: 'update stack',
  options: [
    { name: 'help', short: 'h', type: 'boolean', description: '', example: '' }
  ]
});

argv.mod({
  mod: 'describe',
  description: 'describe stack',
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
  case 'init': { init(process.cwd()); break; }
  case 'build': { cfn.build(); break; }
  case 'validate': { cfn.validate(); break; }
  case 'upload': { cfn.upload(); break; }
  case 'create': { cfn.create(); break; }
  case 'delete': { cfn.delete(); break; }
  case 'update': { cfn.update(); break; }
  case 'describe': { cfn.describe(); break; }
  default: { argv.help(); break; }
}

