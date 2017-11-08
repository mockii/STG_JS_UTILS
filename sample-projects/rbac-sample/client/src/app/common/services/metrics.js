'use strict';

(function () {

    angular.module('rbac.sample.common.services.metrics', [])
        .factory('MetricsService', ['$q', '$http', 'OMS_URL_SPACE', function($q, $http, OMS_URL_SPACE) {
            var metricsService = {};

            metricsService.getFinancialMetrics = function() {
                var deferred = $q.defer(),
                    url = OMS_URL_SPACE.urls.local.financialMetrics;

                $http.get(url).then(function (response) {
                    deferred.resolve(response.data.data[0]);
                }, function () {
                    deferred.reject('An error occurred getting labor metrics');
                });

                return deferred.promise;
            };

            metricsService.getLaborMetrics = function() {
                var deferred = $q.defer(),
                    url = OMS_URL_SPACE.urls.local.laborMetrics;

                $http.get(url).then(function (response) {
                    deferred.resolve(response.data.data[0]);
                }, function () {
                    deferred.reject('An error occurred getting labor metrics');
                });

                return deferred.promise;
            };

            metricsService.getMetrics = function() {
                var deferred = $q.defer(),
                    promises = {
                        financialMetrics: metricsService.getFinancialMetrics(),
                        laborMetrics: metricsService.getLaborMetrics()
                    };

                $q.all(promises).then(function(data){
                    var metrics = {
                        financialMetrics: data.financialMetrics,
                        laborMetrics: data.laborMetrics,
                        hasFinancialMetrics: (data.financialMetrics) ? true : false,
                        hasLaborMetrics: (data.laborMetrics) ? true : false,
                        hasMetrics: (data.financialMetrics || data.laborMetrics) ? true : false
                    };

                    deferred.resolve(metrics);
                }, function(){

                });

                return deferred.promise;
            };

            return metricsService;
        }]);
})();








