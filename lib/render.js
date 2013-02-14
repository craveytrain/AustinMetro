module.exports = function(grunt) {
'use strict';

var buildPath = function(uri) {
	var path = require('path');
	var target = grunt.config('render').target;

	return target + path.sep + uri.join(path.sep) + path.sep + 'index.html';
};

var buildStations = function() {
	var path = require('path');
	var controller = 'stations';
	var stations = grunt.file.readJSON('./stations.json');
	var version = grunt.config('pkg').version;
	var obj = {};

	obj[controller] = {
		options: {
			data: {
				title: 'Stations',
				version: version,
				stations: []
			}
		},
		files: {}
	};

	obj[controller].files[buildPath([controller])] = 'views' + path.sep + 'stations.jade';

	stations.forEach(function(station) {
		var stationId = controller + path.sep + station.id;
		station.title = station.name;
		station.version = version;

		obj[stationId] = {
			options: {
				data: station
			},
			files: {}
		};

		obj[controller].options.data.stations.push(station);

		obj[stationId].files[buildPath([stationId])] = 'views' + path.sep + 'station.jade';
	});

	return obj;
};

var buildJadeData = function() {
	var extend = require('extend');

	var jadeData = extend(true /* Go Deep */,
		grunt.config('jade'),
		buildStations()
	);

	grunt.config('jade', jadeData);
};


grunt.registerTask('buildJadeData', 'Parse the markdown and render the markup from the template', buildJadeData);

grunt.registerTask('render', ['buildJadeData', 'jade']);

};