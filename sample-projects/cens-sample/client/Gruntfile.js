module.exports = function(grunt) {

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
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-karma');

    // Default task, so if you just run 'grunt', this is what it will do
    grunt.registerTask('default', ['build']);

    // General build task, for dev only
    grunt.registerTask('build', [
        'clean:preBuild',
        'html',
        'templates',
        'js',
        'css',
        'copy:assets',
        'includeSTGFiles',
        'clean:postBuild',
        'copy:theme',
        'copy:projectToParent'
    ]);




    // Utility tasks, these are primarily used by the watchers and the dev build
    grunt.registerTask('css', ['clean:css', 'compass:dev', 'copy:css']);
    grunt.registerTask('js', ['jshint','clean:js','templates','concat:dev']);
    grunt.registerTask('templates', ['clean:templates', 'html2js', 'concat:dev', 'copy:assets']);
    grunt.registerTask('html', ['copy:html','copy:assets']);
    grunt.registerTask('junit', ['clean:karmaResults', 'jshint', 'karma:unit']);
    grunt.registerTask('includeSTGFiles',['getSTGVersion','copy:stgSupportFiles','replace:stgInIndex']);



    // Print a timestamp, this help you determine the last build
    // with a quick glance at the terminal
    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(new Date());
    });

    grunt.stgVersion = "";
    grunt.registerTask('getSTGVersion', function() {
        var stgPackage = grunt.file.readJSON("node_modules/stgwebutils-client-libs/package.json");
        grunt.stgVersion = stgPackage.version;
    });

    grunt.packageInfo = grunt.file.readJSON('package.json');

    // Project configuration.
    grunt.initConfig({
        distdir: 'dist',
        pkg: grunt.file.readJSON('package.json'),
        banner:
        '/*! <%= pkg.title || pkg.name %> - version:<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
        '<%= pkg.homepage ? " * " + pkg.homepage : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;*/\n',

        src: {
            js: ['src/**/*.js'],
            i18n: [ 'src/locale/**/*.js'],
            specs: ['src/test/**/*.spec.js'],
            scenarios: ['src/test/**/*.scenario.js'],
            html: ['src/**/*.html'],
            tpl: {
                app: ['src/**/*.tpl.html'],
                //common: ['src/common/**/*.tpl.html'],
                js: ['<%= distdir %>/templates/**/*.js']
            },
            css: 'src/assets/css/**/*.css',
            sass: ['src/sass/**/*.scss'],
            images: 'src/assets/images',
            theme: 'metronic'
        },

        clean: {
            preBuild: ['<%= distdir %>/*'],
            postBuild: ['<%= distdir %>/temp'], //,'<%= distdir %>/templates'],
            css: ['<%= distdir %>/css'],
            js: ['<%= distdir %>/scripts'],
            templates: ['<%= distdir %>/templates'],
            karmaResults: ['./karma-results']
        },

        copy: {
            assets: {
                files: [
                    {dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/'},
                    {dest: '<%= distdir %>/scripts', src : '**', expand: true, cwd: 'vendor'}

                ]
            },
            css: {
                files: [
                    {dest: '<%= distdir %>/css', src:'**', expand: true, cwd:'<%= distdir %>/temp/css/',
                        rename: function(dest, src) {
                            if (src === "main.css") {
                                return dest + "/" + grunt.packageInfo.name + "-" + grunt.packageInfo.version + ".css";
                            }

                            return dest + "/" + src;
                        }

                    }
                ]
            },
            
            theme: {
                files: [
                    {dest: '<%= distdir %>/theme', src: '**', expand: true, cwd: 'theme/'}
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

            projectToParent: {
                files: [
                    {dest: '../<%= distdir %>/app', src : '**', expand: true, cwd: '<%= distdir %>'}

                ]
            },
            stgSupportFiles: {
                files: [
                    {
                        src:[
                            'node_modules/stgwebutils-client-libs/scripts/*.min.js',
                            'node_modules/stgwebutils-client-libs/themes/metronic/js/*.min.js'
                        ],
                        dest:'<%=distdir %>/scripts',
                        flatten: true,
                        expand: true
                    },
                    {
                        src:[
                            'node_modules/stgwebutils-client-libs/css/*.min.css',
                            'node_modules/stgwebutils-client-libs/themes/metronic/css/*.min.css'
                        ],
                        dest:'<%=distdir %>/css',
                        flatten: true,
                        expand: true
                    },
                    {
                        src:[
                            '**/*'
                        ],
                        cwd: 'node_modules/stgwebutils-client-libs/fonts/',
                        dest:'<%=distdir %>/fonts',
                        expand: true
                    },
                    {
                        src:[
                            '**/*'
                        ],
                        cwd: 'node_modules/stgwebutils-client-libs/img/',
                        dest:'<%=distdir %>/img',
                        expand: true
                    }
                ]
            }
        },

        imagemin: {
            all: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: '<%= distdir %>/images',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= distdir %>/images'
                }]
            }
        },

        html2js: {
            app: {
                options: {
                    base: 'src/app'
                },
                src: ['<%= src.tpl.app %>'],
                dest: '<%= distdir %>/templates/templates.js',
                module: 'templates.app'
            }
            /*common: {
             options: {
             base: 'src/client/common'
             },
             src: ['<%= src.tpl.common %>'],
             dest: '<%= distdir %>/templates/common.js',
             module: 'templates.common'
             }*/
        },

        karma: {
            unit: {
                configFile: 'karma.config.js'
            }
        },

        concat:{
            dev:{
                options: {
                    banner: "<%= banner %>"
                },
                src:['<%= src.js %>', '<%= src.tpl.js %>'],
                dest:'<%= distdir %>/scripts/<%= pkg.name %>-<%= pkg.version %>.js'
            },
            prod:{
                src:['<%= src.js %>',  '<%= src.tpl.js %>'],
                dest:'<%= distdir %>/temp/<%= pkg.name %>-<%= pkg.version %>.concat.js'
            }
        },

        removelogging: {
            dist: {
                src: '<%= distdir %>/temp/<%= pkg.name %>-<%= pkg.version %>.concat.js',
                dest: '<%= distdir %>/temp/<%= pkg.name %>-<%= pkg.version %>.clean.js',

                options: {
                }
            }
        },

        ngmin: {
            all: {
                src: ['<%= distdir %>/temp/<%= pkg.name %>-<%= pkg.version %>.clean.js'],
                dest: '<%= distdir %>/temp/<%= pkg.name %>-<%= pkg.version %>.ngmin.js'
            }
        },

        uglify: {
            options: {
                banner: "<%= banner %>",
                mangle: true
            },
            dist:{
                files: {
                    '<%= distdir %>/scripts/<%= pkg.name %>-<%= pkg.version %>.js': '<%= distdir %>/temp/<%= pkg.name %>-<%= pkg.version %>.ngmin.js'
                }
            }
        },

        watch:{
            js: {
                files: ['<%= src.js %>'],
                tasks: ['js', 'timestamp', 'includeSTGFiles']
            },
            css: {
                files: ['<%= src.css %>'],
                tasks: ['css', 'timestamp', 'includeSTGFiles']
            },
            templates: {
                //files: ['<%= src.tpl.app %>','<%= src.tpl.common %>'],
                files: ['<%= src.tpl.app %>'],
                tasks: ['templates', 'timestamp', 'includeSTGFiles']
            },
            html: {
                files: ['<%= src.html %>'],
                tasks: ['html', 'timestamp', 'includeSTGFiles']
            },
            images: {
                files: ['<%= src.images %>'],
                tasks: ['imagemin', 'timestamp', 'includeSTGFiles']
            }
        },

        jshint:{
            files:[
                'Gruntfile.js',
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
        },

        cacheBust: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 16
            },
            assets: {
                files: [{
                    src: ['<%= distdir %>/index.html']
                }]
            }
        },

        replace: {
            stgInIndex: {
                src: ['<%= distdir %>/index.html'],
                dest: '<%= distdir %>/index.html',
                replacements: [{
                    from: '%stg_version%',
                    to: '<%= grunt.stgVersion %>'
                }]
            }
        }
    });
};
