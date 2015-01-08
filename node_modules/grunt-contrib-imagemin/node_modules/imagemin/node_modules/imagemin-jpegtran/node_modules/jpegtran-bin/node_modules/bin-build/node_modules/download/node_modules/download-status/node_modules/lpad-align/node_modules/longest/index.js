/**
 * longest item in an array
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(arr) {
  var c = 0,
    len = 0,
    l = 0,
    idx = arr.length;
  if (idx) {
    while (idx--) {
      len = arr[idx].length;
      if (len > c) {
        l = idx;
        c = len;
      }
    }
  }
  return arr[l];
};