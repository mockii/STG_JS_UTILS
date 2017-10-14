module.exports = function(grunt) {

    var metronic = grunt.file.readJSON('themes/metronic/metronic.json');
    setupThemeStyles(metronic);
    var userprofile = getUserHome();

    grunt.file.preserveBOM = true;
    grunt.file.defaultEncoding = 'utf8';

    // Load all of our NPM tasks
    // Make sure you add the task package to the 'package.json' file
    // and run 'npm install' before you add the package here
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.loadNpmTasks('grunt-exec');

    // Default task, so if you just run 'grunt', this is what it will do
    grunt.registerTask('default', ['build']);

    // General build task, for dev only
    grunt.registerTask('build', [
        'clean:preBuild',
        'exec:npmVersion',
        'loadPackageJSON',
        'html',
        'templates',
        'js',
        'css',
        'copyAllAssets',
        'clean:temp',
        'exec:npmConfig',
        'copy:npm',
        'copyAllToAdamsUIClientNodeModules'/*,
        'copyAllToOMSNGClientNodeModules'*/
    ]);

    // Release build for production
    grunt.registerTask('release', [
        'clean:preBuild',
        'exec:npmVersion',
        'loadPackageJSON',
        'html2js',
        'concat:prod',
        'removelogging',
        'ngmin',
        'uglify',
        'compass:prod',
        'copy',
        'clean:postBuild'
    ]);

    grunt.registerTask("copyJS", ['loadPackageJSON', 'copy:js']);

    // Utility tasks, these are primarily used by the watchers and the dev build
    grunt.registerTask('css', ['clean:css', 'compass:dev', 'concat:css', 'copy:themeCSS', 'concat:themeCSS', 'cssmin', 'copy:css']);
    grunt.registerTask('js', ['jshint','clean:js','templates','concat:dev','uglify:app','concat:allJS','concat:allJSDev','copy:themeJS','concat:themeJS']);
    grunt.registerTask('templates', ['clean:templates', 'html2js', 'concat:dev', 'copy:assets']);
    grunt.registerTask('html', ['copy:html','copy:assets']);
    grunt.registerTask('npmConfig', ['exec:npmConfig','copy:npm']);
    grunt.registerTask('copyAllAssets', ['copy:assets', 'copy:themeImages', 'copy:themeFonts', 'copy:js']);
    grunt.registerTask('copyAllToAdamsUIClientNodeModules', ['clean:adamsContents', 'copy:copyAllToAdamsUIClientNodeModules', 'exec:runAdamsUIGruntBuild']);
    grunt.registerTask('copyAllToOMSNGClientNodeModules', ['clean:omsContents', 'copy:copyAllToOMSNGClientNodeModules', 'exec:runOMSNGGruntBuild']);

    // Print a timestamp, this help you determine the last build
    // with a quick glance at the terminal
    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(Date());
    });

    var pkg;
    grunt.registerTask("loadPackageJSON", function() {
        pkg = grunt.file.readJSON('package.json');
        grunt.packageInfo = pkg;
    });

    // Project configuration.
    grunt.initConfig({
        distdir: 'dist',
        tempdir: 'temp',
        userprofile: userprofile,
        metronic: metronic,
        banner:
        '/*! <%= grunt.packageInfo.title || grunt.packageInfo.name %> - version:<%= grunt.packageInfo.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
        '<%= grunt.packageInfo.homepage ? " * " + grunt.packageInfo.homepage : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= grunt.packageInfo.author %>;*/\n',

        src: {
            js: ['src/**/*.js'],
            i18n: [ 'src/locale/**/*.js'],
            specs: ['test/**/*.spec.js'],
            scenarios: ['test/**/*.scenario.js'],
            html: ['src/*.html'],
            tpl: {
                app: ['src/app/common/**/*.tpl.html'],
                js: ['<%= distdir %>/templates/**/*.js']
            },
            sass: ['src/sass/**/*.scss'],
            images: 'src/images'
        },

        clean: {
            preBuild: ['<%= distdir %>/*'],
            postBuild: ['<%= distdir %>/temp','<%= distdir %>/templates'],
            css: ['<%= distdir %>/css'],
            js: ['<%= distdir %>/scripts'],
            templates: ['<%= distdir %>/templates'],
            temp: ['<%= distdir %>/temp'],
            adamsContents: ['<%= userprofile %>/workspace/Adams UI/client/node_modules/stgwebutils-client-libs/*'],
            omsContents: ['<%= userprofile %>/workspace/OMS NG/client/node_modules/stgwebutils-client-libs/*'],
            options: {force: true}
        },

        exec: {
            npmVersion: {
                command: 'npm version prerelease'
            },
            npmConfig: {
                command: 'cd scripts && node postBuild.js'
            },
            runAdamsUIGruntBuild: {
                command: 'cd <%= userprofile %>/workspace/Adams UI/client/ && grunt build'
            },
            runOMSNGGruntBuild: {
                command: 'cd <%= userprofile %>/workspace/OMS NG/client/ && grunt build'
            }
        },

        copy: {
            assets: {
                files: [
                    {dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/'},
                    {dest: '<%= distdir %>/scripts/vendor', src : '**', expand: true, cwd: 'vendor'}

                ]
            },
            html: {
                options: {
                    processContent: function (content, srcpath) {
                        return grunt.template.process(content);
                    }
                },
                files: [{dest:'<%= distdir %>', src:'*.html', expand: true, cwd:'src'}]
            },
            css: {
                files: [{
                    expand: true,
                    cwd: '<%= distdir %>/temp/css',
                    src: '**',
                    dest: '<%= distdir %>/css',
                    rename: function(dest, src) {
                        if (src === grunt.packageInfo.name + ".min.css") {
                            return dest + "/" + grunt.packageInfo.name + "-" + grunt.packageInfo.version + ".min.css";
                        }

                        if (src === grunt.packageInfo.name + ".concat.css") {
                            return dest + "/" + grunt.packageInfo.name + "-" + grunt.packageInfo.version + ".css";
                        }

                        if (src.length > 0 && src.indexOf(grunt.packageInfo.name) !== 0 && src.indexOf("templates") !== 0) {
                            src = "/vendor/" + src;
                        }

                        return dest + "/" + src;
                    }
                }]
            },
            js: {
                files: [{
                    src: '<%= distdir %>/scripts/<%= grunt.packageInfo.name %>-<%= grunt.packageInfo.version %>.min.js',
                    dest: '<%= distdir %>/scripts/<%= grunt.packageInfo.name %>.min.js'
                }]
            },
            themeCSS: {
                files: [{
                    expand: true,
                    cwd: metronic.css.rootDir,
                    src: metronic.css.files,
                    dest: '<%= distdir %>/themes/' + metronic.name + '/css/source',
                    flatten: true
                }]
            },
            themeJS: {
                files: [{
                    expand: true,
                    cwd: metronic.js.rootDir,
                    src: metronic.js.files,
                    dest: '<%= distdir %>/themes/' + metronic.name + '/js/source',
                    flatten: true
                }]
            },
            themeImages: {
                files: [
                    {
                        expand: true,
                        cwd: metronic.images.rootDir,
                        src: metronic.images.files,
                        dest: '<%= distdir %>/img/',
                        flatten: true,
                        rename: function(dest, src) {
                            if (src === "avatar.png") {
                                src = "genericAvatar.png";
                            }

                            return dest + "/" + src;
                        }
                    }
                ]
            },
            themeFonts: {
                files: [{
                    expand: true,
                    cwd: metronic.fonts.rootDir,
                    src: metronic.fonts.files,
                    dest: '<%= distdir %>/fonts/',
                    flatten: true
                }]
            },
            npm: {
                files: [{
                    cwd: '.',
                    src: ['.npmrc','README.md'],
                    dest: '<%= distdir %>/'
                }]
            },

            copyAllToAdamsUIClientNodeModules: {
                files: [{
                    expand: true,
                    cwd: '<%= distdir %>',
                    src: ['**/*','.npmrc'],
                    dest: '<%= userprofile %>/workspace/Adams UI/client/node_modules/stgwebutils-client-libs'
                }]
            },

            copyAllToOMSNGClientNodeModules: {
                files: [{
                    expand: true,
                    cwd: '<%= distdir %>',
                    src: ['**/*','.npmrc'],
                    dest: '<%= userprofile %>/workspace/OMS NG/client/node_modules/stgwebutils-client-libs'
                }]
            }
        },

        html2js: {
            app: {
                options: {
                    base: 'src/app/common',
                    rename: function (moduleName) {
                        return 'common/' + moduleName;
                    }
                },
                src: ['<%= src.tpl.app %>'],
                dest: '<%= distdir %>/templates/<%= grunt.packageInfo.name %>-tpls.js',
                module: 'common.templates.app'
            }
        },

        concat:{
            dev:{
                options: {
                    banner: "<%= banner %>"
                },
                src:['<%= src.js %>', '<%= src.tpl.js %>'],
                dest:'<%= distdir %>/scripts/<%= grunt.packageInfo.name %>-<%= grunt.packageInfo.version %>.js'
            },
            prod:{
                src:['<%= src.js %>',  '<%= src.tpl.js %>'],
                dest:'<%= distdir %>/temp/<%= grunt.packageInfo.name %>.concat.js'
            },
            css: {
                options: {
                    banner: "<%= banner %>"
                },
                src: [
                    '<%= distdir %>/temp/css/ag-grid/**/*',
                    '<%= distdir %>/temp/css/compassNgSortable/**/*',
                    '<%= distdir %>/temp/css/ngToast/**/*',
                    '<%= distdir %>/temp/css/angularBlockUI/**/*',
                    '<%= distdir %>/temp/css/ui-grid/**/*',
                    '<%= distdir %>/temp/css/<%= grunt.packageInfo.name %>.css'
                ],
                dest: '<%= distdir %>/temp/css/<%= grunt.packageInfo.name %>.concat.css'
            },
            allJS: {
                options: {
                    banner: "<%= banner %>"
                },
                src: [
                    '<%= distdir %>/scripts/vendor/angular-1*.min.js',
                    '<%= distdir %>/scripts/vendor/angular*.min.js',
                    '<%= distdir %>/scripts/vendor/*.min.js',
                    '<%= distdir %>/scripts/<%= grunt.packageInfo.name %>.min.js'
                ],
                dest: '<%= distdir %>/scripts/<%= grunt.packageInfo.name %>-<%= grunt.packageInfo.version %>.min.js'
            },
            allJSDev: {
                options: {
                    banner: "<%= banner %>"
                },
                src: [
                    '<%= distdir %>/scripts/vendor/angular-1*.min.js',
                    '<%= distdir %>/scripts/vendor/angular*.min.js',
                    '<%= distdir %>/scripts/vendor/*.min.js',
                    '<%= distdir %>/scripts/<%= grunt.packageInfo.name %>-<%= grunt.packageInfo.version %>.js'
                ],
                dest: '<%= distdir %>/scripts/<%= grunt.packageInfo.name %>-<%= grunt.packageInfo.version %>.js'
            },
            themeCSS: {
                options: {
                    banner: "<%= banner %>"
                },
                src: metronic.css.formattedFileNames,
                dest: '<%= distdir %>/themes/metronic/css/<%= grunt.packageInfo.name %>-<%= metronic.name %>-<%= grunt.packageInfo.version %>.css'

            },
            themeJS: {
                options: {
                    banner: "<%= banner %>"
                },
                src: metronic.js.formattedFileNames,
                dest: '<%= distdir %>/themes/metronic/js/<%= grunt.packageInfo.name %>-<%= metronic.name %>-<%= grunt.packageInfo.version %>.min.js'

            }
        },

        removelogging: {
            dist: {
                src: '<%= distdir %>/temp/<%= grunt.packageInfo.name %>.concat.js',
                dest: '<%= distdir %>/temp/<%= grunt.packageInfo.name %>.clean.js',

                options: {
                }
            }
        },

        ngmin: {
            all: {
                src: ['<%= distdir %>/temp/<%= grunt.packageInfo.name %>.clean.js'],
                dest: '<%= distdir %>/temp/<%= grunt.packageInfo.name %>.ngmin.js'
            }
        },

        cssmin: {
            target: {
                files: {
                    '<%= distdir %>/temp/css/<%= grunt.packageInfo.name %>.min.css': ['<%= distdir %>/temp/css/<%= grunt.packageInfo.name %>.concat.css'],
                    '<%= distdir %>/themes/<%= metronic.name %>/css/<%= grunt.packageInfo.name %>-<%= metronic.name %>-<%= grunt.packageInfo.version %>.min.css': ['<%= distdir %>/themes/metronic/css/<%= grunt.packageInfo.name %>-<%= metronic.name %>-<%= grunt.packageInfo.version %>.css']
                }
            }
        },

        uglify: {
            options: {
                banner: "<%= banner %>",
                mangle: true
            },
            dist:{
                files: {
                    '<%= distdir %>/scripts/<%= grunt.packageInfo.name %>.js': '<%= distdir %>/temp/<%= grunt.packageInfo.name %>.ngmin.js'
                }
            },
            app: {
                files: {
                    '<%= distdir %>/scripts/<%= grunt.packageInfo.name %>.min.js': '<%= distdir %>/scripts/<%= grunt.packageInfo.name %>-<%= grunt.packageInfo.version %>.js'
                }
            }
        },

        watch:{
            js: {
                files: ['<%= src.js %>'],
                tasks: ['js', 'timestamp']
            },
            css: {
                files: ['<%= src.sass %>'],
                tasks: ['css', 'timestamp']
            },
            templates: {
                files: ['<%= src.tpl.app %>'],
                tasks: ['templates', 'timestamp']
            },
            html: {
                files: ['<%= src.html %>'],
                tasks: ['html', 'timestamp']
            }
        },

        jshint:{
            files:[
                'gruntfile.js',
                '<%= src.js %>',
                '<%= src.scenarios %>',
                '<%= src.i18n %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        compass: {
            prod: {
                options: {
                    outputStyle: 'compressed',
                    cssDir: '../../<%= distdir %>/temp/css',
                    sassDir: '',
                    basePath: 'src/sass',
                    environment: 'production',
                    noLineComments: true,
                    force: true
                }
            },
            dev: {
                options: {
                    cssDir: '../../<%= distdir %>/temp/css',
                    sassDir: '',
                    basePath: 'src/sass',
                    noLineComments: true,
                    fontsDir: '/fonts'
                }
            }
        }
    });

    function setupThemeStyles(themePkg) {
        themePkg.css.formattedFileNames = [];
        themePkg.js.formattedFileNames = [];

        var currentFile;
        for (var cssIndex= 0; cssIndex < themePkg.css.files.length; cssIndex++) {
            currentFile = themePkg.css.files[cssIndex].split("/");
            themePkg.css.formattedFileNames.push('<%= distdir %>/themes/' + metronic.name + '/css/source/' + currentFile[currentFile.length - 1]);
        }

        for (var jsIndex=0; jsIndex < themePkg.js.files.length; jsIndex++) {
            currentFile = themePkg.js.files[jsIndex].split("/");
            themePkg.js.formattedFileNames.push('<%= distdir %>/themes/' + metronic.name + '/js/source/' + currentFile[currentFile.length - 1]);
        }
    }

    function getUserHome() {
        return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
    }
};