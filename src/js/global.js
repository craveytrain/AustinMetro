var metro = {
	refresh: {},
	init: function () {
		// Find all the directions
		var aRoutes = document.querySelectorAll('.route'),
				l = aRoutes.length,
				stations = document.getElementById('station');
	
		while (l--) {
			// Find the direction, get the schedule, find the next ride and show it
			var dir = aRoutes[l].id;
			metro.setup(dir);
			metro.next.set(dir);
			metro[metro.route][dir].refresh = setInterval(metro.next.set, 60000, dir);
			
			var nextNav = document.querySelectorAll('.route nav'),
					i = nextNav.length;

			while (i--) {
				nextNav[i].addEventListener('click', metro.seeNextTrain, false);
			}
			
			stations.addEventListener('change', metro.changeStation, false);
		}
	},
	setup: function (dir) {
		metro[metro.route] = {};
		// Create directional data objects
		metro[metro.route][dir] = {
			available: metro.getSchedule(dir, metro.nearestStation),
			time: new Date,
			index: 0
		};
	},
	next: {
		find: function (dir) {
			if (metro[metro.route][dir].index === metro[metro.route][dir].available.length) {
				metro[metro.route][dir].index = 0;
				metro[metro.route][dir].time.setDate(metro[metro.route][dir].time.getDate() + 1);
			}

			var aTime = metro[metro.route][dir].available[metro[metro.route][dir].index].split(':');
			
			metro[metro.route][dir].time.setHours(aTime[0]);

			metro[metro.route][dir].time.setMinutes(aTime[1]);

			metro[metro.route][dir].ttl = metro.compareTime(metro[metro.route][dir].time);
			
			if (metro[metro.route][dir].ttl < 0) {
				metro[metro.route][dir].index++;
				metro.next.find(dir);
			}
		},
		set: function (dir) {
			metro.next.find(dir);
			metro.next.show(dir);
		},
		show: function (dir) {
			var route = document.querySelector('#' + dir),
					time = route.querySelector('time'),
					relativeMsg = route.querySelector('.relative'),
					nextRoutes = route.querySelector('nav'),
					available = '',
					station = document.getElementById('nearestStation'),
					stationDropDown = document.getElementById('station'),
					l = stationDropDown.options.length;
			
			station.innerHTML = metro.nearestStation;
			
			while (l--) {
				if (stationDropDown.options[l].value === metro.nearestStation) {
					stationDropDown.options[l].selected = true;
					break;
				}
			}
			
			time.innerHTML = metro[metro.route][dir].time.to12HourPeriodString();
			relativeMsg.innerHTML = metro.relativeTS(metro[metro.route][dir].ttl);
			
			// Show current and next 5
			var i = metro[metro.route][dir].index,
					cap = i + 5;
			for (; i < cap; i++) {
				if (typeof metro[metro.route][dir].available[i] === 'undefined') break;
				var t = metro.format.to12Hour(metro[metro.route][dir].available[i]),
						selected = (t == metro[metro.route][dir].time.to12HourString()) ? ' class="selected"' : '';
				
				available += '<li' + selected + ' data-time="' + metro[metro.route][dir].available[i] + '">' + t + '</li>';
			}
			
			available = '<ol>' + available + '</ol>';
			
			nextRoutes.innerHTML = available;
		}
	},
	compareTime: function (then) {
		var now = new Date;
				
		return Math.floor((then - now) / 60000);
	},
	relativeTS: function (d) {
		if (d === 0) return 'any second now';
		if (d === 1) return 'in 1 minute';
		if (d < 120) return 'in ' + d + ' minutes';
		
		return 'in about ' + Math.floor(d / 60) + ' hours';
	},
	format: {
		to12Hour: function (t) {
			var aTime = t.split(':'),
					hours = (aTime[0] > 12) ? aTime[0] - 12 : aTime[0];
					
			if (hours === '0') hours = '12';
			
			return hours + ':' + aTime[1];
		}
	},
	seeNextTrain: function (e) {
		var clicked = e.target;
		if (clicked.tagName.toLowerCase() === 'li') {
			var dir = this.parentNode.id,
					aTime = clicked.getAttribute('data-time').split(':');
					
			metro[metro.route][dir].time.setHours(aTime[0]);

			metro[metro.route][dir].time.setMinutes(aTime[1]);

			metro[metro.route][dir].ttl = metro.compareTime(metro[metro.route][dir].time);
			
			metro.next.show(dir);
		}
	},
	changeStation: function (e) {
		metro.nearestStation = this.value;
		for (dir in metro[metro.route]) {
			if (metro[metro.route].hasOwnProperty(dir)) {
				metro.next.set(dir);
			}
		}
	},
	geo: {
		get: function () {
			navigator.geolocation.getCurrentPosition(function(pos) {
				var stationList = metro.data.stations;
				metro.user = {
					distanceTo: {},
					pos: [pos.coords.latitude, pos.coords.longitude]
 				};

				for (var station in stationList) {
					if (stationList.hasOwnProperty(station)) {
						metro.user.distanceTo[station] = +metro.geo.distance(metro.user.pos, stationList[station]);
						if (typeof metro.nearestStation === 'undefined') {
							metro.nearestStation = station;
						} else if (metro.user.distanceTo[station] < metro.user.distanceTo[metro.nearestStation]) {
							metro.nearestStation = station;
						}
					}
				}
				metro.init();

				// TODO: add watch for change
			},
			function(err){
				// TODO: do some real error checking
				console.log('something is rotten in the state of Denmark');
			});
		},
		distance: function (coord1, coord2, precision) {
			// default 4 sig figs reflects typical 0.3% accuracy of spherical model
			// borrowed from http://www.movable-type.co.uk/scripts/latlong.html
		  precision = precision || 4;  

		  var R = 6371;
		  var lat1 = coord1[0].toRad(), lon1 = coord1[1].toRad();
		  var lat2 = coord2[0].toRad(), lon2 =coord2[1].toRad();
		  var dLat = lat2 - lat1;
		  var dLon = lon2 - lon1;

		  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		          Math.cos(lat1) * Math.cos(lat2) * 
		          Math.sin(dLon/2) * Math.sin(dLon/2);
		  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		  var d = R * c;
		  return d.toPrecisionFixed(precision);
		}
	},
	getSchedule: function (dir, station) {
		// TODO: get list from somewhere
		return metro.data[dir][station];
	},
	getRoute: function () {
		metro.route = 'redline';
	}
};

