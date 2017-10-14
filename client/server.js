var http = require('http');

/* bump up the http sockets from the default (5) */
http.globalAgent.maxSockets = 30;

// Setup app
var express = require('express');
require('express-namespace');

var app = express();
app.use('/', express['static']('dist'));

// cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// A standard error handler - it picks up any left over errors and returns a nicely formatted server 500 error
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Last call 404 handler
app.use(function(req, res, next){
    res.send(404, "File not found");
});

// Start up the server on the port specified in the config
var server = http.createServer(app);
server.listen(8181);
console.log('Angular App Server - listening on port: 8181');
