module.exports = function(grunt) {

    grunt.file.preserveBOM = true;
    grunt.file.defaultEncoding = 'utf8';

    // Load all of our NPM tasks
    // Make sure you add the task package to the 'package.json' file
    // and run 'npm install' before you add the package here
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');


    // Default task, so if you just run 'grunt', this is what it will do
    grunt.registerTask('default', ['build']);

    // General build task, for dev only
    grunt.registerTask('build', [
        'clean:preBuild',
        'build-client',
        'build-server',
        'clean:postBuild'
    ]);


    grunt.registerTask('package', [
        'clean:prePackage',
        'copy:packageAssets',
        'compress',
        'clean:postPackage'
    ]);


    grunt.registerTask('build-client', function () {
        var done = this.async();
        grunt.util.spawn({
            grunt: true,
            args: ['build'],
            opts: {
                cwd: 'client'
            }
        }, function (err, result, code) {
            done();
        });
    });

    grunt.registerTask('build-server', function () {
        var done = this.async();
        grunt.util.spawn({
            grunt: true,
            args: ['build'],
            opts: {
                cwd: 'server'
            }
        }, function (err, result, code) {
            done();
        });
    });




    // Print a timestamp, this help you determine the last build
    // with a quick glance at the terminal
    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(Date());
    });

    grunt.packageInfo = grunt.file.readJSON('package.json');
    grunt.packageDir = 'package';

    // Project configuration.
    grunt.initConfig({
        distdir: 'dist',
        pkgdir: grunt.packageDir,
        pkg: grunt.file.readJSON('package.json'),
        banner:
        '/*! <%= pkg.title || pkg.name %> - version:<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
        '<%= pkg.homepage ? " * " + pkg.homepage : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;*/\n',

        clean: {
            preBuild: ['<%= distdir %>/*'],
            postBuild: ['<%= distdir %>/temp'],
            prePackage: ['<%= pkgdir %>/*'],
            postPackage: ['<%= pkgdir %>/temp']
        },

        copy: {
            packageAssets: {
                files: [
                    {dest: '<%= pkgdir %>/temp', src : '**', expand: true, cwd: '<%= distdir %>'},
                    {dest: '<%= pkgdir %>/temp', src : '.npmrc', expand: true, cwd: '<%= distdir %>'},
                    {dest: '<%= pkgdir %>/temp', src : 'node_modules/**', expand: true, cwd: 'server'}
                ]
            }
        },

        compress: {
            main: {
                options: {
                    mode: 'tgz',
                    archive: function () {
                        return grunt.packageDir + '/' + grunt.packageInfo.name + '-' + grunt.packageInfo.version + '.tgz';
                    }
                },
                files: [
                    {expand: true, cwd: '<%= pkgdir %>/temp', src: ['**/*', '.*'], dest: '/'}
                ]
            }
        }

    });
};
