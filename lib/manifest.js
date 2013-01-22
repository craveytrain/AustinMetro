module.exports = function(grunt) {
'use strict';

var generate = function() {
	var version = grunt.config('pkg').version;
	var template = grunt.file.read('lib/manifest.tmpl');
	var stations = grunt.file.readJSON('./stations.json');

	var model = {
		version: version,
		stations: stations
	};

	grunt.file.write('public/manifest.appcache', grunt.template.process(template, {data: model}));
};

grunt.registerTask('manifest', 'Generate the manifest', generate);

};