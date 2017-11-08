'use strict';

(function () {

    angular.module('rbac.sample.applications.controller', [])
        .controller('ApplicationsController', ['$scope', '$state', 'ApplicationsService', 'applications',
            function($scope, $state, ApplicationsService, applications) {
                var applicationsController = this;


                function initialize() {

                    applicationsController.category = $state.current.data.category;
                    applicationsController.applicationCount = 0;
                    applicationsController.ssoApplications = [];
                    applicationsController.nonSsoApplications = [];
                    applicationsController.legacyApplications = [];

                    if (applications.length) {
                        applicationsController.applicationCount = applications.length;
                    }

                    for (var i=0; i<applications.length; i++) {
                        var application = applications[i];

                        if (application.is_legacy === true) {
                            applicationsController.legacyApplications.push(application);
                        }
                        else if (application.sso_enabled === true) {
                            applicationsController.ssoApplications.push(application);
                        }
                        else if (application.sso_enabled === false) {
                            applicationsController.nonSsoApplications.push(application);
                        }
                    }
                }

                initialize();
            }
        ]);

})();