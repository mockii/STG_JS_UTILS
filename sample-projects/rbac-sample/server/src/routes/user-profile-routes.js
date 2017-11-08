
var express = require('express'),
    log4js = require('log4js'),
    logger = log4js.getLogger('user-profile-router'),
    constants = require('../constants'),
    urlSpace = require('../url-space'),
    utils = require('../utils');


var userProfileRoutes = function (config, stgAuth) {

    //declare router
    var userProfileRouter = express.Router();


    //user profile routes
    userProfileRouter.route(urlSpace.urls.local.userProfile)
        .get(function (req, res) {

            var username = req.params.username,
                token = stgAuth.getTokenFromHeader(req),
                urlPath = urlSpace.urls.adams.user.replace('{username}', username),
                url = config.urls.adams + urlPath,
                accept = urlSpace.headers.adams.accept.v1;

            utils.makeApiCallWithOAuthToken(url, token, accept).then(function(data){
                    if (Object.keys(data).length === 0) {
                        createUserProfileFromOAuthProfile(token).then(function(data){
                            res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
                            res.send(data);
                        }, function(error) {
                            var status = (error.http_status) ? error.http_status : 500;
                            res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
                            res.status(status).send(error);
                        });
                    }
                    else {
                        res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
                        res.send(data);
                    }
                },
                function(){
                    createUserProfileFromOAuthProfile(token).then(function(data){
                        res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
                        res.send(data);
                    }, function(error) {
                        var status = (error.http_status) ? error.http_status : 500;
                        res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
                        res.status(status).send(error);
                    });
                });
        });


    //associate routes
    userProfileRouter.route(urlSpace.urls.local.associate)
        .get(function (req, res) {
            var token = stgAuth.getTokenFromHeader(req),
                perno = req.params.perno,
                urlPath = urlSpace.urls.adams.associate.replace('{perno}', perno),
                url = config.urls.adams + urlPath,
                accept = urlSpace.headers.adams.accept.v1;

            utils.makeApiCallWithOAuthToken(url, token, accept, 'GET', null).then(function(data){
                res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
                res.send(data);
            }, function(error){
                console.log('associate route error', error);
                var status = (error.http_status) ? error.http_status : 500;
                res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
                res.status(status).send(error);
            });

        });


    //user teams for role routes
    userProfileRouter.route(urlSpace.urls.local.teamsForRole)
        .get(function (req, res) {
            var token = stgAuth.getTokenFromHeader(req),
                username = req.params.username,
                roleName = req.params.roleName,
                urlPath = urlSpace.urls.adams.userTeams.replace('{username}', username).replace('{applicationName}', config.application.name).replace('{roleName}', roleName),
                url = config.urls.adams + urlPath,
                accept = urlSpace.headers.adams.accept.v1;

            utils.makeApiCallWithOAuthToken(url, token, accept, 'GET', null).then(function(data){
                res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
                res.send(data);
            }, function(error){
                console.log('user teams route error', error);
                var status = (error.http_status) ? error.http_status : 500;
                res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
                res.status(status).send(error);
            });

        });



    function createUserProfileFromOAuthProfile(token) {
        return stgAuth.getUserProfileFromToken(token).then(function(data){

            var userProfile = {};
            userProfile[constants.USER_PROFILE_ATTRIBUTES.USERNAME] = data.id;
            userProfile[constants.USER_PROFILE_ATTRIBUTES.FIRST_NAME] = getOAuthAttributeValue(constants.OAUTH_ATTRIBUTES.FIRST_NAME,data);
            userProfile[constants.USER_PROFILE_ATTRIBUTES.LAST_NAME] = getOAuthAttributeValue(constants.OAUTH_ATTRIBUTES.LAST_NAME,data);
            userProfile[constants.USER_PROFILE_ATTRIBUTES.EMAIL] = getOAuthAttributeValue(constants.OAUTH_ATTRIBUTES.EMAIL,data);
            userProfile[constants.USER_PROFILE_ATTRIBUTES.WORK_PHONE] = getOAuthAttributeValue(constants.OAUTH_ATTRIBUTES.WORK_PHONE,data);
            userProfile[constants.USER_PROFILE_ATTRIBUTES.COST_CENTER] = getOAuthAttributeValue(constants.OAUTH_ATTRIBUTES.COST_CENTER,data);
            userProfile[constants.USER_PROFILE_ATTRIBUTES.PERNO] = getOAuthAttributeValue(constants.OAUTH_ATTRIBUTES.PERNO,data);

            return userProfile;
        });
    }

    function getOAuthAttributeValue(attribute, data) {
        var value = '';
        for (var i=0; i < data.attributes.length; i++) {
            var cobj = data.attributes[i];
            if (attribute in cobj) {
                value = cobj[attribute];
                break;
            }
        }

        return value;
    }


    return userProfileRouter;
};


module.exports = userProfileRoutes;


