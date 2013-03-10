module.exports = function(grunt) {
'use strict';

var buildPath = function(uri) {
	var path = require('path');

	return uri.join(path.sep);
};

var buildStations = function() {
	var controller = 'stations';
	var stations = grunt.file.readJSON('./stations.json');
	var version = grunt.config('pkg').version;
	var target = grunt.config('render').target;
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

	obj[controller].files[buildPath([target, controller, 'index.html'])] = buildPath(['views', 'stations.jade']);

	stations.forEach(function(station) {
		var stationId = buildPath([controller, station.id]);
		station.title = station.name;
		station.version = version;

		station.routes.forEach(function(route) {
			route.map = grunt.file.read(buildPath(['maps', route.id + '.svg']));
		});

		obj[stationId] = {
			options: {
				data: station
			},
			files: {}
		};

		obj[controller].options.data.stations.push(station);

		obj[stationId].files[buildPath([target, stationId, 'index.html'])] = buildPath(['views', 'station.jade']);
	});

	return obj;
};

var buildIndex = function() {
	var path = require('path');
	var target = grunt.config('render').target;
	var obj = {};

	obj[path.sep] = {
		options: {
			data: {
				title: 'AustinMetro',
				version: grunt.config('pkg').version
			}
		},
		files: {}
	};

	obj[path.sep].files[buildPath([target, 'index.html'])] = buildPath(['views', 'index.jade']);

	return obj;
};

var buildJadeData = function() {
	var extend = require('extend');

	var jadeData = extend(true /* Go Deep */,
		grunt.config('jade'),
		buildStations(),
		buildIndex()
	);

	grunt.config('jade', jadeData);
};


grunt.registerTask('buildJadeData', 'Parse the markdown and render the markup from the template', buildJadeData);

grunt.registerTask('render', ['buildJadeData', 'jade']);

};