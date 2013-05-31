module.exports = function(grunt) {
'use strict';

var taskName = 'getTimetables';

var buildModel = function() {
	var stations = grunt.file.readJSON('data/stations.json');


	// Fill out the station routes with the route data
	Object.keys(stations).forEach(function(stationName) {
		var station = stations[stationName];

		station.routes = station.routes.map(function(route) {
			return routes[route];
		});
	});

	grunt.config(taskName, stations);
};

var buildRoutes = function() {
	var done = this.async();
	// collectURLs();
	// var urls = collectURLs();
	// console.log(grunt.util.async.map(urls, scrape, function(err, results) {
	// 	console.log(results);
	// }));

	grunt.util.async.series(
		[
			collectURLs
			// collectURLs,
			// function(callback) {
			// 	console.log('second function');
			// 	console.log('args', arguments);
			// 	callback(null, 'more testing');
			// }
		],
		function(err, results) {
			console.log('last function');
			console.log('args', arguments);
			done();
		}
	);
};

var collectURLs = function(callback) {
	var routes = grunt.file.readJSON('data/routes.json');
	var timeTables = [];

	// Iterate routes
	Object.keys(routes).forEach(function(routeName) {
		var route = routes[routeName];
		var stations = route.stations;
		var directions = route.directions;

		// Iterate directions
		Object.keys(directions).forEach(function(direction) {
			var days = directions[direction];

			// Iterate day specific URLs
			Object.keys(days).forEach(function(day) {
				var localStations = stations.map(function(station) {
					return station;
				});

				timeTables.push([days[day], direction === 'north' ? localStations : localStations.reverse()]);
			});
		});
	});

	console.log('collectURLs');
	grunt.util.async.map(timeTables, scrape, function(err, results) {
		callback(results);
	});
};

var scrape = function(data, callback) {
	var stations = data[1];
	var timeTable = {};

	// build out time table
	stations.forEach(function(stationName) {
		timeTable[stationName] = [];
	});

	require('jsdom').env(
		data[0], // URL
		['http://code.jquery.com/jquery.js'],
		function (errors, window) {
			var $ = window.$;
			var $rows = $('.scheduletable tr');

			$rows.splice(0,1); // first row has no data

			// For each row in the timetable
			$rows.each(function(i, row) {
				$(row).find('td').each(function(j, cell) {
					// If column is a station and the row has content, add it to the time table
					if (j < stations.length && cell.textContent) timeTable[stations[j]].push(cell.textContent);

				}); // each cell
			}); // each row

			callback(null, timeTable);
		} // jsdom callback
	); // jsdom env
};

grunt.registerTask('buildRoutes', 'Build up the routes', buildRoutes);

grunt.registerTask('buildModel', 'Build up the station model', buildModel);
// grunt.registerTask('crawl', 'Crawl for the routes', crawl);

// grunt.registerTask(taskName, ['crawl', 'buildModel']);

};