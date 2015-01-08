#!/usr/bin/env node
'use strict';

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    c: 'count',
    n: 'narrow',
    h: 'help',
    v: 'version'
  },
  string: ['_'],
  boolean: ['narrow', 'help', 'version']
});

function help() {
  var chalk = require('chalk');
  var pkg = require('./package.json');

  console.log([
    chalk.cyan(pkg.name) + chalk.gray(' v' + pkg.version),
    pkg.description + '.',
    '',
    'Usage 1: $ strip-dirs <string> --count(or -c) <number> [--narrow(or -n)]',
    'Usage 2: $ echo <string> | strip-dirs --count(or -c) <number> [--narrow(or -n)]',
    '',
    'Flags:',
    chalk.yellow('--count,   -c') + '  Number of directories to strip from the path',
    chalk.yellow('--narrow,  -n') + '  Disallow surplus count of directory level',
    chalk.yellow('--version, -v') + '  Print version',
    chalk.yellow('--help,    -h') + '  Print usage information'
  ].join('\n'));
}

function printErr(msg) {
  process.stderr.write(msg + '\n', function() {
    process.exit(1);
  });
}

function run(path) {
  if (path) {
    if (argv.count !== undefined) {
      if (typeof argv.count !== 'number') {
        printErr('--count (or -c) option must be a number.');
      } else {
        var stripDirs = require('./');
        try {
          console.log(stripDirs(path.trim(), argv.count, {narrow: argv.narrow}));
        } catch (e) {
          printErr(e.message);
        }
      }
    } else {
      printErr('--count (or -c) option required.');
    }
  } else if (!process.stdin.isTTY) {
    console.log('.');
  } else {
    help();
  }
}

if (argv.version) {
  console.log(require('./package.json').version);
} else if (argv.help) {
  help();
} else if (process.stdin.isTTY) {
  run(argv._[0]);
} else {
  require('get-stdin')(run);
}
