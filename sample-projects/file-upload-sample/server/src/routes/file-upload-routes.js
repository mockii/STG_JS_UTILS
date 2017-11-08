
var express = require('express'),
    formidable = require('formidable'),
    fs = require('fs'),
    request = require('request'),
    urlSpace = require('../url-space');


var fileUploadRoutes = function (config, stgAuth, logger, constants) {

    //declare router
    var fileUploadRouter = express.Router();


    //get file upload routes
    fileUploadRouter.route(urlSpace.urls.local.upload)
        .post(function (req, res) {
            var token = stgAuth.getTokenFromHeader(req),
                form = new formidable.IncomingForm();

            form.parse(req, function(err, fields, files){
                if (!err) {

                    var formData = {
                        file: {
                            value: fs.createReadStream(files.file.path),
                            options: {
                                filename: files.file.name,
                                contentType: files.file.name.type
                            }
                        }
                    };

                    request.post({
                        url: 'http://cguschd2356vm:5026/api/upload',
                        formData: formData,
                        headers: {
                            access_token: token
                        }
                    }, function(error) {
                        if (!error) {
                            res.status(200).send();
                        } else {
                            res.status(500).send(error);
                        }
                    });

                } else {
                    res.status(500).send(err);
                }

            });

        });

    return fileUploadRouter;
};


module.exports = fileUploadRoutes;
