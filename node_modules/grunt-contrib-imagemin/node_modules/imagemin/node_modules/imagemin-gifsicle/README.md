# imagemin-gifsicle [![Build Status](https://travis-ci.org/imagemin/imagemin-gifsicle.svg?branch=master)](https://travis-ci.org/imagemin/imagemin-gifsicle)

> gifsicle image-min plugin


## Install

```sh
$ npm install --save imagemin-gifsicle
```


## Usage

```js
var Imagemin = require('image-min');
var gifsicle = require('imagemin-gifsicle');

var imagemin = new Imagemin()
	.src('foo.gif')
	.dest('foo-optimized.gif')
	.use(gifsicle({ interlaced: true }));

imagemin.optimize();
```


## Options

### interlaced

Type: `Boolean`  
Default: `false`

Interlace gif for progressive rendering.


## License

MIT © [imagemin](https://github.com/imagemin)
