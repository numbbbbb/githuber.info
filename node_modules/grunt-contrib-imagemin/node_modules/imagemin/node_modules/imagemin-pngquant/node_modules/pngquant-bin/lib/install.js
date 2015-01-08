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
			.src('https://github.com/pornel/pngquant/archive/' + bin.v + '.tar.gz')
			.cmd('make install BINPREFIX="' + bin.dest() + '"');

		return builder.build(function (err) {
			if (err) {
				console.log(logSymbols.error + ' pngquant failed to build, make sure that ' + (process.platform === 'darwin' ? 'libpng' : 'libpng-dev') + ' is installed');
				console.log('');
				console.log(err);

				return;
			}

			console.log(logSymbols.success + ' pngquant built successfully!');
		});
	}

	console.log(logSymbols.success + ' pre-build test passed successfully!');
});