// Time formatting functions
// Spit out simple 12 hour format
Date.prototype.to12HourString = function () {
	var hours = this.getHours(),
			mins = this.getMinutes();
			
	hours = (hours > 12) ? hours - 12 : hours;
	hours = (hours === 0) ? hours + 12 : hours;
	mins = (mins < 10) ? '0' + mins : mins;
	
	return hours + ':' + mins;
};

// Add period to 12 hour format
Date.prototype.to12HourPeriodString = function () {
	var period = (this.getHours() < 12) ? ' AM' : ' PM';
	
	return this.to12HourString() + period;
};

// Extend Math methods (borrowed from http://www.movable-type.co.uk/scripts/latlong.html)
// Convert numeric degrees to radians
if (typeof Number.prototype.toRad === 'undefined') {
	Number.prototype.toRad = function() {
	  return this * Math.PI / 180;
	};
}

// Convert radians to numeric (signed) degrees
if (typeof Number.prototype.toDeg === 'undefined') {
	Number.prototype.toDeg = function() {
	  return this * 180 / Math.PI;
	};
}
/** 
 * Format the significant digits of a number, using only fixed-point notation (no exponential)
 * 
 * @param   {Number} precision: Number of significant digits to appear in the returned string
 * @returns {String} A string representation of number which contains precision significant digits
 */
