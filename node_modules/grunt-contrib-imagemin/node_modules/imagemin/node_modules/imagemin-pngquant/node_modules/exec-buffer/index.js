'use strict';

var execFile = require('child_process').execFile;
var fs = require('fs');
var rm = require('rimraf');
var tempfile = require('tempfile');

/**
 * Run a buffer through a child process
 *
 * @param {Object} opts
 * @api public
 */

function ExecBuffer(opts) {
	if (!(this instanceof ExecBuffer)) {
		return new ExecBuffer(opts);
	}

	this.opts = opts || {};
	this.opts.stderr = this.opts.stderr !== false;
	this.src(tempfile());
	this.dest(tempfile());
}

/**
 * Add a child process to use
 *
 * @param {String} bin
 * @param {Array} args
 * @api public
 */

ExecBuffer.prototype.use = function (bin, args) {
	this.bin = bin;
	this.args = args;
	return this;
};

/**
 * Get or set the temp source path
 *
 * @param {String} path
 * @api public
 */

ExecBuffer.prototype.src = function (path) {
	if (!arguments.length) {
		return this._src;
	}

	this._src = path;
	return this;
};

/**
 * Get or set the temp destination path
 *
 * @param {String} path
 * @api public
 */

ExecBuffer.prototype.dest = function (path) {
	if (!arguments.length) {
		return this._dest;
	}

	this._dest = path;
	return this;
};

/**
 * Run buffer through the child process
 *
 * @param {Buffer} buf
 * @param {Function} cb
 * @api public
 */

ExecBuffer.prototype.run = function (buf, cb) {
	var self = this;
	var src = this.src();
	var dest = this.dest();

	fs.writeFile(src, buf, function (err) {
		if (err) {
			cb(err);
			return;
		}

		execFile(self.bin, self.args, function (err, stdout, stderr) {
			if (err) {
				cb(err);
				return;
			}

			if (self.opts.stderr && stderr) {
				cb(stderr);
				return;
			}

			fs.readFile(dest, function (err, data) {
				if (err) {
					cb(err);
					return;
				}

				rm(src, function (err) {
					if (err) {
						cb(err);
						return;
					}

					rm(dest, function (err) {
						if (err) {
							cb(err);
							return;
						}

						cb(null, data);
					});
				});
			});
		});
	});
};

/**
 * Module exports
 */

module.exports = ExecBuffer;
