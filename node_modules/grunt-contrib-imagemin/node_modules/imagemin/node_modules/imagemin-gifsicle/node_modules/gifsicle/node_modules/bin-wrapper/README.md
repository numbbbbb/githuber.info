# bin-wrapper [![Build Status](http://img.shields.io/travis/kevva/bin-wrapper.svg?style=flat)](https://travis-ci.org/kevva/bin-wrapper)

> Binary wrapper for Node.js that makes your programs seamlessly available as local dependencies

## Install

```sh
$ npm install --save bin-wrapper
```

## Usage

```js
var BinWrapper = require('bin-wrapper');

var bin = new BinWrapper()
	.src('https://raw.github.com/yeoman/node-jpegtran-bin/0.2.4/vendor/win/x64/jpegtran.exe', 'win32', 'x64')
	.src('https://raw.github.com/yeoman/node-jpegtran-bin/0.2.4/vendor/win/x64/libjpeg-62.dll', 'win32', 'x64')
	.dest('vendor')
	.use('jpegtran.exe')
	.version('>=1.3.0');

bin.run(['--version'], function (err) {
	if (err) {
		throw err;
	}

	console.log('jpegtran is working');
});
```

Get the path to your binary with `bin.path()`:

```js
console.log(bin.path()); // => path/to/vendor/jpegtran.exe
```

## API

### new BinWrapper()

Creates a new `BinWrapper` instance.

### .src(url, os, arch)

Accepts a URL pointing to a file to download.

### .dest(dest)

Accepts a path which the files will be downloaded to.

### .use(bin)

Define which file to use as the binary.

### .path()

Get the full path to your binary.

### .version(range)

Define a [semver range](https://github.com/isaacs/node-semver#ranges) to check 
the binary against.

### .run(cmd, cb)

Runs the search for the binary. If no binary is found it will download the file using the URL
provided in `.src()`. It will also check that the binary is working by running it using `cmd`
and checking it's exit code.

## License

MIT © [Kevin Mårtensson](http://kevinmartensson.com)
