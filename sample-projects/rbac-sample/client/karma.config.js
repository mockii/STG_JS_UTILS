// Karma configuration
// Generated on Wed Nov 11 2015 17:38:14 GMT-0500 (Eastern Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'dist/scripts/stgwebutils-client-libs-*.js',
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

    ngHtml2JsPreprocessor: {
      stripPrefix: "src\/app\/common\/|src\/app\/components\/",
      // the name of the Angular module to create
      moduleName: "HTMLTemplates"
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage', 'junit'],



    coverageReporter: {
      type : 'lcov',
      dir : 'karma-results/test-coverage/',
      subdir: '.'
    },

    junitReporter: {
      outputFile: 'test-results.xml',
      outputDir: 'karma-results/test-results',
      useBrowserName: false
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome', 'Firefox', 'PhantomJS', 'IE'],
    //browsers: ['Chrome', 'Firefox', 'IE'],
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
};
