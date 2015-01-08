'use strict';

var binCheck = require('bin-check');
var BinBuild = require('bin-build');
var execFile = require('child_process').execFile;
var fs = require('fs');
var mkdir = require('mkdirp');
var path = require('path');
var rm = require('rimraf');
var test = require('ava');
var tmp = path.join(__dirname, 'tmp');

test('rebuild the gifsicle binaries', function (t) {
	t.plan(3);

	var builder = new BinBuild()
		.src('http://www.lcdf.org/gifsicle/gifsicle-1.83.tar.gz')
		.cmd('./configure --disable-gifview --disable-gifdiff --prefix="' + tmp + '" --bindir="' + tmp + '"')
		.cmd('make install');

	builder.build(function (err) {
		t.assert(!err);

		fs.exists(path.join(tmp, 'gifsicle'), function (exists) {
			t.assert(exists);

			rm(tmp, function (err) {
				t.assert(!err);
			});
		});
	});
});

test('return path to binary and verify that it is working', function (t) {
	t.plan(2);

	binCheck(require('../').path, ['--version'], function (err, works) {
		t.assert(!err);
		t.assert(works);
	});
});

test('minify a GIF', function (t) {
	t.plan(6);

	var args = [
		'-o', path.join(tmp, 'test.gif'),
		path.join(__dirname, 'fixtures/test.gif')
	];

	mkdir(tmp, function (err) {
		t.assert(!err);

		execFile(require('../').path, args, function (err) {
			t.assert(!err);

			fs.stat(path.join(__dirname, 'fixtures/test.gif'), function (err, a) {
				t.assert(!err);

				fs.stat(path.join(tmp, 'test.gif'), function (err, b) {
					t.assert(!err);
					t.assert(b.size < a.size);

					rm(tmp, function (err) {
						t.assert(!err);
					});
				});
			});
		});
	});
});
