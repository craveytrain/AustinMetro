define(['lib/promise'], function(promise) {
	'use strict';

	return function(url) {
		// Establish promise
		var p = new promise.Promise();
		var version = AM.version;

		// version it
		// var key = url + '-' + AM.version;

		// check for cache, if there, resolve promise
		var data = localStorage.getItem(url);
		if (data) {
			data = JSON.parse(data);
			if (data.version === version) p.done(null, data);
		}

		// otherwise do the xhr, store it, resolve promise
		promise
			.get(url, null, {'X-Requested-With': 'XMLHttpRequest'})
			.then(function(error, result) {
				localStorage.setItem(url, result);
				p.done(null, JSON.parse(result));
			});

		// retun promise
		return p;
	};
});