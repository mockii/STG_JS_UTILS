'use strict';

(function () {

    angular.module('rbac.sample.settings.service', [])
        .factory('SettingsService', ['$http', 'RBAC_SAMPLE_URL_SPACE', function($http, RBAC_SAMPLE_URL_SPACE) {
            var settingsService = {};

            settingsService.getSettingByName = function(name) {
                var url = RBAC_SAMPLE_URL_SPACE.urls.local.serverSetting.replace('{name}', name);
                return $http.get(url).then(function(response) {
                    return response.data;
                }, function() {
                    throw 'An error occurred looking up server setting for ' + name;
                });
            };


            return settingsService;
        }]);
})();
