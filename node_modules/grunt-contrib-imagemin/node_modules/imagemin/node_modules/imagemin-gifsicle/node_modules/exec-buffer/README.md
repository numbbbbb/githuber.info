# exec-buffer [![Build Status](https://travis-ci.org/kevva/exec-buffer.svg?branch=master)](https://travis-ci.org/kevva/exec-buffer)

> Run a Buffer through a child process

## Install

```ba
$ npm install --save exec-buffer
```

## Usage

```js
var ExecBuffer = require('exec-buffer');
var fs = require('fs');
var gifsicle = require('gifsicle').path;

var execBuffer = new ExecBuffer();

execBuffer
	.use(gifsicle, ['-o', execBuffer.dest(), execBuffer.src()])
	.run(fs.readFileSync('test.gif'), function (err, data) {
		if (err) {
			throw err;
		}

		console.log(data);
		// <Buffer 47 49 46 38 37 61 ...>
	});
});
```

## API

### new ExecBuffer(opts)

Creates a new `ExecBuffer` instance. Available options are:

* `stderr`: Whether to add `stderr` output to `err` in the callback. Defaults to `true`.

### .use(bin, args)

#### bin

Type: `String`

Path to the binary.

#### args

Type: `Array`

Arguments to run the binary with.

### .src(path)

Type: `String`

Set or get the temporary source path.

### .dest(path)

Type: `String`

Set or get the temporary destination path.

### .run(buf, cb)

#### buf

Type: `Buffer`

The `Buffer` to be ran through the child process.

#### cb(err, data)

Type: `Function`

Returns a `Buffer` with the new data.

## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
