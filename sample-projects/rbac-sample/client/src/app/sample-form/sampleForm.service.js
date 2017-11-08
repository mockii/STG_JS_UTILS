'use strict';

(function () {

    angular.module('rbac.sample.sampleForm.service', [])
        .factory('SettingsService', ['$http', 'RBAC_SAMPLE_URL_SPACE', function($http, RBAC_SAMPLE_URL_SPACE) {
            var sampleFormService = {};



            return sampleFormService;
        }]);
})();
