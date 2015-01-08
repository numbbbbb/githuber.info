'use strict';
module.exports = function (buf) {
	return /<svg[^>]*>/.test(buf);
};
