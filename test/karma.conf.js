// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-07-15 using
// generator-karma 0.8.2

module.exports = function(config) {
  config.set({  
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '..',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular-mocks/angular-mocks.js',
      //'bower_components/angular-animate/angular-animate.js',
      //'bower_components/angular-cookies/angular-cookies.js',
      //'bower_components/angular-resource/angular-resource.js',
      //'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-gettext/dist/angular-gettext.js',
      'bower_components/ngAutocomplete/src/ngAutocomplete.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/firebase/firebase.js',
      'bower_components/firebase-simple-login/firebase-simple-login.js',
      'bower_components/angularfire/angularfire.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-md5/angular-md5.js',
      'bower_components/angular-dynamic-locale/tmhDynamicLocale.min.js',
      'app/scripts/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-coverage'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    /*
    proxies: {
      '/': 'http://localhost:9000/'
    },
    */
    proxies: {
      '/scripts/i18n/': 'http://localhost/smartUp/app/scripts/i18n/'
    },

    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'

    // here we specify which of the files we want to appear in the coverage report
    preprocessors: {
      'app/scripts/controllers/*.js': ['coverage'],
      'app/scripts/directives/*.js': ['coverage'],
      'app/scripts/filters/*.js': ['coverage'],
      'app/scripts/services/*.js': ['coverage']
    },

    // add coverage to reporters
    reporters: ['progress'], //, 'coverage'], // add coverage reporter after development is finished

    // tell karma how you want the coverage results
    coverageReporter: {
      type : 'html',
      // where to store the report
      dir : 'app/coverage/'
    }

  });
};
