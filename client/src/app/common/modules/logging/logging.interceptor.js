/**
 * Created by ChouhR01 on 12/30/2016.
 */
(function () {
    'use strict';
    angular
        .module('common.modules.logging.interceptor', [])
        .factory('STGLoggingInterceptor', ['$log', '$q', function ($log, $q) {
            return {
                request: function (config) {
                    return config;
                },

                requestError: function (request) {
                    $log.error(JSON.stringify(request));
                    return $q.reject(request);
                },

                response: function (response) {
                    return response;
                },

                responseError: function (response) {
                    var error = {
                        method: response.config.method,
                        url: response.config.url,
                        message: response.data,
                        status: response.status
                    };
                    $log.error(JSON.stringify(error));
                    return $q.reject(response);
                }
            };
        }]);
})();