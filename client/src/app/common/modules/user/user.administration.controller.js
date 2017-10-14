'use strict';

(function () {

    angular.module('common.modules.user.administration.controller', [])
        .controller('STGUserAdministrationController', ['$rootScope', '$sce', 'SERVER_URL_SPACE', 'RBACService',
            function($rootScope, $sce, SERVER_URL_SPACE, RBACService) {
                var userAdministrationController = this;


                function initialize() {
                    var appName = $rootScope.applicationConfiguration.application.name,
                        roleName = RBACService.getCurrentRoleName(),
                        accessAttributes = RBACService.getCurrentAccessAttributes(),
                        urlPath = SERVER_URL_SPACE.urls.local.userAdminUI.replace('{appName}', appName).replace('{roleName}', roleName).replace('{rbac_app_name}', appName).replace('{rbac_role_name}', roleName).replace('{access_attributes}', accessAttributes),
                        url = $rootScope.applicationConfiguration.urls.base_urls.adams + urlPath;
                    userAdministrationController.userAdminUrl = $sce.trustAsResourceUrl(url);
                }

                initialize();
            }
        ]);
})();