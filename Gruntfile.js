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
        client: ['assets/**/*.js', '!**/lib/**']
    },
    copy: {
        dev: {
            files: [
                { cwd: 'assets', src: ['**'], dest: 'build/', filter: 'isFile', expand: true },
                { src: ['stations.json'], dest: 'build/stations/' }
            ]
        }
    },
    compass: {
        dev: {
            options: {
                outputStyle: 'expanded',
                debugInfo: true
            }
        },
        prod: {
            options: {
                outputStyle: 'compressed'
            }
        },
        options: {
            sassDir: 'sass',
            cssDir: 'build/css'
        }
    },
    requirejs: {
        compile: {
            options: {
                baseUrl: 'assets/js',
                name: 'main',
                dir: 'build/js'
            }
        }
    },
    watch: {
        styles: {
            files: ['sass/**/*'],
            tasks: ['compass:dev'],
            options: {
                interrupt: true
            }
        },
        scripts: {
            files: ['assets/js/**/*'],
            tasks: ['jshint', 'copy:dev'],
            options: {
                interrupt: true
            }
        }
    },
    manifest: {
        target: 'build/manifest.appcache'
    },
    clean: ['build']
});

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-compass');
grunt.loadNpmTasks('grunt-contrib-requirejs');
grunt.loadTasks('tasks');

grunt.registerTask('build', ['jshint', 'clean']);

grunt.registerTask('preview', ['build', 'copy:dev', 'compass:dev', 'watch']);

grunt.registerTask('package', ['build', 'compass:prod', 'requirejs', 'manifest']);

// Default task(s).
grunt.registerTask('default', ['preview']);
};