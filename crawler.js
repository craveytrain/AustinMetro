'use strict';

var jsdom = require("jsdom");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('app.db');

var routes = {
	redline: {
		stations: [
			'downtown',
			'plazasaltillo',
			'mlkjr',
			'highland',
			'crestview',
			'kramer',
			'howard',
			'lakeline',
			'leander'
		],
		directions: {
			north: {
				monthu: {
					url: 'http://www.capmetro.org/schedulemap-rail.aspx?f1=550&s=1&d=1'
				},
				fri: {
					url: 'http://www.capmetro.org/schedulemap-rail.aspx?f1=550&s=2&d=1'
				},
				sat: {
					url: 'http://www.capmetro.org/schedulemap-rail.aspx?f1=550&s=3&d=1'
				}
			},
			south: {
				monthu: {
					url: 'http://www.capmetro.org/schedulemap-rail.aspx?f1=550&s=1&d=0'
				},
				fri: {
					url: 'http://www.capmetro.org/schedulemap-rail.aspx?f1=550&s=2&d=0'
				},
				sat: {
					url: 'http://www.capmetro.org/schedulemap-rail.aspx?f1=550&s=3&d=0'
				}
			}
		}
	}
};

var crawl = function(tableName, stations, url) {
	db.run('drop table if exists ' + tableName);
	db.run('create table ' + tableName + ' (' + stations.join(',') + ')');

	var stmt = db.prepare('INSERT INTO ' + tableName + ' VALUES (?,?,?,?,?,?,?,?,?)');

	jsdom.env(
	  url,
	  ['http://code.jquery.com/jquery.js'],
	  function (errors, window) {
	  	var $ = window.$;
	  	var $rows = $('.scheduletable tr');
	  	var times = [];

	  	$rows.splice(0,1);

	  	$rows.each(function(i, row) {
	  		$(row).find('td').each(function(j, cell) {
	  			if (j < 9 && cell.textContent) times.push(cell.textContent);
	  		});

	  		if (times.length) stmt.run(times);
		  	times = [];
	  	});
	}); // jsdom env
}

db.serialize(function() {
	for (var route in routes) { if (routes.hasOwnProperty(route)) {
		var stations;
		var directions = routes[route].directions;

		for (var direction in directions) { if (directions.hasOwnProperty(direction)) {
			stations = direction === 'north' ? routes[route].stations : routes[route].stations.reverse();
			var schedules = directions[direction];
			for (var schedule in schedules) { if (schedules.hasOwnProperty(schedule)) {
				crawl(schedule + '_' + direction, stations, schedules[schedule].url);
			}}
		}}
	}}
}); // db serialize