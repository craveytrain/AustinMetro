
/*
 * GET home page.
 */

 'use strict';

exports.index = function(req, res) {
  res.render('index', { title: 'Express' });
};

exports.station = function(req, res) {
	res.render('station', { title: req.params.station });
}