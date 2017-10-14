'use strict';

(function () {

    angular.module('common.modules.user.administration', [
            'common.modules.user.administration.controller'
    ])
        .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('stgUserAdministration', {
                url: "/stguseradministration",
                templateUrl: "common/modules/user/user.administration.tpl.html",
                controller: "STGUserAdministrationController as stgUserAdministrationController",
                data: {
                    pageTitle: "User Administration"
                }
            });
        }]);
})();
