# imagemin-jpegtran [![Build Status](https://travis-ci.org/imagemin/imagemin-jpegtran.svg?branch=master)](https://travis-ci.org/imagemin/imagemin-jpegtran)

> jpegtran imagemin plugin


## Install

```bash
$ npm install --save imagemin-jpegtran
```


## Usage

```js
var Imagemin = require('imagemin');
var jpegtran = require('imagemin-jpegtran');

var imagemin = new Imagemin()
	.src('foo.jpg')
	.dest('foo-optimized.jpg')
	.use(jpegtran({ progressive: true }));

imagemin.optimize();
```


## Options

### progressive

Type: `Boolean`  
Default: `false`

Lossless conversion to progressive.


## License

MIT © [imagemin](https://github.com/imagemin)
