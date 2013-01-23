define(function() {
	'use strict';

	var isStation = function(path) {
		return (/\/stations\/\w+/).test(path);
	};

	var relativeTime = (function() {
		var currentTime = new Date().getTime();
		var pickupTime = new Date();
		var isNext = true;

		return function(time) {
			var parsedTime = time.split(':');
			pickupTime.setHours(parsedTime[0]);
			pickupTime.setMinutes(parsedTime[1]);

			if (pickupTime.getTime() < currentTime) {
				isNext = true;
				return 'past';
			} else {
				if (isNext) {
					isNext = false;
					return 'next';
				}
				return 'future';
			}
		};
	}());

	var build = function() {
		var times = document.querySelectorAll('.times li');

		Array.prototype.forEach.call(times, function(time) {
			time.classList.add(relativeTime(time.textContent));
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