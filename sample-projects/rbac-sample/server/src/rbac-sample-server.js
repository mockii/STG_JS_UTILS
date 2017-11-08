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
	urlSpace = require('./url-space'),
	constants = require('./constants'),
	applications = require('./applications'),
	serverSettings = require('./server-settings');

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
	httpLogger = log4js.getLogger('http');


logger.info('Starting NodeJS Server for ' + config.application.name);


app.use(log4js.connectLogger(httpLogger, { level: 'auto' }));






var APP_FOLDER_LOCATION = '@@APP_LOCATION';


var authVariables = {
	app: app,
	config: config,
	token: config.token
};


// include oauth libraries, passing reference to app and psudeo-env variables
var stgAuth = require('stgwebutils-server-oauth')(authVariables);

app.use(stgAuth.ensureAuthenticated);
app.use(config.server.rootContext, setupConfigFile, express.static(__dirname + APP_FOLDER_LOCATION));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());






logger.debug('initializing routers');
var userProfileRouter = require('./routes/user-profile-routes')(config, stgAuth);
app.use(config.server.rootContext, userProfileRouter);







/**
 * APIs
 */

//get features
app.get(urlSpace.urls.local.features, function(req, res) {
	var url = config.urls.oms + urlSpace.urls.oms.features,
		accept = urlSpace.headers.oms.accept.v1;

	callApiWithOAuth(req, res, url, accept).then(function(data){
		if (typeof data.http_status === 'undefined') {
			res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
			res.send(data);
		}
		else {
			res.status(data.http_status).send(data);
		}
	}, function(error){
		logger.error('Error getting JSON data from File Stream', error);
		res.status(500).send(error);
	});
});

//get featured applications
app.get(urlSpace.urls.local.featuredApplications, function(req, res) {
	var url = config.urls.oms + urlSpace.urls.oms.featuredApplications,
		accept = urlSpace.headers.oms.accept.v1;

	callApiWithOAuth(req, res, url, accept).then(function(data){
		if (constants.httpStatusCode.toString().indexOf(data.http_status) >= 0) {
			logger.info('Unable to get featured application data from API server, return local JSON data instead');
			res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
			res.send(applications.getFeaturedApps());
		}
		else if (typeof data.http_status === 'undefined') {
			res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
			res.send(data);
		}
		else {
			res.status(data.http_status).send(data);
		}
	}, function(error){
		logger.error('Error getting JSON data from File Stream', error);
		res.status(500).send(error);
	});
});

//get quick links
app.get(urlSpace.urls.local.quickLinks, function(req, res) {
	var url = config.urls.oms + urlSpace.urls.oms.quickLinks,
		accept = urlSpace.headers.oms.accept.v1;

	callApiWithOAuth(req, res, url, accept).then(function(data){
		if (constants.httpStatusCode.toString().indexOf(data.http_status) >= 0) {
			logger.info('Unable to get quick links data from API server, return local JSON data instead');
			res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
			res.send(applications.getQuickLinks());
		}
		else if (typeof data.http_status === 'undefined') {
			res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
			res.send(data);
		}
		else {
			res.status(data.http_status).send(data);
		}
	}, function(error){
		logger.error('Error getting JSON data from File Stream', error);
		res.status(500).send(error);
	});
});

// get all applications
app.get(urlSpace.urls.local.applications, function(req, res) {
	var url = config.urls.oms + urlSpace.urls.oms.applications,
		accept = urlSpace.headers.oms.accept.v1;

	callApiWithOAuth(req, res, url, accept).then(function(data){
		if (constants.httpStatusCode.toString().indexOf(data.http_status) >= 0) {
			logger.info('Unable to get application data from API server, return local JSON data instead');
			res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
			res.send(applications.getAllApplications());
		}
		else if (typeof data.http_status === 'undefined') {
			res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
			res.send(data);
		}
		else {
			res.status(data.http_status).send(data);
		}
	}, function(error){
		logger.error('Error getting JSON data from File Stream', error);
		res.status(500).send(error);
	});
});

//get application by name
app.get(urlSpace.urls.local.applicationByName, function(req, res) {
	var name = req.params.name,
		url = config.urls.oms + urlSpace.urls.oms.application.replace('{name}', name),
		accept = urlSpace.headers.oms.accept.v1;

	callApiWithOAuth(req, res, url, accept).then(function(data){
		if (constants.httpStatusCode.toString().indexOf(data.http_status) >= 0) {
			logger.info('Unable to get application data from API server, return local JSON data instead');
			res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
			res.send(applications.getApplicationByName(name));
		}
		else if (typeof data.http_status === 'undefined') {
			res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
			res.send(data);
		}
		else {
			res.status(data.http_status).send(data);
		}
	}, function(error){
		logger.error('Error getting JSON data from File Stream', error);
		res.status(500).send(error);
	});
});

//get applications by category
app.get(urlSpace.urls.local.applicationsForCategory, function(req, res) {
	var name = req.params.name,
		url = config.urls.oms + urlSpace.urls.oms.applicationsForCategory.replace('{name}', name),
		accept = urlSpace.headers.oms.accept.v1;

	callApiWithOAuth(req, res, url, accept).then(function(data){
		if (constants.httpStatusCode.toString().indexOf(data.http_status) >= 0) {
			logger.info('Unable to get application data from API server, return local JSON data instead');
			res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
			res.send(applications.getApplicationsByCategory(name));
		}
		else if (typeof data.http_status === 'undefined') {
			res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
			res.send(data);
		}
		else {
			res.status(data.http_status).send(data);
		}
	}, function(error){
		logger.error('Error getting JSON data from File Stream', error);
		res.status(500).send(error);
	});
});

