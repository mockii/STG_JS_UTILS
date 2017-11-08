'use strict';

(function () {

    angular.module('rbac.sample.applications.service', [])
        .factory('ApplicationsService', ['$rootScope', '$http', 'RBAC_SAMPLE_URL_SPACE', function($rootScope, $http, RBAC_SAMPLE_URL_SPACE) {
            var applicationsService = {};

            applicationsService.getApplicationByName = function(name) {
                var url = RBAC_SAMPLE_URL_SPACE.urls.local.application.replace('{name}', name);
                return $http.get(url).then(function(response) {
                    return applicationsService.checkApplicationAvailability(response.data);
                }, function(error) {
                    console.error('An error occurred getting application for name', name, error.data);
                    return {};
                });
            };

            applicationsService.getApplicationsByCategory = function(category) {
                var url = RBAC_SAMPLE_URL_SPACE.urls.local.applicationByCategory.replace('{category}', category);
                return $http.get(url).then(function(response) {
                    return applicationsService.checkApplicationAvailability(response.data);
                }, function(error) {
                    console.error('An error occurred getting applications for category', category, error.data);
                    return [];
                });
            };

            applicationsService.getAllApplications = function() {
                return $http.get(RBAC_SAMPLE_URL_SPACE.urls.local.applications)
                    .then(function(response) {
                        return applicationsService.checkApplicationAvailability(response.data);
                    }, function(error) {
                        console.error('An error occurred getting applications', error.data);
                        return [];
                    });
            };

            applicationsService.getFeaturedApplications = function() {
                return $http.get(RBAC_SAMPLE_URL_SPACE.urls.local.featuredApplications)
                    .then(function(response) {
                        return applicationsService.checkApplicationAvailability(response.data);
                    }, function(error) {
                        console.error('An error occurred getting featured application', error.data);
                        return [];
                    });
            };

            applicationsService.getFeatures = function() {
                return $http.get(RBAC_SAMPLE_URL_SPACE.urls.local.features)
                    .then(function(response) {
                        return response.data;
                    }, function(error) {
                        console.error('An error occurred getting features', error.data);
                        return [];
                    });
            };

            applicationsService.getQuickLinks = function() {
                return $http.get(RBAC_SAMPLE_URL_SPACE.urls.local.quickLinks)
                    .then(function(response) {
                        return applicationsService.checkApplicationAvailability(response.data);
                    }, function(error) {
                        console.error('An error occurred getting quick links', error.data);
                        return [];
                    });
            };


            applicationsService.checkApplicationAvailability = function(applications, broadcastAvailabilityChanges) {

                for (var x=0; x < applications.length; x++) {
                    if (applications[x].type !== 'feature') {
                        var application = applications[x],
                            applicationName = (application.application_name) ? application.application_name : application.name,
                            allowAccess = true,
                            allowAccessChanged = false;

                        application.type = 'application';

                        for (var i=0; i < $rootScope.maintenance.length; i++) {
                            var maintenanceApplicationName = $rootScope.maintenance[i].application_name;

                            if (maintenanceApplicationName === applicationName) {
                                var duringMaintenance = Date.now() >= $rootScope.maintenance[i].start_time && Date.now() < $rootScope.maintenance[i].end_time;
                                allowAccess = (!duringMaintenance || $rootScope.maintenance[i].allow_access === true) ? true : false;
                            }
                        }

                        //TODO:  remove and replace later
                        application.logo_url = application.button_url.replace('/buttons/', '/logos/');

                        if (application.allow_access !== allowAccess) {
                            allowAccessChanged = true;
                        }

                        application.allow_access = allowAccess;

                        if (allowAccessChanged && broadcastAvailabilityChanges) {
                            $rootScope.$broadcast('applicationAvailabilityChanged', application);
                        }
                    }
                }
                
                return applications;
            };


            return applicationsService;
        }]);
})();
