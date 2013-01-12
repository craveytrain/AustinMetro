define(['promise'], function(promise) {
	'use strict';

	var path = location.pathname;

	var clearCache = function() {
		var version = AM.version;
		while (version--) {
			var key = path + '-' + version;
			if (localStorage.getItem(key)) localStorage.removeItem(key);
		}
	};

	// Establish promise
	var p = new promise.Promise();

	// version it
	var key = path + '-' + AM.version;

	// check for cache, if there, resolve promise
	var data = localStorage.getItem(key);
	if (data) p.done(null, JSON.parse(data));

	// otherwise do the xhr, store it, resolve promise
	promise
		.get(location.href, null, {'X-Requested-With': 'XMLHttpRequest'})
		.then(function(error, result) {
			localStorage.setItem(key, result);
			p.done(null, JSON.parse(result));

			// wait a bit and scrub the cache
			setTimeout(function() {
				clearCache();
			}, 1000);
		});

	// retun promise
	return p;
});