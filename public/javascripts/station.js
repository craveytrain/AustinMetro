define(['lib/dot', 'lib/text!templates/route.tmpl'], function(dot, routeTmpl) {
	'use strict';
	dot.templateSettings.varname = 'station';
	dot.templateSettings.strip = false;

	var relativeTime = function(time) {
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

		station.relativeTime = relativeTime();
		var routeTmplCompiled = dot.template(routeTmpl);
		stationContainer.insertAdjacentHTML('afterbegin', routeTmplCompiled(station));
	};

	return {
		build: build
	};
});