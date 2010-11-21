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
			metro.station.set(this.value);
		}
	},
	time: {
		init: function (dir, date, ttl, idx) {
			ttl = metro.view.time.relative(ttl);
			var futures = metro.data.route.dirs[dir][metro.data.user.station].slice(idx, idx + 4);
			metro.view.time.build(dir, date, ttl, futures);
		},
		relative: function (d) {
			if (d === 0) return 'any second now';
			if (d === 1) return 'in 1 minute';
			if (d < 120) return 'in ' + d + ' minutes';

			return 'in about ' + Math.floor(d / 60) + ' hours';
		},
		build: function (dir, date, ttl, futures) {
			var parent = document.getElementById('upcoming'),
					// Create nodes
					section = document.createElement('section'),
					heading = document.createElement('h1'),
					headingTxt = document.createTextNode(dir),
					nextCont = document.createElement('p'),
					next = document.createElement('time'),
					nextTxt = document.createTextNode(date.to12HourPeriodString()),
					relative = document.createElement('span'),
					relativeTxt = document.createTextNode(ttl),
					nav = document.createElement('nav'),
					list = document.createElement('ol'),
					listItem = document.createElement('li'),
					l = futures.length,
					future, futureListItem;
					
					
			for (var i = 0; i < l; i++) {
				futureListItem = listItem.cloneNode(false);
				if (i === 0) futureListItem.className = 'selected';
				future = document.createTextNode(futures[i]);
				futureListItem.appendChild(future);
				list.appendChild(futureListItem);
			}
					
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
			
			// Drop it in the DOM
			parent.appendChild(section);
		},
		futures: function (dir, idx) {
			var station = metro.data.user.station,
					times = metro.data.route.dirs[dir][station],
					l = times.length,
					futures = times.slice(idx, idx + 4);
								
		}
	}
};

/* DOM Ready Event */
document.addEventListener('DOMContentLoaded', metro.view.init, false);