
/*
 * GET station page.
 */

 'use strict';

 var fs = require('fs');
 var file = './stations.json';

 var stations;

 fs.readFile(file, 'utf8', function (err, data) {
	if (err) {
		console.log('Error: ' + err);
		return;
	}

	stations = JSON.parse(data);
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


exports.list = function(req, res) {
	if (req.xhr) {
		res.json(200, getLocations());
	} else {
		res.render('stations', { title: 'Station List', stations: stations });
	}
};

 exports.item = function(req, res) {
	var station = stations[req.params.station.toLowerCase()];
	station.title = station.name;

	if (req.xhr) {
		res.json(200, station);
	} else {
		res.render('station', station);
	}
};