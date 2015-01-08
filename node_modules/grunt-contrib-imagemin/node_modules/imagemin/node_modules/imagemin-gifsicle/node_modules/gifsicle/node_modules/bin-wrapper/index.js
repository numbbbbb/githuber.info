'use strict';

var binCheck = require('bin-check');
var binVersionCheck = require('bin-version-check');
var Find = require('find-file');
var fs = require('fs');
var mkdir = require('mkdirp');
var path = require('path');
var status = require('download-status');
var which = require('npm-which');

/**
 * Initialize a new `BinWrapper`
 *
 * @param {Object} opts
 * @api public
 */

function BinWrapper(opts) {
	if (!(this instanceof BinWrapper)) {
		return new BinWrapper();
	}

	this.opts = opts || {};
	this._src = [];
}

/**
 * Add a file to download
 *
 * @param {String} src
 * @param {String} os
 * @param {String} arch
 * @api public
 */

BinWrapper.prototype.src = function (src, os, arch) {
	if (!arguments.length) {
		return this._src;
	}

	var obj = {
		url: src,
		os: os,
		arch: arch
	};

	this._src = this._src.concat(obj);
	return this;
};

/**
 * Define where to download the file to
 *
 * @param {String} dest
 * @api public
 */

BinWrapper.prototype.dest = function (dest) {
	if (!arguments.length) {
		return this._dest;
	}

	this._dest = dest;
	return this;
};

/**
 * Define which file to use as a binary
 *
 * @param {String} bin
 * @api public
 */

BinWrapper.prototype.use = function (bin) {
	if (!arguments.length) {
		return this._use;
	}

	this._use = bin;
	return this;
};

/**
 * Define a semver range to test the binary against
 *
 * @param {String} range
 * @api public
 */

BinWrapper.prototype.version = function (range) {
	if (!arguments.length) {
		return this._version;
	}

	this._version = range;
	return this;
};

/**
 * Get the binary path
 *
 * @api public
 */

BinWrapper.prototype.path = function () {
	var dir = path.join(this.dest(), path.dirname(this.use()));
	var bin = path.basename(this.use());
	return path.join(dir, bin);
};

/**
 * Run
 *
 * @param {Array} cmd
 * @param {Function} cb
 * @api public
 */

BinWrapper.prototype.run = function (cmd, cb) {
	var self = this;

	this._path(function (err, file) {
		if (err) {
			cb(err);
			return;
		}

		if (!file) {
			return self._get(function (err) {
				if (err) {
					cb(err);
					return;
				}

				self._check(cmd, function (err) {
					if (err) {
						cb(err);
						return;
					}

					cb();
				});
			});
		}

		self._check(cmd, function (err) {
			if (err) {
				cb(err);
				return;
			}

			cb();
		});
	});
};

/**
 * Check if binary is working
 *
 * @param {Array} cmd
 * @param {Function} cb
 * @api private
 */

BinWrapper.prototype._check = function (cmd, cb) {
	var self = this;

	binCheck(this.path(), cmd, function (err, works) {
		if (err) {
			cb(err);
			return;
		}

		if (!works) {
			cb(new Error('The `' + self.use() + '` binary doesn\'t seem to work correctly.'));
			return;
		}

		if (self.version()) {
			return binVersionCheck(self.path(), self.version(), function (err) {
				if (err) {
					cb(err);
					return;
				}

				cb();
			});
		}

		cb();
	});
};

/**
 * Get the binary
 *
 * @param {Function} cb
 * @api private
 */

BinWrapper.prototype._get = function (cb) {
	var files = this._parse(this.src());
	var Download = require('download');
	var download = new Download({
		extract: true,
		mode: parseInt('0755', 8),
		strip: this.opts.strip
	});

	files.forEach(function (file) {
		download.get(file.url);
	});

	download
		.dest(this.dest())
		.use(status())
		.run(function (err) {
			if (err) {
				cb(err);
				return;
			}

			cb();
		});
};

/**
 * Search for the binary
 *
 * @param {Function} cb
 * @api private
 */

BinWrapper.prototype._path = function (cb) {
	var self = this;
	var dir = path.join(this.dest(), path.dirname(this.use()));
	var bin = path.basename(this.use());

	var find = new Find()
		.name(bin)
		.where(dir);

	if (this.opts.global) {
		find.where(process.env.PATH.split(path.delimiter));
	}

	mkdir(dir, function (err) {
		if (err) {
			cb(err);
			return;
		}

		find.run(function (err, files) {
			if (err) {
				cb(err);
				return;
			}

			files = files.filter(function (file) {
				try {
					return file.path.indexOf(which.sync(bin)) === -1;
				} catch (e) {
					return true;
				}
			});

			if (!files.length) {
				cb();
				return;
			}

			if (self.opts.global) {
				self._global(files[0].path, cb);
				return;
			}

			cb(null, files[0].path);
		});
	});
};

/**
 * Symlink global binaries
 *
 * @param {String} file
 * @param {Function} cb
 * @api private
 */

BinWrapper.prototype._global = function (file, cb) {
	var paths = process.env.PATH.split(path.delimiter);
	var self = this;

	var global = paths.some(function (p) {
		return path.dirname(file) === p;
	});

	if (global) {
		return fs.symlink(file, self.path(), function (err) {
			if (err) {
				cb(err);
				return;
			}

			cb(null, self.path());
		});
	}

	cb(null, file);
};

/**
 * Parse sources
 *
 * @param {Object} obj
 * @api private
 */

BinWrapper.prototype._parse = function (obj) {
	var arch = process.arch === 'x64' ? 'x64' : process.arch === 'arm' ? 'arm' : 'x86';
	var ret = [];

	obj.filter(function (o) {
		if (o.os && o.os === process.platform && o.arch && o.arch === arch) {
			return ret.push(o);
		} else if (o.os && o.os === process.platform && !o.arch) {
			return ret.push(o);
		} else if (!o.os && !o.arch) {
			return ret.push(o);
		}
	});

	return ret;
};

/**
 * Module exports
 */

module.exports = BinWrapper;
