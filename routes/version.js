
/*
 * GET version page.
 */

 'use strict';

 var fs = require('fs');
 var version;

 fs.readFile('./version.json', 'utf8', function (err, data) {
	if (err) {
		console.log('Error: ' + err);
		return;
	}

	version = JSON.parse(data);
 });

exports.index = function(req, res) {
	res.json(200, version);
};