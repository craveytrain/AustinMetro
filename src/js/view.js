metro.view = {
	init: function () {
		metro.util.sub('station', metro.view.station.set);
		metro.util.sub('route', metro.view.station.list);
		metro.util.sub('time', metro.view.time.next);
		
		if (metro.data.route.stations) metro.view.station.list();
	},
	station: {
		set: function (station) {
			var title = document.getElementById('station'),
					select = document.getElementById('stations');
			title.innerHTML = station;
			
			select.selected = station;
		},
		list: function () {
			var select = document.getElementById('stations'),
					routeStations = metro.data.route.stations,
					options = '';
			
			for (var routeStation in routeStations) {
				if (routeStations.hasOwnProperty(routeStation)) {
					options += '<option value="' + routeStation + '">' + routeStations[routeStation].name + '</option>';
				}
			}
			select.innerHTML = options;
			
			select.addEventListener('change', metro.view.station.changeHandler, false);
		},
		changeHandler: function () {
			metro.util.pub('station', [this.value]);
		}
	},
	time: {
		next: function () {},
		futures: function () {}
	}
};

/* DOM Ready Event */
document.addEventListener('DOMContentLoaded', metro.view.init, false);