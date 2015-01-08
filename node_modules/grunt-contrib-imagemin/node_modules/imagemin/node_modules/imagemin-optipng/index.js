'use strict';

var ExecBuffer = require('exec-buffer');
var isPng = require('is-png');
var optipng = require('optipng-bin').path;

/**
 * optipng image-min plugin
 *
 * @param {Object} opts
 * @api public
 */

module.exports = function (opts) {
	opts = opts || {};

	return function (file, imagemin, cb) {
		if (!isPng(file.contents)) {
			cb();
			return;
		}

		var exec = new ExecBuffer();
		var args = ['-strip', 'all', '-quiet', '-clobber'];
		var optimizationLevel = opts.optimizationLevel || 3;

		if (typeof optimizationLevel === 'number') {
			args.push('-o', optimizationLevel);
		}

		exec
			.use(optipng, args.concat(['-out', exec.dest(), exec.src()]))
			.run(file.contents, function (err, buf) {
				if (err) {
					cb(err);
					return;
				}

				file.contents = buf;
				cb();
			});
	};
};
