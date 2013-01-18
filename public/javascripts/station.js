define([
	'cache',
	'lib/dot',
	'lib/text!templates/route.tmpl'
], function(
	cache,
	dot,
	routeTmpl
) {
	'use strict';

	var isStation = function(path) {
		return (/\/stations\/\w+/).test(path);
	};

	var relativeTime = function() {
		var currentTime = new Date().getTime();
		var pickupTime = new Date();
		var isNext = true;

		return function(time) {
			var parsedTime = time.split(':');
			pickupTime.setHours(parsedTime[0]);
			pickupTime.setMinutes(parsedTime[1]);

			if (pickupTime.getTime() < currentTime) {
				return 'past';
			} else {
				if (isNext) {
					isNext = false;
					return 'next';
				}
				return 'future';
			}
		};
	};

	var build = function(station) {
		var stationContainer = document.getElementById('routes');

		dot.templateSettings.varname = 'station';
		dot.templateSettings.strip = false;

		station.relativeTime = relativeTime();
		var routeTmplCompiled = dot.template(routeTmpl);
		stationContainer.insertAdjacentHTML('afterbegin', routeTmplCompiled(station));
	};

	var init = function() {
		var path = location.pathname;
		if (!isStation(path)) return;

		cache(path).then(function(error, result) {
			if (error) return;
			build(result);
		});
	};

	return {
		init: init
	};
});