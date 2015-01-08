'use strict';

var bin = require('./');
var BinBuild = require('bin-build');
var logSymbols = require('log-symbols');
var path = require('path');

/**
 * Install binary and check whether it works.
 * If the test fails, try to build it.
 */

var flags = '';
var args = [
	'-copy', 'none',
	'-optimize',
	'-outfile', path.join(__dirname, '../test/fixtures/test-optimized.jpg'),
	path.join(__dirname, '../test/fixtures/test.jpg')
];

bin.run(args, function (err) {
	if (err) {
		console.log(logSymbols.warning + ' pre-build test failed, compiling from source...');

		if (process.platform === 'darwin' && process.arch === 'x64') {
			flags = 'CFLAGS="-m32" LDFLAGS="-m32"';
		}

		var builder = new BinBuild()
			.src('http://downloads.sourceforge.net/project/libjpeg-turbo/' + bin.v + '/libjpeg-turbo-' + bin.v + '.tar.gz')
			.cmd(flags + ' ./configure --disable-shared --prefix="' + bin.dest() + '" --bindir="' + bin.dest() + '"')
			.cmd('make install');

		return builder.build(function (err) {
			if (err) {
				console.log(logSymbols.error, err);
				return;
			}

			console.log(logSymbols.success + ' jpegtran built successfully!');
		});
	}

	console.log(logSymbols.success + ' pre-build test passed successfully!');
});
