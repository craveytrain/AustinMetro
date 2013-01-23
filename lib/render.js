module.exports = function(grunt) {
'use strict';

var buildJadeData = function() {
	var path = require('path');
	var stations = grunt.file.readJSON('./stations.json');
	var jadeData = grunt.config('jade');
	var target = grunt.config('render').target;

	stations.forEach(function(station) {
		var stationId = 'stations' + path.sep + station.id;
		station.title = station.name;
		station.version = grunt.config('pkg').version;

		jadeData[stationId] = {
			options: {
				data: station
			},
			files: {}
		};

		jadeData[stationId].files[target + path.sep + stationId + path.sep + 'index.html'] = 'views' + path.sep + 'station.jade';
	});

	// console.log(JSON.stringify(jadeData));

	grunt.config('jade', jadeData);
};


grunt.registerTask('buildJadeData', 'Parse the markdown and render the markup from the template', buildJadeData);

grunt.registerTask('render', ['buildJadeData', 'jade']);

};