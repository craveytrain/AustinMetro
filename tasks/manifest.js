module.exports = function(grunt) {
'use strict';

var generate = function() {
	var version = grunt.config('pkg').version;
	var template = grunt.file.read('tasks/manifest.tmpl');
	var stations = grunt.file.readJSON('./stations.json');

	var model = {
		version: version,
		stations: stations,
		assets: [
			'/css/style.css',
			'/js/lib/require.js',
			'/js/main.js'
		]
	};

	grunt.file.write(grunt.config('manifest').target, grunt.template.process(template, {data: model}));
};

grunt.registerTask('manifest', 'Generate the manifest', generate);

};