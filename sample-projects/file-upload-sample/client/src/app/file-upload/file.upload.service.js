'use strict';

(function () {

    angular.module('sample.file.upload.service', [])
        .factory('FileUploadService', ['$http', 'SAMPLE_URL_SPACE', function($http, SAMPLE_URL_SPACE) {
            var fileUploadService = {};

            fileUploadService.sendDataToServer = function(formData) {
                return $http.post(SAMPLE_URL_SPACE.urls.local.upload, formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
            };

            return fileUploadService;
        }]);

})();
