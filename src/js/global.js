var metro = {
	init: function () {
		var nextNB = '5:25 AM',
				nextSB = '6:05 AM',
				refreshNB = setInterval(metro.ttl, 60000, nextNB, 'north'),
				refreshSB = setInterval(metro.ttl, 60000, nextSB, 'south');
	},
	ttl: function (t, dir) {
		var ttl = metro.delta(t);
		if (ttl >= 0) {
			var relMsg = document.querySelector('#' + dir + ' .relative');
			relMsg.innerHTML = metro.relativeTS(ttl);
		}
	},
	delta: function (t) {
		var now = new Date,
				then = new Date;
		
		if (t) then.setTime(Date.parse(then.toDateString() + ' ' + t));
		
		return Math.floor((then - now) / 60000);
	},
	relativeTS: function (d) {
		if (d === 0) return 'any second now';
		if (d === 1) return 'in 1 minute';
		if (d < 90) return 'in ' + d + ' minutes';
		if (d < 1440) return 'in ' + Math.floor(d / 60) + ' hours';
	}
};

document.addEventListener('DOMContentLoaded', metro.init, false);


/* Temp Data */
metro.data = {
	southbound: {
		Leander: ['5:25 AM', '6:00 AM', '6:35 AM', '7:10 AM', '7:54 AM'],
		Lakeline: ['5:40 AM', '6:15 AM', '6:50 AM', '7:25 AM', '8:09 AM'],
		Howard: ['5:53 AM', '6:28 AM', '7:03 AM', '7:38 AM', '8:02 AM', '8:22 AM'],
		Kramer: ['6:00 AM', '6:35 AM', '7:10 AM', '7:45 AM', '8:08 AM', '8:29 AM'],
		Crestvew: ['6:07 AM', '6:42 AM', '7:17 AM', '7:52 AM', '8:15 AM', '8:36 AM'],
		Highland: ['6:10 AM', '6:45 AM', '7:20 AM', '7:55 AM', '8:18 AM', '8:39 AM'],
		MLKJr: ['6:17 AM', '6:52 AM', '7:27 AM', '8:02 AM', '8:25 AM', '8:46 AM'],
		PlazaSaltillo: ['6:23 AM', '6:58 AM', '7:33 AM', '8:08 AM', '8:31 AM', '8:52 AM'],
		Downtown: ['6:27 AM', '7:02 AM', '7:37 AM', '8:12 AM', '8:35 AM', '8:56 AM']
	},
	northbound: {
		Leander: ['7:43 AM'],
		Lakeline: ['7:29 AM'],
		Howard: ['7:16 AM', '7:50 AM'],
		Kramer: ['7:07 AM', '7:44 AM'],
		Crestvew: ['7:01 AM', '7:37 AM', '9:25 AM'],
		Highland: ['6:58 AM', '7:34 AM', '9:22 AM'],
		MLKJr: ['6:51 AM', '7:27 AM', '9:15 AM'],
		PlazaSaltillo: ['6:43 AM', '7:19 AM', '9:07 AM'],
		Downtown: ['6:41 AM', '7:17 AM', '9:05 AM']
		
	}
};