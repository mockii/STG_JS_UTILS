var applications = (function() {

    var fs = require('fs'),
        Promise = require('promise'),
        applicationData = [],
        featuredAppsData = [],
        quickLinksData = [],
        envPath = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';


    function initialize() {
        readApplicationDataFromFileSystem().then(function(data){
            applicationData = data;

            readFeaturedAppsDataFromFileSystem().then(function(data){
                featuredAppsData = data;

                for (var i = 0; i < featuredAppsData.length; i++) {
                    var featuredApp = featuredAppsData[i];
                    for (var j = 0; j < applicationData.length; j++) {
                        var application = applicationData[j];
                        if (featuredApp.applicationName === application.name) {
                            featuredApp.application = application;
                        }
                    }
                }
            });

            readQuickLinksDataFromFileSystem().then(function(data){
                quickLinksData = data;

                for (var i = 0; i < quickLinksData.length; i++) {
                    var quickLink = quickLinksData[i];
                    for (var j = 0; j < applicationData.length; j++) {
                        var application = applicationData[j];
                        if (quickLink.applicationName === application.name) {
                            quickLink.application = application;
                        }
                    }
                }

            });

        });
    }


    function readApplicationDataFromFileSystem() {

        var promise = new Promise(function(resolve, reject) {

            fs.readFile(__dirname + '/data/' + envPath + '/applications.json', 'utf8', function (error, data) {
                if (error) {
                    reject(error);
                }
                resolve(JSON.parse(data));
            });

        });

        return promise;
    }

    function readFeaturedAppsDataFromFileSystem() {

        var promise = new Promise(function(resolve, reject) {

            fs.readFile(__dirname + '/data/' + envPath + '/featured-applications.json', 'utf8', function (error, data) {
                if (error) {
                    reject(error);
                }
                resolve(JSON.parse(data));
            });

        });

        return promise;
    }

    function readQuickLinksDataFromFileSystem() {

        var promise = new Promise(function(resolve, reject) {

            fs.readFile(__dirname + '/data/' + envPath + '/quick-links.json', 'utf8', function (error, data) {
                if (error) {
                    reject(error);
                }
                resolve(JSON.parse(data));
            });

        });

        return promise;
    }

    function getAllApplications() {
        return applicationData;
    }

    function getApplicationByName(name) {
        var applications = [];
        for (var i = 0; i < applicationData.length; i++) {
            var application = applicationData[i];
            if (application.name === name) {
                applications.push(application);
            }
        }
        return applications;
    }

    function getApplicationsByCategory(category) {
        var applications = [];
        for (var i = 0; i < applicationData.length; i++) {
            var application = applicationData[i];
            if (application.category === category) {
                applications.push(application);
            }
        }
        return applications;
    }

    function getFeaturedApps() {
        return featuredAppsData;
    }

    function getQuickLinks() {
        return quickLinksData;
    }

    initialize();

    var service =  {
        getAllApplications : getAllApplications,
        getApplicationByName : getApplicationByName,
        getApplicationsByCategory : getApplicationsByCategory,
        getFeaturedApps : getFeaturedApps,
        getQuickLinks  : getQuickLinks
    };

    return service;

})();

module.exports = applications;