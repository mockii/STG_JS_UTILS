'use strict';

(function () {

    angular.module('rbac.sample.service', [])
        .factory('AppService', ['$http', '$filter', function($http, $filter) {
            var appService = {};


            return appService;
        }]);

})();
