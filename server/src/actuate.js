
module.exports = function(appConfig) {


    var request = require('request'),
        proxy = require('express-http-proxy'),
        promise = require('promise'),
        sha256 = require("crypto-js/sha256"),
        log4js = require('log4js'),
        logger = log4js.getLogger('actuate'),
        security = require('./security')(appConfig),
        utils = require('./utils'),
        urlSpace = require('./urlSpace'),
        CONSTANTS = require('./constants');



    //if actuate host is defined then add a proxy for it
    if (appConfig.config.urls.actuate) {
        appConfig.app.use('/ui/api/actuate', proxy(appConfig.config.urls.actuate, {
            xfwd: true,
            decorateRequest: function (req, origReq) {
                req.path = "/api/v2" + req.path;
                req.rejectUnauthorized = false;

                if (isUserPasswordNeeded(req)) {
                    req.bodyContent = addPasswordToLoginRequests(req.bodyContent);
                }

                return req;
            }
        }));
    }

    function isUserPasswordNeeded(req) {
        return !!(req.path.indexOf('/login') !== -1 || (req.path.indexOf('/users') !== -1 && req.method === 'POST'));
    }

    function addPasswordToLoginRequests(bodyContent) {
        var contentArray = bodyContent.split('=');

        if (contentArray[1] === CONSTANTS.ACTUATE.ADMIN_USERNAME) {
            return bodyContent + CONSTANTS.ACTUATE.PASSWORD_CONTENT_TEMPLATE.replace('{password}', CONSTANTS.ACTUATE.ADMIN_PASSWORD);
        } else {
            return bodyContent + CONSTANTS.ACTUATE.PASSWORD_CONTENT_TEMPLATE.replace('{password}', getPasswordForUser(contentArray[1]));
        }
    }

    function getPasswordForUser(username) {
        var userString = CONSTANTS.ACTUATE.USER_PASSWORD_TEMPLATE.replace('{username}', username.toUpperCase()),
            password = sha256(userString).toString();

         return password;
    }


    return {

    }

};
