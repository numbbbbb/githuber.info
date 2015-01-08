'use strict';

var ExecBuffer = require('exec-buffer');
var gifsicle = require('gifsicle').path;
var isGif = require('is-gif');

/**
 * gifsicle imagemin plugin
 *
 * @param {Object} opts
 * @api public
 */

module.exports = function (opts) {
	opts = opts || {};

	return function (file, imagemin, cb) {
		if (!isGif(file.contents)) {
			cb();
			return;
		}

		var exec = new ExecBuffer();
		var args = ['-w'];

		if (opts.interlaced) {
			args.push('--interlace');
		}

		exec
			.use(gifsicle, args.concat(['-o', exec.dest(), exec.src()]))
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
