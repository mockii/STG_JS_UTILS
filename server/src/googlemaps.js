
module.exports = function(appConfig) {

    var log4js = require('log4js'),
        logger = log4js.getLogger('googlemaps'),
        utils = require('./utils'),
        urlSpace = require('./urlSpace');

    appConfig.app.get(urlSpace.urls.local.googlemaps.getGeoCodeByAddress, function (req, res) {
        var address = req.query.address,
            urlPath = urlSpace.urls.googlemaps.getGeoCodeByAddress
                .replace('{address}', address).replace('{clientId}', appConfig.config.googlemaps.clientId),
            url = appConfig.config.googlemaps.url + urlPath,
            accept = urlSpace.headers.contentType.json;

        utils.makeGenericApiCall(url, accept)
            .then(function (data) {
                res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
                res.send(data);
            }, function (error) {
                logger.error('An error occurred while attempting to get location by address ');
                logger.error(error);
                var status = (error.http_status) ? error.http_status : 500;
                res.setHeader(urlSpace.headers.contentType.name, urlSpace.headers.contentType.json);
                res.status(status).send(error);
            });
    });

    //export public functions
    return {

    }
};