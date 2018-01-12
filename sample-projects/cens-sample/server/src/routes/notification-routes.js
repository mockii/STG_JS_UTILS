
var express = require('express'),
    formidable = require('formidable'),
    fs = require('fs'),
    request = require('request'),
    urlSpace = require('../url-space'),
    utils = require('../utils');

var notificationRoutes = function (config, stgAuth, logger, constants) {

    //declare router
    var notificationRouter = express.Router();


    //get file upload routes
    notificationRouter.route(urlSpace.urls.local.upload)
        .post(function (req, res) {
            var token = stgAuth.getTokenFromHeader(req);

        });

    notificationRouter.route(urlSpace.urls.local.getUserNotifications)
        .get(function (req, res) {
        console.log("enter");
        var token = stgAuth.getTokenFromHeader(req),
            userName = req.params.userName,
            urlPath = urlSpace.urls.notification.getUserNotifications.replace('{userName}', userName),
            url = urlSpace.urls.cens + urlPath,
            accept = urlSpace.headers.cens.accept.v1;
console.log("url get users"+url);
        utils.makeApiCallWithOAuthToken(url, token, accept).then(function (data) {
            res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
            res.send(data);
        }, function (error) {
            logger.error('An error occurred while attempting to get notification for user  ' + userName);
            logger.error(error);
            var status = (error.http_status) ? error.http_status : 500;
            res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
            res.status(status).send(error);
        });
    });

    return notificationRouter;
};


module.exports = notificationRoutes;
