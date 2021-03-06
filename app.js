/**
 * Module dependencies.
 */
'use strict';

var express = require('express')
  , routes = require('./routes')
  , stations = require('./routes/stations')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 4000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express['static'](path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/stations', stations.index);
app.get('/stations/:station', stations.item);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

