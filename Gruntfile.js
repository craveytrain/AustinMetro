/*jshint quotmark:false */
module.exports = function(grunt) {
'use strict';

// Project configuration.
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
        dist: {
            files: {
                'build/': ['source/**', '!source/stylesheets/**']
            }
        }
    },
    render: {
        content: ['content/**/*.md'],
        target: 'build',
        templates: 'templates',
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
        dist: {
                options: {
                    outputStyle: 'compressed'
                }
            },
        options: {
            sassDir: 'source/stylesheets',
            cssDir: 'build/stylesheets',
            imagesDir: 'source/images'
        }

    },
    uglify: {
        dist: {
            options: {
                sourceMap: 'build/scripts/main.min.js.map',
                sourceMappingURL: 'main.min.js.map',
                prefix: '2'
            },
            files: {
                'build/scripts/main.min.js': 'build/scripts/main.js'
            }
        }
    },
    watch: {
        scripts: {
            files: 'source/scripts/**/*.js',
            tasks: ['uglify'],
            options: {
                interrupt: true
            }
        },
        stylesheets: {
            files: 'source/stylesheets/**/*.scss',
            tasks: ['compass:dev'],
            options: {
                interrupt: true
            }
        },
        templates: {
            files: ['**/*.yml', 'templates/**/*.jade', 'content/**/*.md'],
            tasks: ['render'],
            options: {
                interrupt: true
            }
        },
        staticFiles: {
            files: ['source/**', '!source/stylesheets/**'],
            tasks: ['copy'],
            options: {
                interrupt: true
            }
        }
    },
    jshint: {
        options: {
            jshintrc: '.jshintrc'
        },
        grunt: ['Gruntfile.js', 'lib/**/*.js'],
        site: ['source/**/*.js']

    },
    connect: {
        server: {
            options: {
                port: 4000,
                base: 'build'
            }
        }
    },
    clean: ['build']
});

grunt.loadNpmTasks('grunt-contrib-jade');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-contrib-compass');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadTasks('lib');

grunt.registerTask('build', ['clean', 'jshint', 'copy', 'render', 'compass:dev']);
grunt.registerTask('preview', ['build', 'connect', 'watch']);
grunt.registerTask('package', ['clean', 'jshint', 'copy', 'render', 'compass:dist', 'uglify']);

// Default task(s).
grunt.registerTask('default', ['build']);
};