/*jshint quotmark:false */
module.exports = function(grunt) {
'use strict';

// Project configuration.
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
        options: {
            jshintrc: '.jshintrc'
        },
        grunt: ['Gruntfile.js'],
        server: ['app.js', 'routes/**/*.js'],
        client: ['public/**/*.js', '!**/lib/**']
    }
});

grunt.loadNpmTasks('grunt-contrib-jshint');

grunt.registerTask('build', ['jshint']);

// Default task(s).
grunt.registerTask('default', ['build']);
};