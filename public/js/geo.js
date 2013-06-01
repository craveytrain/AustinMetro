define(['lib/promise'], function(promise) {
	'use strict';

	var hasGeo = function() {
		return navigator.onLine && ('geolocation' in navigator);
	};

	var detect = function() {
		var p = new promise.Promise();

		if (!hasGeo()) p.done('not available');
		var geo = navigator.geolocation;

		geo.getCurrentPosition(
			function(position) {
				p.done(null, position);
			},
			function(error) {
				p.done(error);
			}
		);

		return p;
	};

	return {
		detect: detect
	};

});