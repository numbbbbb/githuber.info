'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Project settings
    githuber: appConfig,
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= githuber.app %>/scripts/{,*/}*.js'],
        // tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      styles: {
        files: ['<%= githuber.app %>/styles/{,*/}*.less'],
        tasks: ['newer:copy:styles', 'less:development']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= githuber.app %>/{,*/}*.html',
          '<%= githuber.app %>/views/*.html',
          '<%= githuber.app %>/styles/{,*/}*.css',
          '<%= githuber.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= githuber.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    // jshint: {
    //   options: {
    //     jshintrc: '.jshintrc',
    //     reporter: require('jshint-stylish')
    //   },
    //   all: {
    //     src: [
    //       'Gruntfile.js',
    //       '<%= githuber.app %>/scripts/{,*/}*.js'
    //     ]
    //   }
    // },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= githuber.dist %>/{,*/}*',
            '!<%= githuber.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },
    less: {
      development: {
        options: {
          paths: ["styles"]
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/less/',
          src: '*.less',
          dest: '<%= githuber.app %>/styles/',
          ext: '.css'
        }]
      },
      production: {
        options: {
          paths: ["styles"],
          plugins: [
            new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
          ]
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/less/',
          src: '*.less',
          dest: '<%= githuber.dist %>/styles/',
          ext: '.css'
        }]
      }
    },
    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= githuber.app %>/index.html'],
        ignorePath:  /\.\.\//
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          // '!<%= githuber.dist %>/scripts/vendor.*',
          '<%= githuber.dist %>/scripts/*.js',
          '<%= githuber.dist %>/scripts/bigcache/*.js',
          '<%= githuber.dist %>/styles/{,*/}*.css',
          '<%= githuber.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= githuber.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= githuber.app %>/index.html', '<%= githuber.app %>/views/*.html'],
      options: {
        dest: '<%= githuber.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= githuber.dist %>/{,*/}*.html'],
      css: ['<%= githuber.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= githuber.dist %>','<%= githuber.dist %>/images']
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= githuber.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= githuber.dist %>/scripts/scripts.js': [
    //         '<%= githuber.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= githuber.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= githuber.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= githuber.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= githuber.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= githuber.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= githuber.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js', '!oldieshim.js'],
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    // cdnify: {
    //   options: {
    //     rewriter: function (url) {
    //       if (url.indexOf('vendor') != 0)
    //         return url; // leave data URIs untouched
    //       else
    //         return 'http://staticfile00.b0.upaiyun.com/' + url; // add query string to all other URLs
    //     }
    //   },
    //   dist: {
    //     html: '<%= githuber.dist %>/*.html'
    //   }
    // },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= githuber.app %>',
          dest: '<%= githuber.dist %>',
          src: [
            'scripts/chart/{,*/}*.js',
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= githuber.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= githuber.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= githuber.app %>/styles',
        dest: '.tmp/styles/',
        src: '**/*.less'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    console.log('target is: ', target);
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'less:development',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'less:production',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    // 'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    // 'newer:jshint',
    'serve'
  ]);
};
