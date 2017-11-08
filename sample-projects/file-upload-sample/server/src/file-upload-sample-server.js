/**
 * Setup PMX for advanced monitoring of NodeJS application in Keymetrics
 * For more information see:
 *     https://www.npmjs.com/package/pmx
 *     http://docs.keymetrics.io/docs/usage/install-pmx/
 *     http://docs.keymetrics.io/docs/pages/custom-metrics/
 */
var pmx = require('pmx').init({
	http          : true, // HTTP routes logging (default: true)
	ignore_routes : [/socket\.io/, /notFound/], // Ignore http routes with this pattern (Default: [])
	errors        : true, // Exceptions logging (default: true)
	custom_probes : true, // Auto expose JS Loop Latency and HTTP req/s as custom metrics
	network       : true, // Network monitoring at the application level
	ports         : true  // Shows which ports your app is listening on (default: false)
});

var express = require('express'),
	app = express(),
	fs = require('fs'),
	path = require('path'),
	bodyParser = require('body-parser'),
	request = require('request'),
	promise = require('promise'),
	proxy = require('express-http-proxy'),
	log4js = require('log4js'),
	utils = require('./utils'),
	Config = require('./config'),
	config = new Config(),
	constants = require('./constants'),
	urlSpace = require('./url-space');
	
/**
 * make a log directory, just in case it isn't there.
 * this is only needed for local environments.
 */
if (!process.env.NODE_ENV) {
	try {
		fs.mkdirSync(config.server.logPath);
	} catch (e) {
		if (e.code !== 'EEXIST') {
			console.error("Could not set up log directory, error was: ", e);
			process.exit(1);
		}
	}
}

log4js.configure(__dirname + '/log4js-config.json', {reloadSecs: 60, cwd: config.server.logPath});
var logger = log4js.getLogger('server'),
	clientLogger = log4js.getLogger('client'),
	httpLogger = log4js.getLogger('http');

logger.info('Starting NodeJS Server for File Upload Sample');

app.use(log4js.connectLogger(httpLogger, { level: 'auto' }));

var APP_FOLDER_LOCATION = '@@APP_LOCATION';

var authVariables = {
	app: app,
	config: config,
	token: {
		revalidateAfterMin: 30,
		longestTimeToLiveHours: 8
	}
};

// include oauth libraries, passing reference to app and psudeo-env variables
var stgAuth = require('stgwebutils-server-oauth')(authVariables);

app.use(stgAuth.ensureAuthenticated);
app.use(config.server.rootContext, setupConfigFile, express.static(__dirname + APP_FOLDER_LOCATION));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


logger.info('initializing routers');
var fileUploadRoutes = require('./routes/file-upload-routes')(config, stgAuth);

logger.info('registering routers with Express', config.server.rootContext);
app.use(config.server.rootContext, fileUploadRoutes);



// catch whichever file needs to contain "common.settings.oauth"
function setupConfigFile(req, res, next) {
	if (req.url === "/scripts/stgAuth.js") {
		stgAuth.getAuthSettingsFile(req, res, next);
	} else {
		next();
	}
}





/**
 * Basic Application Routes
 */

if ('/' !== config.server.rootContext) {
	app.get('/', function(req, res) {
		if (req.session) {
			req.session.destroy();
		}
		res.redirect(config.server.rootContext);
	});
}

app.get(config.server.rootContext + '/', function(req, res) {
	if (req.session) {
		req.session.destroy();
	}
	res.redirect(config.server.rootContext + '/auth');
});

app.get(config.server.rootContext +'/logout', function(req, res) {
	res.redirect(config.urls.sso + '/closeBrowser.jsp');
});



var nodeServer = app.listen(config.server.port, function(){
	var host = nodeServer.address().address;
	var port = nodeServer.address().port || config.server.port;
	logger.info('File Upload Sample server started listening at http://%s:%s', host, port, "with pid", process.pid);
	console.log('File Upload Sample server started listening at http://%s:%s', host, port, "with pid", process.pid);
});