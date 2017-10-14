

module.exports = function(appConfig) {


    var session = require('express-session'),
        fs = require('fs'),
        path = require('path'),
        replaceStream = require('replacestream'),
        request = require('request'),
        promise = require('promise'),
        log4js = require('log4js'),
        logger = log4js.getLogger('security'),
        rbac = require('./rbac'),
        utils = require('./utils'),
        urlSpace = require('./urlSpace');


    var oauth2 = require('simple-oauth2')({
        clientID: appConfig.oauth.clientID,
        clientSecret: appConfig.oauth.clientSecret,
        site: appConfig.oauth.url,
        tokenPath: '/accessToken',
        authorizationPath: '/authorize'
    });

    // setup session
    appConfig.app.use(session({
        secret: appConfig.sessionSecret,
        resave: false,
        saveUninitialized: false,
        unset: 'destroy'
    }));




    /* BEGIN OAUTH ROUTES */

    // '/auth'
    appConfig.app.get(appConfig.oauth.routes.auth, function (req, res) {
        logger.debug('Beginning OAuth Authentication');

        var authorization_uri;

        checkBaseURL(req);

        authorization_uri = oauth2.authCode.authorizeURL({ redirect_uri: appConfig.oauth.nodeBaseURL + appConfig.oauth.authCallbackURL });
        logger.debug('Authorization URL: ' + authorization_uri);

        res.redirect(authorization_uri);
    });

    // '/auth/reauth'
    appConfig.app.get(appConfig.oauth.routes.reauth, function(req, res) {
        logger.debug('Beginning Reauthorization with OAuth');

        var reauthorize_uri;

        checkBaseURL(req);

        reauthorize_uri = oauth2.authCode.authorizeURL({ redirect_uri: appConfig.oauth.nodeBaseURL + appConfig.oauth.reauthCallbackURL });
        logger.debug('Reauthorization URL: ' + reauthorize_uri);

        res.redirect(reauthorize_uri);
    });

    // Callback service parsing the authorization token and asking for the access token
    // '/callback'
    appConfig.app.get(appConfig.oauth.authCallbackURL, function (req, res) {
        logger.debug('Entering OAuth callback endpoint');

        var code = req.query.code;
        logger.debug('Retrieved the following OAuth code from the OAuth server ' + code);

        if (code) {
            checkBaseURL(req);
            oauth2.authCode.getToken({
                code: code,
                redirect_uri: appConfig.oauth.nodeBaseURL + appConfig.oauth.authCallbackURL
            }, function(error, result) {
                if (error) {
                    logger.error('An error occurred while attempting to retrieve authentication');
                    logger.error(error);
                    res.status(500).send('An error occurred while attempting to retrieve authentication.');
                    return;
                }

                // save token
                addTokenToDB(error, result, req, res)
                    .then(function(success) {
                        logger.debug('Successfully completed OAuth authentication process');
                        res.redirect(appConfig.server.rootContext);
                    }, function(error) {
                        logger.debug('An error occurred during OAuth authentication process');
                        res.redirect(appConfig.server.rootContext);
                    });
            });
        } else {
            logger.error('Call to OAuth Server did not return a code to use to get token');
            res.status(500).send("An error occurred during the authentication process. Please contact support.");
        }
    });

    // '/callback/reauth'
    appConfig.app.get(appConfig.oauth.reauthCallbackURL, function(req, res) {
        logger.debug('Entering OAuth ReAuth callback endpoint');

        var code = req.query.code;

        if (code) {
            oauth2.authCode.getToken({
                code: code,
                redirect_uri: appConfig.oauth.nodeBaseURL + appConfig.oauth.reauthCallbackURL
            }, function(error, result) {
                if (error) {
                    logger.error('An error occurred while attempting to retrieve authentication');
                    logger.error(error);
                    res.status(500).send('An error occurred while attempting to retrieve authentication.');
                    return;
                }

                // save token
                addTokenToDB(error, result, req, res)
                    .then(function(success) {
                        logger.debug('Successfully complete OAuth reauthentication process');
                        res.redirect(appConfig.oauth.reauthCallbackTokenURL);
                    }, function(error) {
                        logger.debug('An error occurred during OAuth reauthentication process');
                        res.redirect("/");
                    });
            });
        } else {
            logger.error('Call to OAuth Server did not return a code to use to get token');
            res.status(500).send('An error occurred during the authentication process. Please contact support.');
        }
    });

    // '/callback/reauth/token'
    appConfig.app.get(appConfig.oauth.reauthCallbackTokenURL, function(req, res) {
        logger.debug('Entering Reauth token callback endpoint');
        if (req.session && req.session.hasOwnProperty("token")) {
            logger.debug('Token: ' + req.session.token);
            res.status(200).send('<html><body>' +
                '  <div id="newToken" style="display: none;">' + req.session.token + '</div>' +
                '  <div id="newProfile" style="display: none;">' + req.session.profile + '</div>' +
                '  <div>Authentication complete, re-directing back to application...</div>' +
                '</body></html>');
        } else {
            logger.error('No token was found in the session after oauth process was completed successfully, redirecting back to reauth endpoint to try again');
            res.redirect(appConfig.oauth.routes.reauth);
        }
    });

    // '/auth/logout'
    appConfig.app.get(appConfig.oauth.routes.logoutToken, function(req, res) {
        logger.debug('processing logout');
        req.session.destroy();
        delete req.headers['authorization'];
        res.send(true);
    });

    /* END OAUTH ROUTES */






    /* BEGIN RBAC ROUTES */

    //RBAC - get user profile from ADAMS for Token/User, Application and Role
    appConfig.app.get(urlSpace.urls.local.rbacUserProfileForRole, function (req, res) {
        logger.debug('Entering endpoint to get RBAC profile for user and role');

        if (true === appConfig.config.application.disableRbacSecurity) {
            logger.debug('RBAC security is disabled - this process will be skipped');
            res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
            res.send({});
        }

        var token = getTokenFromHeader(req),
            appName = req.query.appName || '',
            roleName = req.query.roleName,
            // roleName = req.params.roleName,
            // appName = req.params.appName || '',
            config = appConfig.config;

        logger.debug('Token: ' + token);
        logger.debug('Role Name: ' + roleName);

        getUserProfileFromToken(getTokenFromHeader(req)).then(
            function (oauthProfile) {
                var username = oauthProfile.id;

                logger.debug('Retrieved username ' + username + ' for token ' + token);

                rbac.getRbacUserProfileForRole(oauthProfile, token, roleName, config, appName).then(
                    function (data) {
                        logger.info('Successfully retrieved profile for token ' + token + ' and role ' + roleName  + ' profile=' + JSON.stringify(data));
                        res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
                        res.send(data);
                    },
                    function (error) {
                        logger.error('An error occurred while retrieving the profile for ' + token + ' and role ' + roleName);
                        logger.error(error);
                        res.status(500).send('An error occurred while retrieving the profile for ' + token + ' and role ' + roleName);
                    }
                );
            },
            function (error) {
                logger.error('An error occurred while attempting to get OAuth profile for token ' + token);
                logger.error(error);
                res.status(500).send('An error occurred while attempting to get OAuth profile for token ' + token);
            });
    });

    //get child team for a team
    appConfig.app.get(urlSpace.urls.local.childrenForTeam, function (req, res) {
        var token = getTokenFromHeader(req),
            teamName = req.params.teamName,
            sourceSystemId = req.params.sourceSystemId;
            urlPath = urlSpace.urls.adams.childTeams.replace('{teamName}', teamName).replace('{sourceSystemId}', sourceSystemId),
            url = appConfig.config.urls.adams + urlPath,
            accept = urlSpace.headers.adams.accept.v1;

        utils.makeApiCallWithOAuthToken(url, token, accept).then(function (data) {
            res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
            res.send(data);
        }, function (error) {
            logger.error('An error occurred while attempting to get children for team  ' + teamName);
            logger.error(error);
            var status = (error.http_status) ? error.http_status : 500;
            res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
            res.status(status).send(error);
        });
    });

    /* END RBAC ROUTES */

    /* BEGIN Teams Hierarchy ROUTES */
    
    //get teams
    appConfig.app.get(urlSpace.urls.local.teamsHierarchy, function (req, res) {
        var token = getTokenFromHeader(req),
            limit = req.query.limit,
            page = req.query.page,
            application = req.params.application,
            role = req.params.role,
            sort = req.query.sort,
            searchTeamName = req.query.searchTeamName,
            searchTeamDescription = req.query.searchTeamDescription,
            searchTeamType = req.query.searchTeamType,
            urlPath = urlSpace.urls.adams.teamsHierarchy.replace('{application}', application).replace('{role}', role).replace('{limit}', limit).replace('{page}', page).replace('{searchTeamName}', searchTeamName).replace('{searchTeamDescription}', searchTeamDescription).replace('{searchTeamType}', searchTeamType).replace('{sorts}', sort),
            url = appConfig.config.urls.adams + urlPath,
            accept = urlSpace.headers.adams.accept.v1;
        
        utils.makeApiCallWithOAuthTokenFullResp(url, token, accept).then(function (data) {
            res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
            res.send(data);
        }, function (error) {
            logger.error('An error occurred while attempting to get teams hierarchy for ' + role);
            logger.error(error);
            var status = (error.http_status) ? error.http_status : 500;
            res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
            res.status(status).send(error);
        });
    });

    /* END Teams Hierarchy ROUTES */


    /* BEGIN Cost Center ROUTES */

    //get cost center
    appConfig.app.get(urlSpace.urls.local.costCenters, function (req, res) {
        var token = getTokenFromHeader(req),
            fields = req.query.fields,
            limit = req.query.limit,
            page = req.query.page,
            costCenterSearchInput = req.query.costCenterSearchInput,
            sort = req.query.sort,
            urlPath = urlSpace.urls.adams.costCenters.replace('{fields}', fields).replace('{limit}', limit).replace('{page}', page).replace('{sorts}', sort).replace('{costCenterSearchInput}', costCenterSearchInput),
            url = appConfig.config.urls.adams + urlPath,
            accept = urlSpace.headers.adams.accept.v2;

        utils.makeApiCallWithOAuthTokenFullResp(url, token, accept).then(function (data) {
            res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
            res.send(data);
        }, function (error) {
            logger.error('An error occurred while attempting to get cost center details ');
            logger.error(error);
            var status = (error.http_status) ? error.http_status : 500;
            res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
            res.status(status).send(error);
        });
    });

    /* END Cost Center ROUTES */






    //ensure that all requests to static resources are authenticated
    function ensureAuthenticated(req, res, next) {
        //check to see if the request has already been authenticated
        if ((req.url.indexOf('/selfservice/') === -1) && (req.url === appConfig.config.server.rootContext || req.url === appConfig.config.server.rootContext + '/' || req.url.indexOf('/api/') !== -1)) {
            logger.debug('A request has been made to a protected resource, checking to see if authentication has already taken place');
            logger.debug('Request URL: ' + req.url);

            var token = getTokenFromHeader(req) || req.session.token;
            if (!token) {
                logger.debug('Authentication has not yet taken place, beginning authentication process');
                res.redirect(appConfig.oauth.routes.auth);
            } else {
                logger.debug('Authentication has already taken place, returning requested resource');
                next();
            }

        } else {
            next();
        }

    }

    function checkBaseURL(req) {
        if (!appConfig.oauth.nodeBaseURL || appConfig.oauth.nodeBaseURL.length === 0) {
            var protocol = req.headers['x-forwarded-proto'] || req.protocol;
            appConfig.oauth.nodeBaseURL = protocol + '://' + req.get('host');
        }
    }

    function addTokenToDB(error, result, req, res) {
        return new Promise(function (fulfill, reject){
            if (error) {
                logger.error('Access Token Error', error.message);
            }

            result = validateAndFormatTokenFromServer(result);

            if (result) {
                req.session.token = result.access_token;

                if (true === appConfig.config.application.disableRbacSecurity) {
                    logger.debug('RBAC security handling is disabled');
                    fulfill(true);
                } else {

                    getUserProfileFromToken(result.access_token).then(
                        function(oauthProfile){
                            logger.debug('Successfully retrieved OAuth profile for token ' + result.access_token);
                            rbac.getRbacUserProfileFromToken(oauthProfile, result.access_token, appConfig.config)
                                .then(function(profile) {
                                    logger.info('Successfully retrieved profile for token ' + result.access_token + ' profile=' + JSON.stringify(profile));
                                    req.session.profile = profile;
                                    fulfill(true);
                                }, function(error) {
                                    logger.error('An error occurred while getting RBAC profile for token ' + result.access_token);
                                    logger.error(error);
                                    reject(error);
                                });
                        },
                        function(error){
                            logger.error('An error occurred while getting OAuth profile for token ' + result.access_token);
                            logger.error(error);
                            reject(error);
                        });
                }

            } else {
                logger.error('Unable to determine access token for request');
                reject(false);
            }
        });
    }


    // validates and formats token received from oauth server (OMS)
    function validateAndFormatTokenFromServer(result) {
        logger.debug('Executing validateAndFormatTokenFromServer for result ' + JSON.stringify(result));
        if (Object.prototype.toString.call(result) === "[object String]") {
            var objects = result.split("&");
            var newResult = {};
            for (var i = 0; i < objects.length; i++) {
                var tmpObj = objects[i].split("=");
                newResult[tmpObj[0]] = tmpObj[1];
            }

            result = newResult;
        }

        if (result && result.hasOwnProperty("access_token") && result.access_token.length > 5) {
            logger.debug('Validation complete, token ' + result.access_token + ' is good');
        } else {
            logger.error('Token did no pass validation ' + result.access_token);
            result = null;
        }

        return result;
    }

    // checks the request header for 'authorization'
    function getTokenFromHeader(req) {
        var authHeader = req.headers["authorization"];

        if (authHeader && authHeader.length > 7 && authHeader.substr(0,6) === "Bearer") {
            return authHeader.substr(7, authHeader.length - 7);
        }

        return undefined;
    }

    function sendInvalidToken(res) {
        res.status(401).send("invalid token");
    }

    function sendUnauthorized(res) {
        res.status(401).send("unauthorized<br/><br/>\n<a href='/'>&lt; Back to home</a>");
    }

    function getAuthSettingsFile(req, res, next) {
        var currentFilePath = path.join(__dirname, '/authVars.js');
        var readStream = fs.createReadStream(currentFilePath);
        var token = "",
            profile = {},
            clientTimeout = appConfig.token.revalidateAfterMin,
            autoLogoutOnSessionExpired = appConfig.oauth.autoLogoutOnSessionExpired;

        if (req.session && req.session.token) {
            token = req.session.token;
        }

        if (req.session && req.session.profile) {
            profile = req.session.profile;
        }

        readStream.on('open',function() {
            var logoutURL = "",
                logoutArr = (appConfig.oauth.url).split("/");
            for (var i=0; i < logoutArr.length - 1; i++) {
                logoutURL += logoutArr[i] + "/";
            }
            logoutURL += "logout";

            readStream
                .pipe(replaceStream('%TOKEN%', token))
                .pipe(replaceStream('%TIMEOUT_MINUTES%', clientTimeout))
                .pipe(replaceStream('"%CURRENT_PROFILE%"', JSON.stringify(profile)))
                .pipe(replaceStream('%LOGOUT_URL%', logoutURL))
                .pipe(replaceStream('%AUTO_LOGOUT_ON_SESSION_EXPIRED%', autoLogoutOnSessionExpired))
                .pipe(res);
        });

        readStream.on('error', function(error) {
            logger.error('there was an error reading file: ', currentFilePath, error);
            res.end(error);
        });
    }

    function getUserProfileFromToken(token) {
        return new Promise(function (fulfill, reject){
            if (!token || token.length === 0) {
                reject(new Error("invalid token"));
            }

            request({
                url: appConfig.oauth.url + '/profile',
                qs: {
                    'access_token': token
                }
            }, function(error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    try {
                        fulfill(JSON.parse(body));
                    } catch (e) {
                        logger.error('Error parsing profile body ', e);
                        logger.error('Profile body: ', body);
                        return {};
                    }
                }
            });
        });
    }



    return {
        getAuthSettingsFile: getAuthSettingsFile,
        getTokenFromHeader: getTokenFromHeader,
        getUserProfileFromToken: getUserProfileFromToken,
        sendInvalidToken: sendInvalidToken,
        ensureAuthenticated: ensureAuthenticated
    }

};

