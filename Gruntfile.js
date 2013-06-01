/*jshint maxstatements:99 */
module.exports = function(grunt) {
'use strict';

// Project configuration.
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
        options: {
            jshintrc: '.jshintrc'
        },
        build: ['Gruntfile.js', 'lib/**/*.js'],
        server: ['app.js', 'routes/**/*.js'],
        client: ['public/**/*.js', '!**/lib/**']
    },

    manifest: {
        target: 'build/manifest.appcache'
    }
});

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadTasks('tasks');

grunt.registerTask('build', ['jshint']);

// Default task(s).
grunt.registerTask('default', ['build']);
};