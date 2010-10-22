var metro = {
	init: function () {
		var nextNB = '5:25 AM',
				nextSB = '6:05 AM',
				refreshNB = setInterval(metro.ttl, 10000, nextNB, 'north'),
				refreshSB = setInterval(metro.ttl, 10000, nextSB, 'south');
		
		
	},
	ttl: function (t, dir) {
		var ttl = metro.delta(t);
		if (ttl >= 0) {
			x$('#' + dir + ' .relative').html(metro.relativeTS(ttl));
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

x$(window).load(metro.init);