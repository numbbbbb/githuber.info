'use strict';

var bin = require('./');
var BinBuild = require('bin-build');
var logSymbols = require('log-symbols');

/**
 * Install binary and check whether it works.
 * If the test fails, try to build it.
 */

bin.run(['--version'], function (err) {
	if (err) {
		console.log(logSymbols.warning + ' pre-build test failed, compiling from source...');

		var builder = new BinBuild()
			.src('http://downloads.sourceforge.net/project/optipng/OptiPNG/optipng-' + bin.v + '/optipng-' + bin.v + '.tar.gz')
			.cmd('./configure --with-system-zlib --prefix="' + bin.dest() + '" --bindir="' + bin.dest() + '"')
			.cmd('make install');

		return builder.build(function (err) {
			if (err) {
				console.log(logSymbols.error, err);
				return;
			}

			console.log(logSymbols.success + ' optipng built successfully!');
		});
	}

	console.log(logSymbols.success + ' pre-build test passed successfully!');
});
