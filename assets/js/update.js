define([
], function(
) {
'use strict';

var init = function() {
	var currentVersion = AM.version;

	console.log(currentVersion);

	if (window.applicationCache) {
		applicationCache.addEventListener('updateready', function() {
			if (confirm('An update is available. Reload now?')) {
				window.location.reload();
			}
		});
	}
};


return {
	init: init
};

});