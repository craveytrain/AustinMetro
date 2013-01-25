define(function() {
	'use strict';

	var isStation = function(path) {
		return (/\/stations\/\w+/).test(path);
	};

	var hasPassed = (function() {
		var now = new Date().getTime();
		var then = new Date();

		return function(time) {
			var parsedTime = time.split(':');
			then.setHours(parsedTime[0]);
			then.setMinutes(parsedTime[1]);

			return then.getTime() < now;
		};
	}());

	var build = function() {
		var times = document.querySelectorAll('.times li');

		Array.prototype.forEach.call(times, function(time) {
			if (!hasPassed(time.textContent)) return;

			time.parentNode.appendChild(time);
		});
	};

	var init = function() {
		var path = location.pathname;
		if (!isStation(path)) return;

		build();
	};

	return {
		init: init
	};
});