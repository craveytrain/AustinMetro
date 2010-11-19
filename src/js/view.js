metro.view = {
	init: function () {
		metro.util.sub('time', metro.view.time.init);
		metro.util.sub('station', metro.view.station.set);
		metro.util.sub('route', metro.view.station.list);
		
		if (metro.data.route.stations) metro.view.station.list();
		metro.util.pub('route', [metro.data.route.name]);
	},
	station: {
		set: function (station) {
			var title = document.getElementById('station'),
					select = document.getElementById('stations'),
					l = select.options.length;

			title.innerHTML = metro.data.route.stations[station].name;
			
			for (var i = 0; i < l; i++) {
				if (select.options[i].value === station) {
					select.options[i].selected = true;
					break;
				}
			}
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
		init: function (dir, time, ttl) {
			metro.view.time.build(dir, time, ttl);
		},
		build: function (dir, time, ttl) {
			var parent = document.getElementById('upcoming'),
					// Create nodes
					section = document.createElement('section'),
					heading = document.createElement('h1'),
					headingTxt = document.createTextNode(dir),
					nextCont = document.createElement('p'),
					next = document.createElement('time'),
					nextTxt = document.createTextNode(time),
					relative = document.createElement('span'),
					relativeTxt = document.createTextNode('in ' + ttl + ' minutes'),
					nav = document.createElement('nav'),
					list = document.createElement('ol'),
					listItem = document.createElement('li');
					
			// Set attributes & values
			section.className = 'route';
			section.id = dir;
			relative.className = 'relative';
			
			// Put it all together
			section.appendChild(heading);
			heading.appendChild(headingTxt);
			section.appendChild(nextCont);
			nextCont.appendChild(next);
			next.appendChild(nextTxt);
			nextCont.appendChild(relative);
			relative.appendChild(relativeTxt);
			section.appendChild(nav);
			nav.appendChild(list);
			list.appendChild(listItem);
			
			// Drop it in the DOM
			parent.appendChild(section);
					
		}
	}
};

/* DOM Ready Event */
document.addEventListener('DOMContentLoaded', metro.view.init, false);