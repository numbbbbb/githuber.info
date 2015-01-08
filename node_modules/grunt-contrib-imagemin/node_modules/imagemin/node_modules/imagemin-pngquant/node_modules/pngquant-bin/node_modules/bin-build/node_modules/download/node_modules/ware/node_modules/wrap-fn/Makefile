D= node_modules/.bin/duo -d
T= node_modules/.bin/duo-test -c make -R dot

default: test

build.js: test/index.js
	@$(D) $< > build.js
	@touch test/index.js

test-browser: build.js
	@$(T) browser

test-phantomjs:
	@$(T) phantomjs

test-saucelabs:
	@$(T) -b safari:5..7 saucelabs

test:
	@./node_modules/.bin/mocha \
		--harmony-generators \
		--require gnode \
		--reporter spec

.PHONY: build.js test test-saucelabs test-phantomjs
