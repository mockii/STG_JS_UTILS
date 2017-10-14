stgwebutils-server-oauth
================

Contains OAuth2 related functionality and support



Why?
----

To enable drop-in, shared functionality for OAuth2 support


Installation
------------

    npm install stgwebutils-server-oauth --save


How to use
----------

### Config/Installing
Include the environment setup (config.js), and require the stgwebutils-server-oauth, passing either a config object
or, at the minimum, an object containing a reference to the app and config.

    var Config = require('./config'),
        config = new Config();

    var stgAuth = require('stgwebutils-server-oauth')({app:app, config:config});

An example config object looks like:

    var authVariables = {
        app: app,
        config: config,
        sessionSecret: "sample app session secret",
        oauth: {
            clientID: "OAuth Test Client",
            clientSecret: "this is just a test",
            url: "https://dev.compassmanager.com/oauth2.0",
            nodeBaseURL: "http://localhost:3000",
            authCallbackURL: "/callback",
            reauthCallbackURL: "/callback/reauth",
            reauthCallbackTokenURL: "/callback/reauth/token",
            routes: {
                auth: "/auth",
                reauth: "/auth/reauth",
                checkToken: "/auth/checkToken"
            }
        },
        token: {
            revalidateAfterMin: 5,
            longestTimeToLiveHours: 8
        }
     };

### Passing Token to Client
When the user gets redirected to the ```/app``` endpoint after validating with the OAuth server, we need to pass the fetched
token from the OAuth server back to the client.  This is done in this middleware routine, where you can change the name
of the file to fetch (in this case it's ```/scripts/stgAuth.js```).  This will create an Angular service that contains
the _Token_ and the _Client_Timeout_ in minutes.

    // catch whichever file needs to contain Angular service "common.settings.oauth"
    function setupConfigFile(req, res, next) {
        if (req.url === "/scripts/stgAuth.js") {
            stgAuth.getAuthSettingsFile(req, res, next);
        } else {
            next();
        }
    }

### Routes
There are 2 routes that will need to be created/modified, ```/app``` and ```/api```.  The ```/api``` endpoint will
forward requests to the actual background API.  The ```/app``` includes a middleware call to catch the client config
data (token, timeout, etc).

    app.use('/app', setupConfigFile, function(req, res, next) {
        console.log(req.headers);
        next();
    }, express['static']('app'));


    app.use('/api', proxy(proxyURL, {
        xfwd: true,
        forwardPath: function(req, res) {
            return require('url').parse(req.url).path;
        },
        intercept: function(rsp, data, req, res, callback) { // rsp - original response from the target
            var responseData = JSON.parse(data.toString());
    
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

