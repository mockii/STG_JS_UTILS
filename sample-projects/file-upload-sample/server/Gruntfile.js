module.exports = function(grunt) {

    grunt.file.preserveBOM = true;
    grunt.file.defaultEncoding = 'utf8';

    // Load all of our NPM tasks
    // Make sure you add the task package to the 'package.json' file
    // and run 'npm install' before you add the package here
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-replace');

    // Default task, so if you just run 'grunt', this is what it will do
    grunt.registerTask('default', ['build']);

    // General build task, for dev only
    grunt.registerTask('build', [
        'clean:preBuild',
        'js',
        'copy:assets',
        'copy:npmrc',
        'clean:postBuild',
        'copy:projectToParent',
        'replace'
    ]);



    // Utility tasks, these are primarily used by the watchers and the dev build
    //grunt.registerTask('css', ['clean:css', 'compass:dev', 'copy:css', 'copy:cssFonts']);
    grunt.registerTask('js', ['jshint','clean:js']);

    // Print a timestamp, this help you determine the last build
    // with a quick glance at the terminal
    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(new Date());
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
            scenarios: ['src/test/**/*.scenario.js']
        },

        clean: {
            preBuild: ['<%= distdir %>/*'],
            postBuild: ['<%= distdir %>/temp'], //,'<%= distdir %>/templates'],
            js: ['<%= distdir %>/scripts']
        },

        copy: {
            assets: {
                files: [
                    {dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src'},
                    {dest: '<%= distdir %>', src : 'package.json', expand: true, cwd: '.'},
                    {dest: '<%= distdir %>/scripts', src : '**', expand: true, cwd: 'vendor'}

                ]
            },
            npmrc: {
                files: [
                    {dest: '<%= distdir %>', src : '.npmrc', expand: true, cwd: '.'}
                ]
            },
            projectToParent: {
                files: [
                    {dest: '../<%= distdir %>', src : '**', expand: true, cwd: '<%= distdir %>'},
                    {dest: '../<%= distdir %>', src : '.npmrc', expand: true, cwd: '<%= distdir %>'}
                ]
            }
        },

        watch:{
            js: {
                files: ['<%= src.js %>'],
                tasks: ['js', 'timestamp']
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

        replace:{
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'APP_LOCATION',
                            replacement: '/../../client/dist'
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src : ['src/file-upload-sample-server.js'], dest: '<%= distdir %>'}
                ]
            },
            parentDist: {
                options: {
                    patterns: [
                        {
                            match: 'APP_LOCATION',
                            replacement: '/app'
                        }
                    ]
                },
                files: [
                    {dest: '../<%= distdir %>', src : ['src/file-upload-sample-server.js'], expand: true, flatten: true}
                ]
            }
        }
    });
};
