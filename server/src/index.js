
module.exports = function(_appVars) {

    var session = require('express-session'),
        fs = require('fs'),
        path = require('path'),
        url = require('url'),
        replaceStream = require('replacestream'),
        request = require('request'),
        promise = require('promise'),
        log4js = require('log4js'),
        logger = log4js.getLogger('stg-utils'),
        utils = require('./utils'),
        urlSpace = require('./urlSpace');



    // setup custom STG modules
    var appConfig = configureAppVars(_appVars),
        dynatrace = require('./dynatrace')(appConfig),
        security = require('./security')(appConfig),
        actuate = require('./actuate.js')(appConfig),
        googlemaps = require('./googlemaps.js')(appConfig);


    logger.info('Initializing STG Server with the following config:');
    logger.info(JSON.stringify(appConfig));


    //setup dynatrace
    dynatrace.setup();



    /** Application Configuration Details **/
    appConfig.app.get(urlSpace.urls.local.applicationConfiguration, function(req, res) {

        var urls,
            data,
            config = Object.assign({}, appConfig.config);

        delete config.oauth; // Deleting the OAUTH Proeprties
        config.environment = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'local';

        if (typeof config.urls.base_urls === 'undefined') {
            urls = config.urls;
            delete config.urls; // Rebuilding the urls properties
            config.urls = {};
            config.urls.base_urls = urls;
        }

        config.urls.local_urls = urlSpace.urls.local;

        data = config;

        res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
        res.send(data);
    });


    /** System Support Endpoints **/
/*
    appConfig.app.get(urlSpace.urls.local.heapdump, function(req, res){
        try {
            heapdump.writeSnapshot();
            res.status(200).send('OK');
        } catch (e) {
            logger.error('Error writing heapdump to file system');
            res.status(500).send(e);
        }
    });
*/





    function configureAppVars(appVars) {
        if (!appVars) {
            throw("authentication application variables object not set!");
        }

        if (!appVars.app) {
            throw("application must be passed in, in order to provide proper routing.")
        }

        appVars.server = appVars.server || {};
        appVars.server.rootContext = appVars.config.server.rootContext ? appVars.config.server.rootContext : "/app";

        appVars.sessionSecret = appVars.sessionSecret || "sample app session secret";

        appVars.oauth = appVars.oauth || {};

        appVars.oauth.clientID = appVars.oauth.clientID || appVars.config ? appVars.config.oauth.clientID : "";
        appVars.oauth.clientSecret = appVars.oauth.clientSecret || appVars.config ? appVars.config.oauth.clientSecret : "";
        appVars.oauth.url = appVars.oauth.url || appVars.config ? appVars.config.oauth.url : "";
        appVars.oauth.autoLogoutOnSessionExpired = appVars.oauth.autoLogoutOnSessionExpired || appVars.config ? appVars.config.oauth.autoLogoutOnSessionExpired : "true";

        appVars.oauth.nodeBaseURL = appVars.oauth.nodeBaseURL || appVars.config ? appVars.config.oauth.nodeBaseURL : "";
        appVars.oauth.authCallbackURL = appVars.oauth.reauthCallbackURL || appVars.server.rootContext.concat("/callback");
        appVars.oauth.reauthCallbackURL = appVars.oauth.reauthCallbackURL || appVars.server.rootContext.concat("/callback/reauth");
        appVars.oauth.reauthCallbackTokenURL = appVars.oauth.reauthCallbackTokenURL || appVars.server.rootContext.concat("/callback/reauth/token");

        appVars.oauth.routes = appVars.oauth.routes || {};
        appVars.oauth.routes.auth = appVars.oauth.routes.auth || appVars.server.rootContext.concat("/auth");
        appVars.oauth.routes.reauth = appVars.oauth.routes.reauth || appVars.server.rootContext.concat("/auth/reauth");
        appVars.oauth.routes.checkToken = appVars.oauth.routes.checkToken || appVars.server.rootContext.concat("/auth/checkToken");
        appVars.oauth.routes.logoutToken = appVars.oauth.routes.logoutToken || appVars.server.rootContext.concat("/auth/logout");

        appVars.token = appVars.token || {};
        appVars.token.revalidateAfterMin = appVars.token.revalidateAfterMin || 5;
        appVars.token.longestTimeToLiveHours = appVars.token.longestTimeToLiveHours || 8;

        return appVars;
    }

    return {
        getAuthSettingsFile: security.getAuthSettingsFile,
        getTokenFromHeader: security.getTokenFromHeader,
        getUserProfileFromToken: security.getUserProfileFromToken,
        sendInvalidToken: security.sendInvalidToken,
        ensureAuthenticated: security.ensureAuthenticated
    }

};
