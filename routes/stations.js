
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


exports.list = function(req, res) {
	res.render('stations', { title: 'Station List', stations: stations });
};

 exports.item = function(req, res) {
	var station = stations[req.params.station.toLowerCase()];
	station.title = station.name;
	res.render('station', station);
};