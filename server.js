'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || "development" 
var express = require('express');
var connect = require('connect');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/environment/'+process.env.NODE_ENV);
var port = process.env.PORT || 3000;
var domain = require('domain').create();

mongoose.connect(config.mongo);

//app.use(express.static(__dirname+'/public'));
// POST ON STACKOVERFLOW ABOUT THE MEMORY LEAK
app.use(function(req,res,next){
	domain.add(req);
	domain.add(res);
	domain.run(function() {
		next();
	});
	domain.on('error', function(e) {
		next(e);
	});
	// Set max listeners for memory leak issue
	domain.setMaxListeners(0);
})
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.set('views', path.join(__dirname, './views'));
app.set("view engine","ejs");

require('./socketio')(io);

var routes = require('./routes');
app.use("/",routes);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//Run server config
require("./config/serverStartupConfig")();

server.listen(port, function () {
  console.log('Server listening at port %d', port);
  console.log("$$$ process.env $$$");
  console.log(process.env.NODE_ENV);
  console.log("$$$ PWD is: $$$");
  console.log(process.cwd());
});

exports = module.exports = app;