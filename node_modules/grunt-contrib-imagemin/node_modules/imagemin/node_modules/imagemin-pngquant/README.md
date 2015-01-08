# imagemin-pngquant [![Build Status](https://travis-ci.org/imagemin/imagemin-pngquant.svg?branch=master)](https://travis-ci.org/imagemin/imagemin-pngquant)

> pngquant image-min plugin


## Install

```sh
$ npm install --save imagemin-pngquant
```


## Usage

```js
var Imagemin = require('image-min');
var pngquant = require('imagemin-pngquant');

var imagemin = new Imagemin()
	.src('foo.png')
	.dest('foo-optimized.png')
	.use(pngquant({ quality: '65-80', speed: 4 }));

imagemin.optimize();
```


## Options

### floyd

Type: `Number`  
Default: `0.5`

Controls level of dithering (0 = none, 1 = full).

### nofs

Type: `Boolean`  
Default: `false`

Disable Floyd-Steinberg dithering.

### posterize

Type: `Number`  
Default: `undefined`

Reduce precision of the palette by number of bits. Use when the image will be 
displayed on low-depth screens (e.g. 16-bit displays or compressed textures).

### quality

Type: `String`  
Default: `undefined`

Instructs pngquant to use the least amount of colors required to meet or exceed 
the max quality. If conversion results in quality below the min quality the 
image won't be saved.

Min and max are numbers in range 0 (worst) to 100 (perfect), similar to JPEG.

### speed

Type: `Number`  
Default: `3`

Speed/quality trade-off from `1` (brute-force) to `10` (fastest). Speed `10` has 
5% lower quality, but is 8 times faster than the default.

### verbose

Type: `Boolean`  
Default: `false`

Print verbose status messages.


## License

MIT © [imagemin](https://github.com/imagemin)
