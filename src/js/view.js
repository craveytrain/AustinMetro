metro.view = {
	init: function () {
		// Sub to setStation
		metro.util.sub('setStation', metro.view.station.set);
		
		// Sub to setTime
		metro.util.sub('setTime', metro.view.time.next);
	},
	station: {
		set: function () {}
	},
	time: {
		next: function () {},
		futures: function () {}
	}
};

/* DOM Ready Event */
document.addEventListener('DOMContentLoaded', metro.view.init, false);