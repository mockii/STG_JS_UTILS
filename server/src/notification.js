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



    //get child team for a team
    appConfig.app.get(urlSpace.urls.local.getApplicationNotifications, function (req, res) {

        var token = getTokenFromHeader(req),
            applicationName = req.query.appName,
            page = req.query.page,
            limit = req.query.limit,
            search = req.query.search,
            urlPath = urlSpace.urls.notification.getApplicationNotifications.replace('{application_name}', applicationName).replace('{limit}', limit).replace('{page}', page).replace('{search}', search),
            url = appConfig.config.urls.notifications + urlPath,
            accept = urlSpace.headers.cens.accept.v1;
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


    appConfig.app.get(urlSpace.urls.local.getUserNotifications, function (req, res) {

        var token = getTokenFromHeader(req),
            userName = req.query.userName,
            page = req.query.page,
            limit = req.query.limit,
            search = req.query.search,
            urlPath = urlSpace.urls.notification.getUserNotifications.replace('{user_name}', userName).replace('{limit}', limit).replace('{page}', page).replace('{search}', search),
            url = appConfig.config.urls.notifications + urlPath,
            accept = urlSpace.headers.cens.accept.v1;
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

    appConfig.app.get(urlSpace.urls.local.getGroupNotifications, function (req, res) {

        var token = getTokenFromHeader(req),
            groupReference = req.query.groupReference,
            page = req.query.page,
            limit = req.query.limit,
            search = req.query.search,
            urlPath = urlSpace.urls.notification.getGroupNotifications.replace('{group_reference}', groupReference).replace('{limit}', limit).replace('{page}', page).replace('{search}', search),
            url = appConfig.config.urls.notifications + urlPath,
            accept = urlSpace.headers.cens.accept.v1;
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


    appConfig.app.post(urlSpace.urls.local.createAppNotification, function (req, res) {
        var token = getTokenFromHeader(req),
            body = req.body,
            urlPath = urlSpace.urls.notification.createAppNotification,
            url = appConfig.config.urls.notifications + urlPath,
            accept = urlSpace.headers.cens.accept.v1,
            contentType = urlSpace.headers.contentType.json;
        var notification = {
            "action_url": "",
            "application_name": req.query.appName,
            "body": req.query.body,
            "end_time": req.query.etime,
            "priority": 1,
            "source_reference": req.query.sref,
            "start_time": req.query.stime,
            "subject": req.query.subject,
            "type": req.query.type
        };
        utils.makeApiCallWithOAuthToken(url, token, accept, 'POST', notification, contentType).then(function (data) {
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

    appConfig.app.post(urlSpace.urls.local.createUserNotification, function (req, res) {
        var token = getTokenFromHeader(req),
            body = req.data,
            urlPath = urlSpace.urls.notification.createUserNotification,
            url = appConfig.config.urls.notifications + urlPath,
            accept = urlSpace.headers.cens.accept.v1,
            contentType = urlSpace.headers.contentType.json;

        var notification = {
            "action_url": "",
            "application_name": req.query.appName,
            "body": req.query.body,
            "end_time": req.query.etime,
            "priority": 1,
            "source_reference": req.query.sref,
            "start_time": req.query.stime,
            "subject": req.query.subject,
            "type": req.query.type,
            "user_name": req.query.userName
        };
        utils.makeApiCallWithOAuthToken(url, token, accept, 'POST', notification, contentType).then(function (data) {
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

    appConfig.app.post(urlSpace.urls.local.createGroupNotification, function (req, res) {
        var token = getTokenFromHeader(req),
            body = req.data,
            urlPath = urlSpace.urls.notification.createGroupNotification,
            url = appConfig.config.urls.notifications + urlPath,
            accept = urlSpace.headers.cens.accept.v1,
            contentType = urlSpace.headers.contentType.json;

        var notification = {
            "action_url": "",
            "application_name": req.query.appName,
            "body": req.query.body,
            "end_time": req.query.etime,
            "priority": 1,
            "source_reference": req.query.sref,
            "start_time": req.query.stime,
            "subject": req.query.subject,
            "type": req.query.type,
            "group_reference":req.query.gref,
            "candidate_users": req.query.users.split(",")
        };
        utils.makeApiCallWithOAuthToken(url, token, accept, 'POST', notification, contentType).then(function (data) {
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


    appConfig.app.put(urlSpace.urls.local.updateUserNotifications, function (req, res) {
        var token = getTokenFromHeader(req),
            userName = req.query.userName,
            notifications = req.query.notifications,
            urlPath = urlSpace.urls.notification.updateUserNotifications.replace('{user_name}', userName).replace('{notifications}', notifications),
            url = appConfig.config.urls.notifications + urlPath,
            accept = urlSpace.headers.cens.accept.v1,
            contentType = urlSpace.headers.contentType.json;
        utils.makeApiCallWithOAuthToken(url, token, accept, 'PUT', contentType).then(function (data) {
            res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
            res.send(data);
        }, function (error) {
            logger.error('An error occurred while attempting to update user notifications ' + userName);
            logger.error(error);
            var status = (error.http_status) ? error.http_status : 500;
            res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
            res.status(status).send(error);
        });
    });


    function getTokenFromHeader(req) {
        var authHeader = req.headers["authorization"];
        if (authHeader && authHeader.length > 7 && authHeader.substr(0,6) === "Bearer") {
            return authHeader.substr(7, authHeader.length - 7);
        }
        return undefined;
    }

};

