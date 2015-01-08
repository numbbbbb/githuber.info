'use strict';

var each = require('each-async');
var fs = require('fs');
var Mode = require('stat-mode');
var path = require('path');

/**
 * Initialize Find
 *
 * @param {Object} opts
 * @api public
 */

function Find() {
    if (!(this instanceof Find)) {
        return new Find();
    }

    this._where = [];
}

/**
 * File name to search for
 *
 * @param {String} str
 * @api public
 */

Find.prototype.name = function (str) {
    if (!arguments.length) {
        return this._name;
    }

    this._name = str;
    return this;
};

/**
 * Where to search for the file
 *
 * @param {Array|String} where
 * @api public
 */

Find.prototype.where = function (where) {
    if (!arguments.length) {
        return this._where;
    }

    if (Array.isArray(where)) {
        this._where = this._where.concat(where);
    } else {
        this._where.push(where);
    }

    return this;
};

/**
 * Run
 *
 * @param {Function} cb
 * @api public
 */

Find.prototype.run = function (cb) {
    var self = this;

    this.read(function (err, files) {
        if (err) {
            cb(err);
            return;
        }

        self.stat(files, function (err, files) {
            if (err) {
                cb(err);
                return;
            }

            files = files.filter(function (file) {
                return !file.stats.isDirectory();
            });

            cb(null, files);
        });
    });
};

/**
 * Read directories
 *
 * @param {Function} cb
 * @api public
 */

Find.prototype.read = function (cb) {
    var items = [];
    var self = this;

    each(this.where(), function (dir, i, done) {
        fs.readdir(dir, function (err, files) {
            if (err) {
                done(err);
                return;
            }

            files = files.filter(function (file) {
                return path.basename(file) === self.name();
            });

            files = files.map(function (file) {
                return path.join(dir, file);
            });

            items = items.concat(files);
            done();
        });
    }, function (err) {
        if (err) {
            cb(err);
            return;
        }

        cb(null, items);
    });
};

/**
 * Stat files
 *
 * @param {Function} cb
 * @api public
 */

Find.prototype.stat = function (files, cb) {
    var items = [];

    each(files, function (file, i, done) {
        fs.stat(file, function (err, stats) {
            if (err) {
                done(err);
                return;
            }

            var obj = {
                path: file,
                name: path.basename(file),
                mode: new Mode(stats).toOctal(),
                stats: stats
            };

            items.push(obj);
            done();
        });
    }, function (err) {
        if (err) {
            cb(err);
            return;
        }

        cb(null, items);
    });
};

/**
 * Module exports
 */

module.exports = Find;
