define([
	'cache',
	'geo',
	'lib/promise'
], function(
	cache,
	geo,
	promise
) {
	'use strict';

	var isStationList = function(path) {
		return (/^\/(stations\/)?$/).test(path);
	};

	var protos = function() {
		// Extend Math methods (borrowed from http://www.movable-type.co.uk/scripts/latlong.html)
		// Convert numeric degrees to radians
		if (typeof Number.prototype.toRad === 'undefined') {
			Number.prototype.toRad = function() {
				return this * Math.PI / 180; // Int
			};
		}
	};



	var getDistance = function(coord1, coord2) {
		protos();
		// default 4 sig figs reflects typical 0.3% accuracy of spherical model
		// borrowed from http://www.movable-type.co.uk/scripts/latlong.html with some minor adjustments

		var R = 6371;
		var lat1 = coord1[0].toRad(), lon1 = coord1[1].toRad();
		var lat2 = coord2[0].toRad(), lon2 =coord2[1].toRad();
		var dLat = lat2 - lat1;
		var dLon = lon2 - lon1;

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) * Math.sin(dLon/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c;

		return d; // Int
	};

	var findNearest = function(stations, userLocation) {
		var coords = [userLocation.coords.latitude, userLocation.coords.longitude],
			nearest;

		stations.forEach(function(station) {
			var distance = getDistance(station.pos, coords);
			if (!nearest) {
				nearest = {
					station: station.slug,
					distance: distance
				};
			} else {
				if (distance < nearest.distance) {
					nearest = {
						station: station.slug,
						distance: distance
					};
				}
			}
		});

		return nearest;
	};


	var init = function() {
		var path = location.pathname;
		if (!isStationList(path)) return;

		promise
			.join([
				function() {
					return cache('/stations');
				},
				function() {
					return geo.detect();
				}
			])
			.then(function(errors, results) {
				if (errors[0] || errors[1]) return;

				var nearestStation = findNearest(results[0], results[1]);

				window.location = '/stations/' + nearestStation.station;
			});
	};


	return {
		init: init
	};
});