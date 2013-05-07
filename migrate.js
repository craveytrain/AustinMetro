var fs = require('fs');

fs.readFile('stations.json', 'utf-8', function(err, data) {
	var stations = {};

	var old = JSON.parse(data);

	for (var station in old) {
		if (old.hasOwnProperty(station)) {
			stations[old[station].slug] = old[station];
		}
	}

	fs.writeFile('temp.json', JSON.stringify(stations, null, 4));
});