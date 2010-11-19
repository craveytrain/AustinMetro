var metro = {
	data: {}
};

metro.init = function () {
	metro.time.init();
	metro.station.init();
	metro.route.init();
};

metro.route = {
	init: function() {
		metro.data.route = {};
		metro.route.get();
	},
	get: function () {
		var route = 'redline';
		metro.route.set(route);
	},
	set: function (route) {
		metro.data.route = tempData[route];
		metro.data.route.name = route;
		metro.util.pub('route', [route]);
	}
};

metro.station = {
	init: function () {
		metro.util.sub('route', metro.station.get);
		metro.data.user = {};
	},
	get: function (route) {
		var data = metro.data,
				user = data.user,
				stations = data.route.stations,
				closest, distance;
		if (navigator.geolocation) {
			try {
				navigator.geolocation.getCurrentPosition(function(pos) {
					user.pos = [pos.coords.latitude, pos.coords.longitude];

					for (var station in stations) {
						if (stations.hasOwnProperty(station)) {
							console.log(user.station);
							console.log(closest);
							distance = +metro.geo.distance(user.pos, stations[station]);
							console.log(station);
							console.log(distance);
							console.log('--------------');
							if (typeof user.station === 'undefined') {
								closest = distance;
								metro.station.set(station);
							} else if (distance < closest) {
								closest = distance;
								metro.station.set(station);
							}
						}
					}
					metro.util.pub('station', [user.station]);

					// TODO: add watch for change
				},
				function(err){
					metro.util.pub('noGeo');
				});
			} catch (err) {
				metro.util.pub('noGeo');
			}
		} else {
			metro.util.pub('noGeo');
		}
		
	},
	set: function (station) {
		metro.data.user.station = station;
		// metro.util.pub('station', [station]);
	}
};

metro.time = {
	init: function () {
		metro.util.sub('station', metro.time.get);
	},
	get: function (station) {
		var dirs = metro.data.route.dirs,
				times, date, aTime, ttl, l;
		
		for (var dir in dirs) {
			times = dirs[dir][station];
			l = times.length;
			date = new Date();
			
			for (var i = 0; i < l; i++) {
				aTime = times[i].split(':');
				date.setHours(aTime[0]);
				date.setMinutes(aTime[1]);
				
				ttl = metro.time.compare(date);
				
				if (ttl > 0) {
					metro.util.pub('time', [dir, times[i], ttl]);
					break;
				}
			}
			if (ttl < 0) {
				date = date.setDate(date.getDate() + 1);
				aTime = times[0].split(':');
				date.setHours(aTime[0]);
				date.setMinutes(aTime[1]);
				ttl = metro.time.compare(date);
				metro.util.pub('time', [dir, times[0], ttl]);
			}
		}
	},
	compare: function (then) {
		var now = new Date;
				
		return Math.floor((then - now) / 60000);
	}
};

/* Utils */
metro.util = {
	cache: {},
	pub: function (/* String */topic, /* Array? */args) {
		console.log('pub\'d ' + topic + ': ' + args); // TODO: dev line, remove
		if (metro.util.cache[topic]) {
			var l = metro.util.cache[topic].length;

			for (var i = 0; i < l; i++) {
				metro.util.cache[topic][i].apply(this, args || []);
			}
		}
	},
	sub: function (/* String */topic, /* Function */callback) {
		if (!metro.util.cache[topic]) {
			metro.util.cache[topic] = [];
		}

		metro.util.cache[topic].push(callback);
		return [topic, callback]; // Array
	},
	unsub: function (/* Array */handle) {
		var t = handle[0];
		if (metro.util.cache[t]) {
			var l = metro.util.cache[t].length;
			
			for (var i = 0; i < l; i++) {
				if (metro.util.cache[t][i] == handle[1]) {
					metro.util.cache[t].splice(i, 1);
				}
			}
		}
	}
};

metro.geo = {
	distance: function (coord1, coord2) {
		// default 4 sig figs reflects typical 0.3% accuracy of spherical model
		// borrowed from http://www.movable-type.co.uk/scripts/latlong.html with some minor adjustments

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
	  return d;
	}
};


/* Prototype methods */
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

metro.init();