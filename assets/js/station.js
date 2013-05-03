define(['pluralize'], function() {
	'use strict';

	var isStation = function(path) {
		return (/\/stations\/\w+/).test(path);
	};

	var relateTime = function(elapsedTime) {
		var seconds = elapsedTime / 1000;
		var minutes = Math.round(seconds / 60);
		var hours = Math.round(minutes / 60);
		if (Math.abs(hours) > 1) return hours + ' ' + 'hour'.pluralize(hours);
		if (Math.abs(minutes) > 1) return minutes + ' ' + 'minute'.pluralize(minutes);

		return seconds + ' ' + 'second'.pluralize(seconds);


	};

	var timePassed = (function() {
		var now = new Date().getTime();
		var then = new Date();

		return function(time) {
			var parsedTime = time.split(':');
			then.setHours(parsedTime[0]);
			then.setMinutes(parsedTime[1]);

			return then.getTime() - now;
		};
	}());

	var build = function() {
		Array.prototype.forEach.call(document.querySelectorAll('.times'), function(timeTable) {
			var future = false;

			Array.prototype.forEach.call(timeTable.querySelectorAll('li'), function(time) {
				var elapsedTime = timePassed(time.textContent);
				var relTime = document.createElement('span');

				if (elapsedTime > 0 && !future) {
					future = true;
					time.classList.add('current');
					relTime.textContent = relateTime(elapsedTime);
					time.appendChild(relTime);
				}
			});
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