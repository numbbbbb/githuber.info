# find-file [![Build Status](https://travis-ci.org/kevva/find-file.svg?branch=master)](https://travis-ci.org/kevva/find-file)

> Search for a file in an array of paths

## Install

```bash
$ npm install --save find-file
```

## Usage

```js
var Find = require('find-file');

var find = new Find()
    .name('foo.jpg')
    .where(['./images', './media']);

find.run(function (err, files) {
    if (err) {
        throw err;
    }

    console.log(files);
    //=> [{ path: 'images/foo.jpg', name: 'foo.jpg', ...}]
});
```

## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
