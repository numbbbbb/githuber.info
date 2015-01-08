/*!
 * strip-dirs | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/node-strip-dirs
*/

'use strict';

var path = require('path');

var isAbsolutePath = require('is-absolute');
var isNaturalNumber = require('is-natural-number');

module.exports = function stripDirs(pathStr, count, option) {
  option = option || {narrow: false};

  if (arguments.length < 2) {
    throw new Error('Expecting two arguments and more. (path, count[, option])');
  }

  if (typeof pathStr !== 'string') {
    throw new TypeError(pathStr + ' is not a string. First argument must be a path string.');
  }
  if (isAbsolutePath(pathStr)) {
    throw new TypeError(pathStr + ' is an absolute path. A relative path required.');
  }

  if (!isNaturalNumber(count, true)) {
    throw new Error('Second argument must be a natural number or 0.');
  }

  var pathComponents = path.normalize(pathStr).split(path.sep);
  if (pathComponents.length > 1 && pathComponents[0] === '.') {
    pathComponents.shift();
  }

  if (count > pathComponents.length - 1) {
    if (option.narrow) {
      throw new RangeError('Cannot strip more directories than there are.');
    }
    count = pathComponents.length - 1;
  }

  return path.join.apply(null, pathComponents.slice(count));
};