//get all server settings
app.get(urlSpace.urls.local.serverSettings, function(req, res) {
	var url = config.urls.oms + urlSpace.urls.oms.serverSettings,
		accept = urlSpace.headers.oms.accept.v1;
	callApiWithOAuth(req, res, url, accept).then(function(data){
		if (constants.httpStatusCode.toString().indexOf(data.http_status) >= 0) {
			logger.info('Unable to get server settings data from API server, return local JSON data instead');
			res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
			res.send(serverSettings.getAllServerSettings());
		}
		else if (typeof data.http_status === 'undefined') {
			res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
			res.send(data);
		}
		else {
			res.status(data.http_status).send(data);
		}
	}, function(error){
		logger.error('Error getting JSON data from File Stream', error);
		res.status(500).send(error);
	});
});

//get setting by name
app.get(urlSpace.urls.local.serverSettingByName, function(req, res) {
	var name = req.params.name,
		url = config.urls.oms + urlSpace.urls.oms.serverSetting.replace('{name}', name),
		accept = urlSpace.headers.oms.accept.v1;
    callApiWithOAuth(req, res, url, accept).then(function(data){
		if (constants.httpStatusCode.toString().indexOf(data.http_status) >= 0) {
			logger.info('Unable to get server settings data from API server, return local JSON data instead');
			res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
			res.send(serverSettings.getSettingByName(name));
		}
		else if (typeof data.http_status === 'undefined') {
			res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
			res.send(data);
		}
		else {
			res.status(data.http_status).send(data);
		}
	}, function(error){
		logger.error('Error getting JSON data from File Stream', error);
		res.status(500).send(error);
	});
});

//submit metrics feedback to JIRA
app.post(urlSpace.urls.local.metricsFeedback, function(req, res) {
	var url = urlSpace.urls.jira.metricsIssueCollector,
			body = req.body;

	return utils.submitFeedbackToJira(url, body).then(function(){
		res.status(200).send('OK');
	}, function(error){
		res.status(500).send(error);
	});
});


/** MESSAGING ENDPOINTS **/

//get messages for an application
app.get(urlSpace.urls.local.messagesForApplication, function(req, res) {
	var applicationName = req.params.applicationName,
		url = config.urls.oms + urlSpace.urls.oms.messagesForApplication.replace('{applicationName}', applicationName),
		accept = urlSpace.headers.oms.accept.v1;

	callApiWithToken(req, res, url, accept);
});

//get messages for a specific type
app.get(urlSpace.urls.local.messagesByType, function(req, res) {
	var messageType = req.params.messageType,
		url = config.urls.oms + urlSpace.urls.oms.messagesByType.replace('{messageType}', messageType),
		accept = urlSpace.headers.oms.accept.v1;

	callApiWithToken(req, res, url, accept);
});

// get message types
app.get(urlSpace.urls.local.messageTypes, function(req, res) {
	var url = config.urls.oms + urlSpace.urls.oms.messageTypes,
		accept = urlSpace.headers.oms.accept.v1;

	callApiWithToken(req, res, url, accept);
});

//create message
app.post(urlSpace.urls.local.messages, function(req, res){
	var url = config.urls.oms + urlSpace.urls.oms.messages,
		accept = urlSpace.headers.oms.accept.v1;

	callApiWithToken(req, res, url, accept, 'POST', req.body);
});

//update message
app.put(urlSpace.urls.local.message, function(req, res){
	var messageId = req.params.messageId,
		url = config.urls.oms + urlSpace.urls.oms.message.replace('{messageId}', messageId),
		accept = urlSpace.headers.oms.accept.v1;

	callApiWithToken(req, res, url, accept, 'PUT', req.body);
});

//delete message
app.delete(urlSpace.urls.local.message, function(req, res){
	var messageId = req.params.messageId,
		url = config.urls.oms + urlSpace.urls.oms.message.replace('{messageId}', messageId),
		accept = urlSpace.headers.oms.accept.v1;

	callApiWithToken(req, res, url, accept, 'DELETE');
});




function callApi(req, res, url, accept, method, body) {
	logger.debug('Making API call to', url, ', method', method, ', body', body);
	utils.makeGenericApiCall(url, accept, method, body).then(function(data){
		res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
		res.send(data);
	}, function(error){
		var status = (error.http_status) ? error.http_status : 500;
		res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
		res.status(status).send(error);
	});
}

function callApiWithToken(req, res, url, accept, method, body) {
	logger.debug('Making API call to', url, ', method', method, ', body', body);
	var token = stgAuth.getTokenFromHeader(req);

	utils.makeApiCallWithOAuthToken(url, token, accept, method, body).then(function(data){
		res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
		res.send(data);
	}, function(error){
		var status = (error.http_status) ? error.http_status : 500;
		res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
		res.status(status).send(error);
	});
}

function callApiWithOAuth(req, res, url, accept, method, body) {
	logger.debug('Making API call to', url, ', method', method, ', body', body);
	var token = stgAuth.getTokenFromHeader(req);
	return utils.makeApiCallWithOAuthToken(url, token, accept, method, body).then(function(data){
		return data;
	}, function(error){
		return error;
	});
}

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

app.get(config.server.rootContext+'/', function(req, res) {
	if (req.session) {
		req.session.destroy();
	}
	res.redirect(config.server.rootContext + '/auth');
});

app.get('/logout', function(req, res) {
	res.redirect(config.urls.oms + config.server.rootContext);
});



app.listen(config.server.port);

logger.info(config.application.name + ' server started on port', config.server.port, "with pid", process.pid);
console.log(config.application.name + ' server started on port', config.server.port, "with pid", process.pid);