define(['cache'], function(cache) {
	'use strict';

	cache.then(function(error, result) {
		if (error) return;
		console.log(result);
	});
});