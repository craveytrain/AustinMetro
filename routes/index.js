
/*
 * GET home page.
 */

'use strict';

var fs = require('fs');

var version;

fs.readFile('./package.json', 'utf8', function(err, data) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }

    version = JSON.parse(data).version;
});


exports.index = function(req, res) {
    res.render('index', {
        title: 'Express',
        version: version
    });
};