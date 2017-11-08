'use strict';

(function () {

    angular.module('rbac.sample.dashboard.controller', [])
        .controller('DashboardController', ['$rootScope', '$scope', 'CompassToastr', 'RBAC_SAMPLE_CONSTANTS', 'DashboardService',
            function($rootScope, $scope, CompassToastr, RBAC_SAMPLE_CONSTANTS, DashboardService) {

                var dashboardController = this;


                function initialize() {

                }



                dashboardController.alertClick = function() {
                    CompassToastr.success('You click on me');
                };


                initialize();

            }
        ]);
})();
