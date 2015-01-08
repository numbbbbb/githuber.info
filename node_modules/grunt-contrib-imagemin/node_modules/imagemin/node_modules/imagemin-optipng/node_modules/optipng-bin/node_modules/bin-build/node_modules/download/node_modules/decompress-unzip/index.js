'use strict';

var File = require('vinyl');
var isZip = require('is-zip');
var rm = require('rimraf');
var stripDirs = require('strip-dirs');
var tempWrite = require('temp-write');
var through = require('through2');
var Zip = require('adm-zip');

/**
 * zip decompress plugin
 *
 * @param {Object} opts
 * @api public
 */

module.exports = function (opts) {
    opts = opts || {};
    opts.strip = +opts.strip || 0;

    return through.obj(function (file, enc, cb) {
        var self = this;

        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new Error('Streaming is not supported'));
            return;
        }

        if (!isZip(file.contents)) {
            cb(null, file);
            return;
        }

        tempWrite(file.contents, function (err, filepath) {
            var zip = new Zip(filepath);

            zip.getEntries().forEach(function (file) {
                if (!file.isDirectory) {
                    self.push(new File({
                        contents: file.getData(),
                        path: stripDirs(file.entryName.toString(), opts.strip)
                    }));
                }
            });

            rm(filepath, function (err) {
                if (err) {
                    cb(err);
                    return;
                }

                cb();
            });
        });
    });
};
