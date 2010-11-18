var metro = {
	data: {}
};

metro.init = function () {
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
		metro.data.route[route] = tempData[route];
		metro.util.pub('route', [route]);
	}
};

metro.station = {
	init: function () {
		metro.util.sub('route', metro.station.get);
	},
	get: function (aRoute) {
		var station = 'Lakeline';
		metro.station.set(station);
	},
	set: function (station) {
		metro.data.station = station;
		metro.util.pub('station', [station]);
	}
};

/* Utils */
metro.util = {
	cache: {},
	pub: function (/* String */topic, /* Array? */args) {
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