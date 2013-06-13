require([
	'stations',
	'station',
	'touch'
], function(
	stations,
	station,
	touch
) {
	'use strict';

	stations.init();
	station.init();
	if (touch.hasTouch) touch.init()
});