
/*
 * GET station page.
 */

 'use strict';

 var fs = require('fs');
 var file = './stations.json';

 var stations, version;

 fs.readFile(file, 'utf8', function (err, data) {
	if (err) {
		console.log('Error: ' + err);
		return;
	}

	stations = JSON.parse(data);
 });

 fs.readFile('./package.json', 'utf8', function(err, data) {
	if (err) {
		console.log('Error: ' + err);
		return;
	}

	version = JSON.parse(data).version;

 });

 var getLocations = function() {
	var locations = [];

	for (var station in stations) {
		if (stations.hasOwnProperty(station)) {
			locations.push({
				pos: stations[station].pos,
				slug: stations[station].slug
			});
		}
	}

	return locations;
 };


exports.index = function(req, res) {
	if (req.xhr) {
		res.json(200, getLocations());
	} else {
		res.render('stations', { title: 'Station List', stations: stations, version: version });
	}
};

 exports.item = function(req, res) {
	var station = stations[req.params.station.toLowerCase()];
	var model = {
		station: station,
		title: station.name,
		version: version
	};

	if (req.xhr) {
		res.json(200, model);
	} else {
		res.render('station', model);
	}
};