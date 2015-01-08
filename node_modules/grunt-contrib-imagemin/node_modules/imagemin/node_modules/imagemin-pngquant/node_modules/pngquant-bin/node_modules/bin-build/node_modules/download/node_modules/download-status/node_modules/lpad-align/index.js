'use strict';

var longest = require('longest');
var lpad = require('lpad');

/**
 * Left pad a string to align with the longest string in an array
 *
 * @param {String} str
 * @param {Array} arr
 * @param {Number} indent
 * @api public
 */

module.exports = function (str, arr, indent) {
	if (!arr || !Array.isArray(arr)) {
		throw new Error('`arr` is required');
	}

	var len = longest(arr).length;
	return lpad(str, new Array((indent || 0) + 1 + len - str.length).join(' '));
};
