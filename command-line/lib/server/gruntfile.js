module.exports = function(grunt) {

    grunt.file.preserveBOM = true;
    grunt.file.defaultEncoding = 'utf8';

    // Load all of our NPM tasks
    // Make sure you add the task package to the 'package.json' file
    // and run 'npm install' before you add the package here
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-text-replace');

    // Default task, so if you just run 'grunt', this is what it will do
    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', [
        'clean:preBuild',
        'oauth',
        'copy:server',
        'replace:appPathDev'
    ]);

    grunt.registerTask('release', [
        'clean:preBuild',
        'oauth',
        'copy:serverRelease',
        'replace:appPathRelease'
    ]);

    // Utility tasks, these are primarily used by the watchers and the dev build
    grunt.registerTask('oauth', []); // ['copy:stgAuth']); (use when ready to use NPM bundles)

    // Print a timestamp, this help you determine the last build
    // with a quick glance at the terminal
    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(Date());
    });

    grunt.packageInfo = grunt.file.readJSON('package.json');

    // Project configuration.
    grunt.initConfig({
        distdir: 'dist',
        releaseDistDir: '../dist/',
        pkg: grunt.packageInfo,
        banner:
        '/*! <%= pkg.title || pkg.name %> - version:<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
        '<%= pkg.homepage ? " * " + pkg.homepage : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;*/\n',

        src: {
            js: ['src/*.js']
        },

        clean: {
            preBuild: ['<%= distdir %>/*']
        },

        copy: {
            server: {
                files: [
                    {dest: '<%= distdir %>', src: ['**/*'], expand:true, cwd:'src'}
                ]
            },
            serverRelease: {
                files: [
                    {dest: '<%= releaseDistDir %>', src: ['**/*'], expand:true, cwd:'src'}
                ]
            }
        },

        replace: {
            appPathDev: {
                src: ['<%= distdir %>/index.js'],
                dest: '<%= distdir %>/index.js',
                replacements: [{
                    from: '%appPath%',
                    to: '../../client/dist/'
                }]
            },
            appPathRelease: {
                src: ['<%= releaseDistDir %>/index.js'],
                dest: '<%= releaseDistDir %>/index.js',
                replacements: [{
                    from: '%appPath%',
                    to: 'app/'
                }]
            }
        }

    });
};
