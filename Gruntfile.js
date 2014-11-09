// Generated on 2014-07-15 using generator-angular 0.9.5
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

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
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      always: {
        files: [
          '<%= yeoman.app %>/{,*/}*.html', '<%= yeoman.app %>/views/{,*/}*.html',
          '<%= yeoman.app %>/scrips/{,*/}*.js', '<%= yeoman.app %>/styles/{,*/}*.css',
          '<%= yeoman.app %>/icons/{,*/}*', '<%= yeoman.app %>/fonts/{,*/}*.js'
        ],
        tasks: ['manifest:generate'],
      },
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: [
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ],
        tasks: ['newer:jshint:all', 'manifest:generate'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js', 'test/e2e/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      ngconstant: {
        files: ['Grunfile.js', 'package.json'],
        tasks: ['ngconstant:development']
      },
      nggettextExtract: {
        files: [
          '<%= yeoman.app %>/**/*.html',
          '<%= yeoman.app %>/scripts/**/*.js'
        ],
        tasks: [
          'nggettext_extract',
          //'exec:poAutoTranslate', // TODO: enable this before production, disable to speed ut development...
        ]
      },
      nggettextCompile: {
        files: ['po/*.po'],
        tasks: ['nggettext_compile']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // Setup constants
    ngconstant: {
      options: {
        name: 'config',
        dest: '<%= yeoman.app %>/scripts/config.js',
        constants: {
          CFG: {
            package: grunt.file.readJSON('package.json'),
            env: 'development',
            appLogo: 'icons/logo.png',
            firebaseUrl: 'https://smartup.firebaseio.com/',
            systemEmail: 'sistemisolarirossi@gmail.com',
            lastBuildDate: Date.now()
          }
        }
      },
      development: {
        constants: {
          CFG: {
            env: 'development',
            appCache: false,
            debug: true
          }
        }
      },
      production: {
        constants: {
          CFG: {
            env: 'production',
            appCache: false,
            debug: false
          }
        }
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        //hostname: 'localhost',
        hostname: '0.0.0.0', // allow access from outside (LAN)
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
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
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
          base: '<%= yeoman.dist %>'
        }
      }
    },


    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js', 'test/e2e/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
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
      options: {
        //cwd: '<%= yeoman.app %>',
      },
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '!<%= yeoman.dist %>/scripts/i18n/*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          //,'<%= yeoman.dist %>/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
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
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/icons']
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Minimize images
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    // Minimize SVG
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    // Minimize HTML
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
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Make the code safe for minification
    // Note: ngAnnotate tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            //'*.{ico,png,txt}',
            '*.{txt}',
            '.htaccess',
            '*.html',
            '*.appcache',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'icons/**/*.{ico,png}',
            'scripts/i18n/{,*/}*.js', // angular-locale_XX.js, for L10N dynamic loading
            'i18n/{,*/}*.json',
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          cwd: 'bower_components/open-sans-fontface',
          src: 'fonts/**/*',
          dest: '<%= yeoman.dist %>/styles'
        }, {
          expand: true,
          cwd: 'bower_components/font-awesome',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      options: {
        logConcurrentOutput: true,
        limit: 8 // run a maximum of 8 tasks in parallel
      },
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    // Favicons settings
    favicons: {
      options: {
        trueColor: true,
        precomposed: false,
        appleTouchBackgroundColor: '#111111',
        windowsTile: true,
        tileBlackWhite: false,
        tileColor: 'auto',
        html: 'local/index-favicons.html',
        HTMLPrefix: 'icons',
        androidHomescreen: true
      },
      icons: {
        src: 'local/logo.png',
        dest: '<%= yeoman.app %>/icons/'
      }
    },


    // Remove logging from production code
    removelogging: {
      dist: {
        src: '.tmp/concat/scripts/scripts.js', // and 'vendor.js'?
        options: {
          methods: ['debug', 'log', 'info'],
          verbose: true
        }
      }
    },

    // Auto-install
    autoInstall: {
      local: {},
      subdir: {
        options: {
          cwd: '.auto.install/',
          stdout: true,
          stderr: true,
          failOnError: true
        }
      }
    },

    // Build appcache manifest
    manifest: {
      generate: {
        options: {
          basePath: '<%= yeoman.app %>',
          network: [ '*' ], // [ 'http://*', 'https://*' ],
          //fallback: ['/ offline.html'],
          exclude: [],
          preferOnline: true,
          timestamp: true,
          verbose: true
        },
        src: [
          'scripts/**/*.js',
          'views/*.html',
          'styles/**/*.css',
          'icons/*.{png,jpg,ico}',
          'icons/flags/*.png',
          'fonts/**/*',
          '*.html',
        ],
        dest: '<%= yeoman.app %>/manifest.appcache'
      },
      dist: {
        options: {
          basePath: '<%= yeoman.dist %>',
          network: [ '*' ], // [ 'http://*', 'https://*' ],
          //fallback: ['/ offline.html'],
          exclude: [],
          preferOnline: true,
          timestamp: true,
          verbose: true
        },
        src: [
          'scripts/**/*.js',
          'views/*.html',
          'styles/**/*.css',
          'icons/*.{png,jpg,ico}',
          'icons/flags/*.png',
          'fonts/**/*',
          '*.html',
        ],
        dest: '<%= yeoman.dist %>/manifest.appcache'
      },
    },

    // External execution commands: poAutoTranslate
    exec: {
      poAutoTranslate: {
        cmd: 'php local/po-auto-translate/PoAutoTranslate.php "<config:pkg.name>" "<%= process.cwd() %>"',
      },
    },

    // I18N: extract strings to be translated
    /* jshint camelcase: false */
    nggettext_extract: {
    /* jshint camelcase: true */
      pot: {
        files: {
          'po/template.pot': [
            '<%= yeoman.app %>/**/*.html',
            '<%= yeoman.app %>/scripts/**/*.js'
          ]
        }
      }
    },

    // I18N: compile strings to be translated
    /* jshint camelcase: false */
    nggettext_compile: {
    /* jshint camelcase: true */
      all: {
        options: {
          format: 'json'
        },
        files: [
          {
            expand: true,
            cwd: 'po/',
            dest:  '<%= yeoman.app %>/i18n/',
            src: [ '*.po' ],
            ext: '.json',
            extDot: 'last'
          }
        ]
      },
    },

  });


  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-auto-install');
  grunt.loadNpmTasks('grunt-favicons');
  grunt.loadNpmTasks('grunt-remove-logging');
  grunt.loadNpmTasks('grunt-manifest');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-angular-gettext');

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'ngconstant:development',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

/*
  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });
*/

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'auto_install',
    'clean:dist',
    'ngconstant:development',
    'favicons',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'removelogging',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin',
    'manifest:dist'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build',
  ]);
};