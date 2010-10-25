var metro = {
	station: '',
	refresh: {},
	init: function () {
		// First things first, cache the station
		metro.station = metro.getStation();
	
		// Find all the directions
		var aRoutes = document.querySelectorAll('.route'),
				l = aRoutes.length;
	
		while (l--) {
			// Find the direction, get the schedule, find the next ride and show it
			var dir = aRoutes[l].id;
			metro.setup(dir);
			metro.next.set(dir);
			metro[dir].refresh = setInterval(metro.next.set, 60000, dir);
			
			var nextNav = document.querySelectorAll('.route nav'),
					i = nextNav.length;

			while (i--) {
				nextNav[i].addEventListener('click', metro.seeNextTrain, false);
			}
		}
	},
	setup: function (dir) {
		// Create directional data objects
		metro[dir] = {
			available: metro.getSchedule(dir, metro.station),
			time: new Date,
			index: 0
		};
	},
	next: {
		find: function (dir) {
			if (metro[dir].index === metro[dir].available.length) {
				metro[dir].index = 0;
				metro[dir].time.setDate(metro[dir].time.getDate() + 1);
			}

			var aTime = metro[dir].available[metro[dir].index].split(':');
			
			metro[dir].time.setHours(aTime[0]);

			metro[dir].time.setMinutes(aTime[1]);

			metro[dir].ttl = metro.compareTime(metro[dir].time);
			
			if (metro[dir].ttl < 0) {
				metro[dir].index++;
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
					available = '';
			
			time.innerHTML = metro[dir].time.to12HourPeriodString();
			relativeMsg.innerHTML = metro.relativeTS(metro[dir].ttl);
			
			// Show current and next 5
			var i = metro[dir].index,
					cap = i + 5;
			for (; i < cap; i++) {
				if (typeof metro[dir].available[i] === 'undefined') break;
				var t = metro.format.to12Hour(metro[dir].available[i]),
						selected = (t == metro[dir].time.to12HourString()) ? ' class="selected"' : '';
				
				available += '<li' + selected + ' data-time="' + metro[dir].available[i] + '">' + t + '</li>';
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
					
			metro[dir].time.setHours(aTime[0]);

			metro[dir].time.setMinutes(aTime[1]);

			metro[dir].ttl = metro.compareTime(metro[dir].time);
			
			metro.next.show(dir);
		}
	},
	getStation: function () {
		// TODO: detect real station
		return 'Lakeline';
	},
	getSchedule: function (dir, station) {
		// TODO: get list from somewhere
		return metro.data[dir][station];
	}
};

document.addEventListener('DOMContentLoaded', metro.init, false);

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
		
	}
};