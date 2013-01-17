define(['cache', 'station'], function(cache, station) {
	'use strict';

	cache.then(function(error, result) {
		if (error) return;
		station.build(result);
	});
});