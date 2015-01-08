module.exports = (config) ->

    configuration =

        # base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: ''


        # frameworks to use
        # available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'requirejs']


        # list of files / patterns to load in the browser
        files: [
            {pattern: 'src/**/*.js', included:false}
            {pattern: 'test/**/*Spec.js', included: false}
            'test/test-main.js'
        ],


        # list of files to exclude
        exclude: [
        ]


        # preprocess matching files before serving them to the browser
        # available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            "src/**/*.js": "coverage"
        }


        # test results reporter to use
        # possible values: 'dots', 'progress'
        # available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage']

        coverageReporter: {
            type: "lcov"
            dir: "coverage/"
        }

        plugins: [
            'karma-jasmine'
            'karma-requirejs'
            'karma-chrome-launcher'
            'karma-phantomjs-launcher'
            'karma-firefox-launcher'
            'karma-ie-launcher'
            'karma-coverage'
        ]

        # web server port
        port: 9876


        # enable / disable colors in the output (reporters and logs)
        colors: true


        # level of logging
        # possible values:
        # - config.LOG_DISABLE
        # - config.LOG_ERROR
        # - config.LOG_WARN
        # - config.LOG_INFO
        # - config.LOG_DEBUG
        logLevel: config.LOG_INFO


        # enable / disable watching file and executing tests whenever any file changes
        autoWatch: false


        # start these browsers
        # available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'PhantomJS'
            # 'Chrome'
            # 'Firefox'
        ]

        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome'
                flags: ['--no-sandbox']
            }
        }

        # Continuous Integration mode
        # if true, Karma captures browsers, runs the tests and exits
        singleRun: false

        captureTimeout: 6000

    if process.env.TRAVIS
        configuration.browsers = ['Chrome_travis_ci', 'PhantomJS', 'Firefox']
        configuration.preprocessors = {
            "src/*.js": "coverage"
            "src/core/*.js": "coverage"
        }

    config.set configuration
    

