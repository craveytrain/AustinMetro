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
        run: ['assets/**/*.js', '!**/lib/**']
    },
    copy: {
        dev: {
            files: {
                'build/js/': ['assets/js/**/*.js'],
                'build/stations/': ['stations.json']
            }
        }
    },
    render: {
        target: 'build'
    },
    jade: {
        options: {
           pretty: true
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
            sassDir: 'assets/sass',
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
    connect: {
        server: {
            options: {
                port: 3000,
                base: 'build'
            }
        }
    },
    watch: {
        views: {
            files: ['views/**/*', 'stations.json'],
            tasks: ['render'],
            options: {
                interrupt: true
            }
        },
        styles: {
            files: ['assets/sass/**/*'],
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
grunt.loadNpmTasks('grunt-contrib-jade');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-compass');
grunt.loadNpmTasks('grunt-contrib-requirejs');
grunt.loadTasks('lib');

grunt.registerTask('build', ['jshint', 'clean', 'render']);

grunt.registerTask('preview', ['build', 'copy:dev', 'compass:dev', 'connect', 'watch']);

grunt.registerTask('package', ['build', 'compass:prod', 'requirejs', 'manifest']);

// Default task(s).
grunt.registerTask('default', ['preview']);
};