'use strict';

(function () {

    angular.module('rbac.sample.controller', [])
    .controller('AppController', ['$rootScope', '$scope', '$window', '$timeout', '$interval', 'CompassToastr', 'stgOauthSettings', 'RBACService', 'RBAC_SAMPLE_CONSTANTS', 'SECURED_OBJECTS', 'AppService',
        function($rootScope, $scope, $window, $timeout, $interval, CompassToastr, stgOauthSettings, RBACService, RBAC_SAMPLE_CONSTANTS, SECURED_OBJECTS, AppService ) {

            var appController = this;


            function initialize() {

                $scope.roleName = RBACService.getCurrentProfile().current_role.role_name;

                appController.logo = RBAC_SAMPLE_CONSTANTS.RBAC_LOGO;
                appController.logoText = RBAC_SAMPLE_CONSTANTS.RBAC_LOGO_TEXT;
                appController.logoClasses = 'col-md-4 col-sm-7 col-xs-6';
                appController.topNavigationClasses = 'col-md-4 col-md-push-4 col-sm-5 col-xs-6';

                appController.userMenuItems = [
                    {
                        //state: "profile",
                        iconClass: "icon-user",
                        label: "My Profile"
                    }
                ];

                appController.menuItems = [
                    {
                        state: "dashboard",
                        pageName: "Dashboard"
                    },
                    {
                        state: "sampleForm",
                        pageName: "Sample Form",
                        securedObjectName: 'Sample Form'
                    },
                    {
                        state: "stgUserAdministration",
                        pageName: "User Administration",
                        securedObjectName: 'User Administration'
                    }
                ];

            }


            /** PUBLIC FUNCTIONS **/



            /** PRIVATE FUNCTIONS **/

           function setupSampleAdminSecurityProfile() {
                RBACService.getCurrentProfile().secured_objects = SECURED_OBJECTS.ADMIN;
            }

            function setupSampleUserSecurityProfile() {
                RBACService.getCurrentProfile().secured_objects = SECURED_OBJECTS.USER;
            }



            /** LISTENERS & WATCHERS **/

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
                var role = RBACService.getCurrentProfile().current_role.role_name;
                switch (role) {
                    case 'Admin':
                        setupSampleAdminSecurityProfile();
                        break;
                    case 'User':
                        setupSampleUserSecurityProfile();
                        break;
                    default:
                }
            });



            /**
             * Listen for state changes so we can capture the previous state
             * Useful if we want to return to the previous state (as used in Sync Profile Functionality)
             */
            $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from) {
                if (from && from.name !== 'syncProfile') {
                    $rootScope.previousState = from.name;
                }
            });

            initialize();

        }]);

})();
