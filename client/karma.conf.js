module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'vendor/angular-1.4.7.min.js',
      'vendor/angular-translate-2.8.1.min.js',
      'vendor/angular-ui-router-0.2.15.min.js',
      'vendor/lodash-3.10.1.min.js',
      'vendor/ui-bootstrap-tpls-0.14.2.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'src/**/*.js',
      'test/**/*.spec.js',
      'src/**/*.tpl.html'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['coverage'],
      'src/**/*.tpl.html': ['ng-html2js']
    },

    coverageReporter: {
      type: 'html', //'text-summary', //html, text
      dir: 'coverage/'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: "src\/app\/common\/|src\/app\/components\/",
      // the name of the Angular module to create
      moduleName: "HTMLTemplates"
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing test whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the test and exits
    singleRun: false
  });
};
