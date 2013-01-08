module.exports = function(grunt) {
'use strict';


var buildData = function() {
	var path = require('path');
	var stations = grunt.file.readJSON('stations.json');
	var data = grunt.config('jade');
	var config = grunt.config('render');
	var target = config.target;
	var templates = config.templates;


	for (var station in stations) {
		if (stations.hasOwnProperty(station)) {
			data[station] = {
				options: {
					data: stations[station]
				},
				files: {}
			};

			data[station].options.data.id = station.toLowerCase();

			data[station].files[target + path.sep + station.toLowerCase() + path.sep + 'index.html'] = templates + path.sep + 'station.jade';
		}
	}

	grunt.config('jade', data);
};

grunt.registerTask('buildData', 'Build the data', buildData);
};