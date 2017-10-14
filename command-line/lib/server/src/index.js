/*

 SAMPLE BOOTSTRAPPING APPLICATION TO INTEGRATE OAUTH2 LIBRARY (stgwebutils-server-oauth)

 */

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    proxy = require('express-http-proxy');

// include psuedo-environment setup
var Config = require('./config'),
    config = new Config();

// include oauth libraries, passing reference to app and psudeo-env variables
var stgAuth = require('stgwebutils-server-oauth')({app:app, config:config});

var proxyURL = "https://dev.compassmanager.com";
var appPath = "%appPath%";

// parse application/x-www-form-urlencoded and json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Hello<br><a href="/auth">Log in to %app%</a>');
});

app.use('/app', setupConfigFile, function(req, res, next) {
    console.log(req.headers);
    next();
}, express['static'](appPath));

app.use('/api', proxy(proxyURL, {
    xfwd: true,
    forwardPath: function(req, res) {
        return require('url').parse(req.url).path;
    },
    intercept: function(rsp, data, req, res, callback) { // rsp - original response from the target
        var responseData = JSON.parse(data.toString());

        // TODO - fix up to act appropriately based on invalid token response from proxied service
        if (responseData && responseData.error && responseData.error === "expired_accessToken") {
            console.log("** invalid token **");
            stgAuth.sendInvalidToken(res);
        } else {
            res.setHeader("remote-api", true);
            callback(null, data);
        }
    },
    decorateRequest: function(req, origReq) {
        var token = stgAuth.getTokenFromHeader(req);
        // converts '/profile?access_token=' ==> '/oauth2.0/profile?access_token='
        req.path = "/oauth2.0" + req.path + "?access_token=" + encodeURIComponent(token);
        return req;
    }
}));

app.use('/logout', function(req, res) {
    res.send('you have been logged out<br>\n<a href="/auth">Log in to %app%</a>');
});

// catch whichever file needs to contain Angular service "common.settings.oauth"
function setupConfigFile(req, res, next) {
    if (req.url === "/scripts/stgAuth.js") {
        stgAuth.getAuthSettingsFile(req, res, next);
    } else {
        next();
    }
}

console.log("Environment: ", process.env.NODE_ENV);

app.listen(3000);

console.log('%app% server started on port 3000');