if (typeof(Number.prototype.toPrecisionFixed) === 'undefined') {
  Number.prototype.toPrecisionFixed = function(precision) {
    var numb = this < 0 ? -this : this;  // can't take log of -ve number...
    var sign = this < 0 ? '-' : '';
    
    if (numb == 0) { n = '0.'; while (precision--) n += '0'; return n; };  // can't take log of zero
  
    var scale = Math.ceil(Math.log(numb)*Math.LOG10E);  // no of digits before decimal
    var n = String(Math.round(numb * Math.pow(10, precision-scale)));
    if (scale > 0) {  // add trailing zeros & insert decimal as required
      l = scale - n.length;
      while (l-- > 0) n = n + '0';
      if (scale < n.length) n = n.slice(0,scale) + '.' + n.slice(scale);
    } else {          // prefix decimal and leading zeros if required
      while (scale++ < 0) n = '0' + n;
      n = '0.' + n;
    }
    return sign + n;
  };
}

document.addEventListener('DOMContentLoaded', metro.geo.get, false);

/* Temp Data */
metro.data = {
	south: {
		Leander: ['5:25', '6:00', '6:35', '7:10', '7:54', '17:23'],
		Lakeline: ['5:40', '6:15', '6:50', '7:25', '8:09', '17:37'],
		Howard: ['5:53', '6:28', '7:03', '7:38', '8:02', '8:22', '17:15', '17:51'],
		Kramer: ['6:00', '6:35', '7:10', '7:45', '8:08', '8:29', '17:22', '17:57'],
		Crestvew: ['6:07', '6:42', '7:17', '7:52', '8:15', '8:36', '15:10', '16:55', '17:30', '18:05'],
		Highland: ['6:10', '6:45', '7:20', '7:55', '8:18', '8:39', '15:13', '16:58', '17:33', '18:08'],
		MLKJr: ['6:17', '6:52', '7:27', '8:02', '8:25', '8:46', '15:20', '17:05', '17:40', '18:15'],
		PlazaSaltillo: ['6:23', '6:58', '7:33', '8:08', '8:31', '8:52', '15:26', '17:11', '17:46', '18:21'],
		Downtown: ['6:27', '7:02', '7:37', '8:12', '8:35', '8:56', '15:30', '17:15', '17:50', '18:25']
	},
	north: {
		Leander: ['7:43', '16:47', '17:57', '18:32', '19:07', '19:42'],
		Lakeline: ['7:29', '16:32', '17:42', '18:17', '18:52', '19:28'],
		Howard: ['7:16', '7:50', '16:18', '16:54', '17:28', '18:03', '18:38', '19:14'],
		Kramer: ['7:07', '7:44', '16:12', '16:47', '17:22', '17:57', '18:32', '19:08'],
		Crestvew: ['7:01', '7:37', '9:25', '16:05', '16:40', '17:15', '17:50', '18:25', '19:01'],
		Highland: ['6:58', '7:34', '9:22', '16:02', '16:37', '17:12', '17:47', '18:22', '18:59'],
		MLKJr: ['6:51', '7:27', '9:15', '15:55', '16:30', '17:05', '17:40', '18:15', '18:52'],
		PlazaSaltillo: ['6:43', '7:19', '9:07', '15:47', '16:22', '16:57', '17:32', '18:07', '18:42'],
		Downtown: ['6:41', '7:17', '9:05', '15:45', '16:20', '16:55', '17:30', '18:05', '18:40']
		
	},
	stations: {
		Leander: [30.586401, -97.855735],
		Lakeline: [30.481965, -97.786517],
		Howard: [30.397128, -97.776066],
		Kramer: [30.392786, -97.7164],
		Crestview:[30.338448, -97.719656],
		Highland: [30.328601, -97.716203],
		MLKJr: [30.279818, -97.709031],
		PlazaSaltillo: [30.262242, -97.727578],
		Downtown: [30.265012, -97.739296]
	}
};