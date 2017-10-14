module.exports = function(grunt) {

    var userprofile = getUserHome();
    grunt.file.preserveBOM = true;
    grunt.file.defaultEncoding = 'utf8';

    // Load all of our NPM tasks
    // Make sure you add the task package to the 'package.json' file
    // and run 'npm install' before you add the package here
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-exec');

    // Default task, so if you just run 'grunt', this is what it will do
    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', [
        'exec:npmVersion',
        'clean:preBuild',
        'oauth',
        'copy:sampleApp',
        'copy:sampleServer',
        'exec:npmConfig',
        'copyAllToAdamsUIServerNodeModules'
    ]);

    // Utility tasks, these are primarily used by the watchers and the dev build
    grunt.registerTask('oauth', ['copy:stgAuth']);

    // Print a timestamp, this help you determine the last build
    // with a quick glance at the terminal
    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(Date());
    });

    grunt.stgVersion = "";
    grunt.registerTask('getSTGVersion', function() {
        var stgPackage = grunt.file.readJSON("node_modules/stgwebutils-client-libs/package.json");
        grunt.stgVersion = stgPackage.version;
    });
    grunt.registerTask('copyAllToAdamsUIServerNodeModules', ['clean:adamsContents', 'copy:copyAllToAdamsUIServerNodeModules', 'exec:runAdamsUIServerGruntBuild']);

    grunt.packageInfo = grunt.file.readJSON('package.json');

    // Project configuration.
    grunt.initConfig({
        distdir: 'dist',
        tempdir: 'temp',
        userprofile: userprofile,
        pkg: grunt.packageInfo,
        banner:
        '/*! <%= pkg.title || pkg.name %> - version:<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
        '<%= pkg.homepage ? " * " + pkg.homepage : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;*/\n',

        src: {
            js: ['src/*.js']
        },

        exec: {
            npmVersion: {
                command: 'cd src && npm version patch'
            },
            npmConfig: {
                command: 'cd buildscripts && node postBuild.js'
            },
            runAdamsUIServerGruntBuild: {
                command: 'cd <%= userprofile %>/workspace/Adams UI/server/ && grunt build'
            }
        },

        clean: {
            preBuild: ['<%= distdir %>/*'],
            adamsContents: ['<%= userprofile %>/workspace/Adams UI/server/node_modules/stgwebutils-server-oauth/*'],
            options: {force: true}
        },

        copy: {
            stgAuth: {
                files: [
                    {dest: '<%= distdir %>', src: 'src/*.js', expand:true, flatten: true},
                    {dest: '<%= distdir %>', src: 'src/package.json', expand:true, flatten:true},
                    {dest: '<%= distdir %>', src: 'src/README.md', expand:true, flatten:true},
                    {dest: '<%= distdir %>', src: 'src/.npm*', expand:true, flatten:true},
                    {dest: '<%= distdir %>', src: 'node_modules/**', expand:true, cwd:'src/'}
                ]
            },
            sampleServer: {
                files: [
                    {dest: '<%= distdir %>/sample', src: ['sample-server/*.js*'], expand:true},
                    {dest: '<%= distdir %>/sample', src: ['sample-server/.npmrc'], expand:true}
                ]
            },
            sampleApp: {
                files: [
                    {dest: '<%= distdir %>/sample', src: 'sample-app/**/*', expand:true}
                ]
            },
            copyAllToAdamsUIServerNodeModules: {
                files: [{
                    expand: true,
                    cwd: '<%= distdir %>',
                    src: ['**/*','.npmrc'],
                    dest: '<%= userprofile %>/workspace/Adams UI/server/node_modules/stgwebutils-server-oauth'
                }]
            }
        }

    });

    function getUserHome() {
        return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
    }
};
